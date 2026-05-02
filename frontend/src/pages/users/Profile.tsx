import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Mail,
  Phone,
  User,
  Save,
  Calendar,
  CheckCircle,
  Package,
  Loader2,
  PencilLine,
  LockKeyhole,
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5091';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    joinDate: '',
    avatarLetter: 'A',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Vui lòng đăng nhập để xem hồ sơ');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();

        const date = data.createdAt
          ? new Date(data.createdAt).toLocaleDateString('vi-VN', {
            month: 'long',
            year: 'numeric',
          })
          : new Date().toLocaleDateString('vi-VN', {
            month: 'long',
            year: 'numeric',
          });

        const userData = {
          name: data.fullName || 'Người dùng',
          role: data.role === 'Admin' ? 'Quản trị viên' : 'Khách hàng',
          email: data.email,
          phone: data.phone || 'Chưa cập nhật',
          joinDate: date,
          avatarLetter: data.fullName?.trim().charAt(0).toUpperCase() || 'A',
        };

        setUser(userData);
        setFormData({
          fullName: data.fullName || '',
          phone: data.phone || '',
          email: data.email || '',
        });
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      } else {
        toast.error('Không thể tải thông tin hồ sơ');
      }
    } catch {
      toast.error('Lỗi kết nối đến máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleCancel = () => {
    setFormData({
      fullName: user.name,
      phone: user.phone === 'Chưa cập nhật' ? '' : user.phone,
      email: user.email,
    });
    setIsEditing(false);
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error('Họ tên không được để trống');
      return;
    }

    setIsSaving(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Cập nhật hồ sơ thành công!');
        setIsEditing(false);
        await fetchProfile();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Lỗi khi cập nhật thông tin');
      }
    } catch {
      toast.error('Có lỗi xảy ra khi gửi dữ liệu!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin mật khẩu');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Xác nhận mật khẩu không khớp');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      setIsChangingPassword(true);
      const response = await fetch(`${API_BASE_URL}/api/users/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordForm),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || 'Không thể đổi mật khẩu');
        return;
      }

      toast.success(result.message || 'Đổi mật khẩu thành công');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch {
      toast.error('Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={44} />
          <p className="font-medium text-slate-500">Đang tải dữ liệu hồ sơ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="h-28 md:h-32 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.28),_transparent_35%),linear-gradient(135deg,#2563eb_0%,#0ea5e9_52%,#22d3ee_100%)]" />
          <div className="-mt-12 flex flex-col gap-6 px-6 pb-8 md:px-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <div className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] border-4 border-white bg-white text-4xl font-black uppercase text-blue-600 shadow-xl shadow-slate-200/70 md:h-28 md:w-28 md:text-5xl">
                {user.avatarLetter}
              </div>

              <div className="pb-1">
                <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {user.role}
                </div>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-[3.25rem]">
                  {user.name}
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500 md:text-base">
                  Quản lý hồ sơ cá nhân, cập nhật thông tin liên hệ và bảo mật tài khoản.
                </p>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <PencilLine size={16} />
                Chỉnh sửa hồ sơ
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.8fr_0.7fr]">
          <div className="space-y-8">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-8 flex items-center gap-3">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Thông tin cá nhân</h2>
                  <p className="text-sm text-slate-500">Các thông tin cơ bản của tài khoản</p>
                </div>
              </div>

              <form onSubmit={handleSave} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <EditableField
                  icon={<User size={18} />}
                  label="Họ tên"
                  value={formData.fullName}
                  isEditing={isEditing}
                  onChange={(v: string) => setFormData({ ...formData, fullName: v })}
                />

                <EditableField
                  icon={<Mail size={18} />}
                  label="Email"
                  value={formData.email}
                  isEditing={isEditing}
                  onChange={(v: string) => setFormData({ ...formData, email: v })}
                />

                <EditableField
                  icon={<Phone size={18} />}
                  label="Số điện thoại"
                  value={formData.phone}
                  isEditing={isEditing}
                  onChange={(v: string) => setFormData({ ...formData, phone: v })}
                />

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    <span className="text-slate-500">
                      <LockKeyhole size={18} />
                    </span>
                    Bảo mật
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowPasswordForm((prev) => !prev)}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-blue-300 hover:bg-white"
                  >
                    <div>
                      <p className="text-base font-semibold text-slate-900">Đổi mật khẩu</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Cập nhật mật khẩu để bảo vệ tài khoản
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white">
                      {showPasswordForm ? 'Đóng' : 'Mở'}
                    </span>
                  </button>
                </div>
              </form>

              {showPasswordForm && (
                <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5 md:p-6">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-2xl bg-white p-3 text-blue-600 shadow-sm">
                      <LockKeyhole size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Đổi mật khẩu</h3>
                      <p className="text-sm text-slate-500">
                        Nhập mật khẩu hiện tại và mật khẩu mới của bạn
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePassword} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <PasswordField
                      label="Mật khẩu hiện tại"
                      value={passwordForm.currentPassword}
                      onChange={(v: string) => setPasswordForm({ ...passwordForm, currentPassword: v })}
                    />

                    <div className="hidden md:block" />

                    <PasswordField
                      label="Mật khẩu mới"
                      value={passwordForm.newPassword}
                      onChange={(v: string) => setPasswordForm({ ...passwordForm, newPassword: v })}
                    />

                    <PasswordField
                      label="Xác nhận mật khẩu mới"
                      value={passwordForm.confirmPassword}
                      onChange={(v: string) => setPasswordForm({ ...passwordForm, confirmPassword: v })}
                    />

                    <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
                      >
                        {isChangingPassword ? (
                          <>
                            <Loader2 className="animate-spin" size={16} />
                            Đang cập nhật...
                          </>
                        ) : (
                          <>
                            <LockKeyhole size={16} />
                            Đổi mật khẩu
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordForm({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: '',
                          });
                        }}
                        className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-white"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-2">
            <StatCard icon={<Calendar size={20} />} label="Ngày tham gia" value={user.joinDate} />
            <StatCard
              icon={<CheckCircle size={20} />}
              label="Trạng thái"
              value="Đã xác thực"
              color="text-green-600"
            />

            <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-7 text-white shadow-sm">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-cyan-500/10 blur-2xl" />
              <div className="absolute -bottom-10 -right-6 text-slate-700/40">
                <Package size={120} strokeWidth={1.2} />
              </div>

              <div className="relative z-10">
                <div className="mb-3 flex items-center gap-2 text-cyan-300">
                  <Package size={18} />
                  <span className="text-xs font-bold uppercase tracking-[0.18em]">
                    Đơn hàng của tôi
                  </span>
                </div>
                <p className="text-5xl font-black tracking-tight">12</p>
                <p className="mt-2 text-sm text-slate-300">Đơn đặt tour đã được ghi nhận</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const EditableField = ({ icon, label, value, isEditing, onChange }: any) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
      <span className="text-slate-500">{icon}</span>
      {label}
    </label>

    {isEditing ? (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />
    ) : (
      <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-base font-semibold text-slate-900">
        {value || 'Chưa cập nhật'}
      </div>
    )}
  </div>
);

const PasswordField = ({ label, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{label}</label>
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
    />
  </div>
);

const StatCard = ({ icon, label, value, color = 'text-slate-900' }: any) => (
  <div className="flex items-center gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
    <div className="rounded-2xl bg-slate-100 p-3 text-blue-600">{icon}</div>
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-black tracking-tight ${color}`}>{value}</p>
    </div>
  </div>
);

export default Profile;
