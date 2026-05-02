import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Search,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Calendar,
  Users,
  Fingerprint,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5091/api/Users';

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.get(API_BASE_URL, config);
      setUsers(res.data);
    } catch (err) {
      console.error('Lỗi lấy danh sách user:', err);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleLock = async (user: any) => {
    const actionText = user.isLocked ? 'mở khóa' : 'khóa';
    if (!window.confirm(`Bạn có chắc muốn ${actionText} tài khoản ${user.fullName}?`)) return;

    try {
      setActionLoadingId(user.id);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.put(`${API_BASE_URL}/${user.id}/toggle-lock`, {}, config);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isLocked: !u.isLocked } : u
        )
      );

      toast.success(res.data?.message || `Đã ${actionText} tài khoản`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || `Không thể ${actionText} tài khoản`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u: any) =>
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-xl border border-slate-800 bg-slate-900/95 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(2,6,23,0.45)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
              User Management
            </div>
            <h1 className="mt-2 flex items-center gap-2 text-lg font-black uppercase tracking-tight text-slate-100">
              Quản trị thành viên <Users size={18} className="text-cyan-400" />
            </h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
              <Fingerprint size={14} className="text-slate-500" />
              Tổng số: {users.length} tài khoản hệ thống
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc email..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-600 focus:border-cyan-500/40"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-none">
        <table className="w-full border-collapse text-left">
          <thead className="bg-slate-950/60">
            <tr className="border-b border-slate-800/50">
              <th className="p-5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Danh tính người dùng
              </th>
              <th className="p-5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Quyền hạn
              </th>
              <th className="p-5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Trạng thái
              </th>
              <th className="p-5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Ngày gia nhập
              </th>
              <th className="p-5 text-right text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Quản lý
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/50">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-cyan-400" size={30} />
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Đang tải dữ liệu người dùng...
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((u: any) => (
                <tr
                  key={u.id}
                  className="group border-b border-slate-800/40 transition-colors hover:bg-slate-800/30"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-sm font-black text-cyan-300">
                        {u.fullName?.substring(0, 1).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-100 transition-colors group-hover:text-cyan-300">
                          {u.fullName}
                        </p>
                        <p className="mt-1 flex truncate items-center gap-1.5 text-[11px] text-slate-500">
                          <Mail size={10} className="text-slate-600" />
                          {u.email}
                        </p>
                        {u.phone && (
                          <p className="mt-1 text-[10px] text-slate-600">{u.phone}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="p-5">
                    {u.roleName === 'Admin' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-rose-400">
                        <Shield size={10} />
                        Admin hệ thống
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-300">
                        Khách hàng
                      </span>
                    )}
                  </td>

                  <td className="p-5">
                    {u.isLocked ? (
                      <span className="inline-flex items-center rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-rose-400">
                        Đã khóa
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                        Hoạt động
                      </span>
                    )}
                  </td>

                  <td className="p-5">
                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                      <Calendar size={12} className="text-slate-600" />
                      {new Date(u.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                    </div>
                  </td>

                  <td className="p-5">
                    <div className="flex justify-end gap-2">
                      {actionLoadingId === u.id ? (
                        <Loader2 className="animate-spin text-cyan-400" size={18} />
                      ) : (
                        <button
                          title={u.isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                          onClick={() => handleToggleLock(u)}
                          className={`rounded-lg border p-2.5 transition-colors ${
                            u.isLocked
                              ? 'border-emerald-500/15 bg-emerald-500/5 text-emerald-300 hover:bg-emerald-500/10'
                              : 'border-rose-500/15 bg-rose-500/5 text-rose-300 hover:bg-rose-500/10'
                          }`}
                        >
                          {u.isLocked ? <UserCheck size={16} /> : <UserX size={16} />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!loading && filteredUsers.length === 0 && (
          <div className="flex flex-col items-center gap-3 p-20">
            <div className="flex size-12 items-center justify-center rounded-full border border-slate-800 bg-slate-950 text-slate-600">
              <Search size={20} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Không tìm thấy thành viên phù hợp
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
