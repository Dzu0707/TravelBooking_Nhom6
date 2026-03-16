import { useEffect, useState } from 'react';
import axios from 'axios';
import { Map, Users, ClipboardList, LogOut, ChevronRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPortal = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ tours: 0, bookings: 0, users: 0, revenue: 0 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        const authHeader = { headers: { Authorization: `Bearer ${token}` } };

        // Gọi đồng thời 3 API
        const [tours, bookings, users] = await Promise.all([
          axios.get('http://localhost:5091/api/Tours'), // Không cần token (tùy config)
          axios.get('http://localhost:5091/api/Bookings', authHeader), // Cần token Admin
          axios.get('http://localhost:5091/api/Users', authHeader)     // Cần token Admin
        ]);

        // Tính tổng doanh thu từ field TotalPrice của class Booking (C#)
        const totalRev = bookings.data.reduce((acc: number, item: any) => acc + (item.totalPrice || 0), 0);

        setStats({
          tours: tours.data.length,
          bookings: bookings.data.length,
          users: users.data.length,
          revenue: totalRev
        });
      } catch (err) {
        console.error("Lỗi tải dữ liệu Dashboard. Check token Admin!", err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter">ADMIN DASHBOARD</h1>
          <button onClick={() => navigate('/login')} className="px-5 py-2 bg-white text-red-500 font-bold rounded-xl border border-red-100 shadow-sm flex items-center gap-2">
            <LogOut size={18}/> Thoát
          </button>
        </div>

        {/* Card Doanh Thu */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 mb-10 transition-all hover:shadow-md">
          <div className="p-5 bg-orange-50 rounded-2xl text-orange-600"><TrendingUp size={35}/></div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Tổng doanh thu hệ thống</p>
            <p className="text-4xl font-black text-gray-800">{stats.revenue.toLocaleString()}đ</p>
          </div>
        </div>

        {/* Grid Điều hướng */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Quản lý Tour', val: stats.tours, path: '/admin/tours', color: 'bg-blue-50', icon: <Map className="text-blue-600"/> },
            { label: 'Đơn hàng', val: stats.bookings, path: '/admin/bookings', color: 'bg-emerald-50', icon: <ClipboardList className="text-emerald-600"/> },
            { label: 'Người dùng', val: stats.users, path: '/admin/users', color: 'bg-purple-50', icon: <Users className="text-purple-600"/> },
          ].map((item, i) => (
            <div key={i} onClick={() => navigate(item.path)} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
              <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mb-6`}>{item.icon}</div>
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{item.label}</h3>
                  <p className="text-blue-600 font-black text-2xl mt-1">{item.val}</p>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;