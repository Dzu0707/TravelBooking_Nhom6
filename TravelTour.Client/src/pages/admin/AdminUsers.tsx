import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Search, UserCheck, UserX, Shield, Mail, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const navigate = useNavigate();
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
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/admin')} 
          className="flex items-center gap-2 text-gray-500 mb-6 font-bold hover:text-blue-600 transition-all"
        >
          <ArrowLeft size={20}/> Quay lại Dashboard
        </button>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Quản lý Người dùng</h1>
            <p className="text-gray-500">Hệ thống có {users.length} tài khoản đang hoạt động</p>
          </div>
          
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Tìm theo tên hoặc email..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-5 text-xs font-black text-gray-400 uppercase">Người dùng</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase">Vai trò</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase">Ngày tham gia</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center text-gray-400 font-bold italic">Đang tải danh sách thành viên...</td></tr>
              ) : filteredUsers.map((u: any) => (
                <tr key={u.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-black text-lg">
                        {u.fullName?.substring(0,1).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{u.fullName}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12}/> {u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      {u.role === "Admin" ? (
                        <span className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded-lg uppercase">
                          <Shield size={12}/> Admin
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-black rounded-lg uppercase">
                          Khách hàng
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-5 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14}/> 
                      {new Date(u.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-end gap-2">
                      <button title="Khóa tài khoản" className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <UserX size={18}/>
                      </button>
                      <button title="Kích hoạt" className="p-2 text-gray-300 hover:text-green-500 hover:bg-green-50 rounded-xl transition-all">
                        <UserCheck size={18}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!loading && filteredUsers.length === 0 && (
            <div className="p-20 text-center text-gray-400">Không tìm thấy người dùng phù hợp.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;