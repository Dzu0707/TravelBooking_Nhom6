import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, UserCheck, UserX, Shield, Mail, Calendar, Users, Fingerprint } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.get('http://localhost:5091/api/Users', config);
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = users.filter((u: any) =>
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5 text-[13px] animate-in fade-in duration-500">
      {/* Header gọn nhẹ */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-2">
            Quản trị thành viên <Users size={18} className="text-blue-500"/>
          </h1>
          <p className="text-[11px] text-slate-500 font-bold tracking-widest uppercase mt-1 flex items-center gap-2">
            <Fingerprint size={14} className="text-purple-500"/>
            Tổng số: {users.length} tài khoản hệ thống
          </p>
        </div>
        
        <div className="relative group w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={14} />
          <input 
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl text-[12px] text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Content - Glassmorphism style */}
      <div className="bg-[#1E293B]/20 rounded-2xl border border-slate-800/50 overflow-hidden shadow-2xl backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/40 border-b border-slate-800">
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Danh tính người dùng</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Quyền hạn</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ngày gia nhập</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Quản lý</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Authenticating data...</p>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.map((u: any) => (
              <tr key={u.id} className="hover:bg-blue-600/5 transition-all group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-blue-400 font-black text-[14px] shadow-inner shrink-0 group-hover:border-blue-500/30 transition-colors">
                      {u.fullName?.substring(0,1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-200 text-[13px] mb-0.5 group-hover:text-blue-400 transition-colors truncate">{u.fullName}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium truncate italic">
                        <Mail size={10} className="text-slate-600"/> {u.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {u.role === "Admin" ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[9px] font-black rounded border border-rose-500/20 uppercase tracking-tight">
                      <Shield size={10}/> Admin hệ thống
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 bg-slate-800 text-slate-400 text-[9px] font-black rounded border border-slate-700 uppercase tracking-tight">
                      Khách hàng
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
                    <Calendar size={12} className="text-slate-600"/> 
                    {new Date(u.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-1 opacity-20 group-hover:opacity-100 transition-all">
                    <button title="Khóa tài khoản" className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all border border-transparent hover:border-rose-500/20">
                      <UserX size={16}/>
                    </button>
                    <button title="Kích hoạt / Mở khóa" className="p-2 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all border border-transparent hover:border-emerald-500/20">
                      <UserCheck size={16}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {!loading && filteredUsers.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center gap-3">
             <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-600 border border-slate-700">
                <Search size={20}/>
             </div>
             <p className="text-slate-500 font-black text-[11px] uppercase tracking-widest">Không tìm thấy thành viên phù hợp</p>
          </div>
        )}
      </div>

      {/* Footer info siêu nhỏ */}
      <footer className="pt-2 flex justify-between items-center text-slate-600 text-[10px] font-black uppercase tracking-tighter italic">
          <p>© 2026 LA Home Travel • Security Protocol Active</p>
          <div className="flex gap-4">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span> Access Level: Root</span>
          </div>
      </footer>
    </div>
  );
};

export default AdminUsers;