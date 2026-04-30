import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, User, Save, Calendar, CheckCircle, Package, Loader2 } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    address: '',
    joinDate: '',
    avatarLetter: 'A'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', address: '' });

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Vui lòng đăng nhập để xem hồ sơ');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5091/api/users/profile', {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Format ngày tháng từ database hoặc dùng ngày hiện tại nếu null
        const date = data.createdAt 
            ? new Date(data.createdAt).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
            : new Date().toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
        
        const userData = {
          name: data.fullName || 'Người dùng',
          role: data.role === 'Admin' ? 'Quản trị viên' : 'Khách hàng',
          email: data.email,
          phone: data.phone || 'Chưa cập nhật',
          address: data.address || 'Chưa cập nhật',
          joinDate: date, 
          avatarLetter: data.fullName?.trim().charAt(0).toUpperCase() || 'A'
        };

        setUser(userData);
        setFormData({ 
            fullName: data.fullName || '', 
            phone: data.phone || '', 
            email: data.email || '', 
            address: data.address || '' 
        });
      } else if (response.status === 401) {
          // Xử lý khi Token hết hạn
          localStorage.removeItem('token');
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      } else {
          toast.error("Không thể tải thông tin hồ sơ");
      }
    } catch (err) { 
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
        address: user.address === 'Chưa cập nhật' ? '' : user.address 
    });
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return toast.error("Họ tên không được để trống");
    
    setIsSaving(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:5091/api/users/update-profile', {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Cập nhật hồ sơ thành công!');
        setIsEditing(false);
        // Tải lại dữ liệu để cập nhật Header và giao diện
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={48} />
            <p className="text-slate-500 font-medium">Đang tải dữ liệu hồ sơ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 bg-slate-50 min-h-screen">
      
      {/* HEADER SECTION WITH COVER */}
      <div className="relative bg-white rounded-t-[2.5rem] rounded-b-3xl shadow-sm border border-slate-100 mb-8 overflow-hidden">
        <div className="h-60 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400"></div>

        <div className="px-10 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 relative z-10 -mt-16">
          {/* Avatar */}
          <div className="w-40 h-40 bg-white rounded-3xl shadow-xl flex items-center justify-center text-blue-600 text-7xl font-black uppercase border-[6px] border-white ring-1 ring-slate-100">
            {user.avatarLetter}
          </div>

          {/* Name and Role */}
          <div className="flex-1 pb-2 md:text-left text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{user.name}</h1>
            <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2 mt-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-green-100"></span> 
              {user.role}
            </p>
          </div>
          
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)} 
              className="flex items-center justify-center px-8 py-3.5 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 duration-300 md:mb-2"
            >
              Chỉnh sửa hồ sơ
            </button>
          ) : (
            <div className="flex items-center gap-3 md:mb-2">
              <button 
                type="button"
                onClick={handleCancel} 
                className="px-6 py-3.5 text-slate-500 font-bold hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-3.5 bg-green-600 text-white rounded-full font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all duration-300 active:scale-95 disabled:opacity-50"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18}/> Đang lưu...</span>
                ) : (
                  <><Save size={18}/> Lưu thay đổi</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                 <User className="text-blue-600" size={22}/> Thông tin cá nhân
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8">
                <EditableField icon={<User size={18}/>} label="Họ tên" value={formData.fullName} isEditing={isEditing} onChange={(v: string) => setFormData({...formData, fullName: v})} />
                <EditableField icon={<Mail size={18}/>} label="Email" value={formData.email} isEditing={isEditing} onChange={(v: string) => setFormData({...formData, email: v})} />
                <EditableField icon={<Phone size={18}/>} label="Số điện thoại" value={formData.phone} isEditing={isEditing} onChange={(v: string) => setFormData({...formData, phone: v})} />
                <div className="md:col-span-2">
                    <EditableField icon={<MapPin size={18}/>} label="Địa chỉ liên hệ" value={formData.address} isEditing={isEditing} onChange={(v: string) => setFormData({...formData, address: v})} />
                </div>
              </div>
           </div>
        </div>

        {/* RIGHT: Stats */}
        <div className="space-y-5">
           <StatCard icon={<Calendar size={22}/>} label="Ngày tham gia" value={user.joinDate} />
           <StatCard icon={<CheckCircle size={22}/>} label="Trạng thái" value="Đã xác thực" color="text-green-600" />
           
           <div className="p-8 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
             <div className="absolute -right-10 -bottom-10 text-blue-500 opacity-20 group-hover:scale-110 transition-transform duration-500">
                <Package size={160} strokeWidth={1} />
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-2.5 text-blue-100 mb-2">
                    <Package size={20}/> <span className="text-sm font-medium uppercase tracking-wider">Đơn hàng của tôi</span>
                </div>
                <p className="text-6xl font-black tracking-tight">12</p>
                <p className="text-blue-100 text-sm mt-1">Đơn đặt phòng & vé</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// SUB-COMPONENTS
const EditableField = ({ icon, label, value, isEditing, onChange }: any) => (
    <div className="group relative">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2.5">
            {icon} {label}
        </label>
        {isEditing ? (
            <input 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all font-semibold text-slate-800 focus:bg-white"
            />
        ) : (
            <p className="text-slate-900 font-semibold text-xl px-1">{value || 'Chưa cập nhật'}</p>
        )}
    </div>
);

const StatCard = ({ icon, label, value, color = "text-slate-900" }: any) => (
  <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 hover:border-slate-200 transition-colors">
    <div className="p-4 rounded-2xl bg-slate-50 text-blue-600 shadow-inner">
        {icon}
    </div>
    <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className={`font-extrabold text-2xl tracking-tight mt-0.5 ${color}`}>{value}</p>
    </div>
  </div>
);

export default Profile;