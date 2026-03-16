import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Map, Users, ClipboardList, Settings, 
  BarChart3, LogOut, ChevronRight, TrendingUp 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPortal = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    tours: 0,
    bookings: 0,
    users: 0,
    revenue: 0
  });

  // 1. Gọi API lấy dữ liệu tổng hợp
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Gọi đồng thời các API (Đảm bảo các endpoint này tồn tại ở Backend của bạn)
        const [toursRes, bookingsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:5091/api/Tours'),
          axios.get('http://localhost:5091/api/Bookings'), // Endpoint giả định
          axios.get('http://localhost:5091/api/Users')     // Endpoint giả định
        ]);

        // Tính toán doanh thu từ danh sách đơn hàng (ví dụ cộng dồn field totalAmount)
        const totalRevenue = bookingsRes.data.reduce((sum: number, item: any) => sum + (item.totalAmount || 0), 0);

        setStats({
          tours: toursRes.data.length,
          bookings: bookingsRes.data.length,
          users: usersRes.data.length,
          revenue: totalRevenue
        });
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu Dashboard:", err);
      }
    };

    fetchDashboardData();
  }, []);

  const adminName = "Quản trị viên";

  const menuItems = [
    {
      title: 'Quản lý Tours',
      description: 'Thêm, sửa, xóa và điều chỉnh lịch trình các tour du lịch.',
      icon: <Map className="text-blue-600" size={32} />,
      path: '/admin/tours',
      color: 'bg-blue-50',
      count: `${stats.tours} Tours` // Dữ liệu thật
    },
    {
      title: 'Quản lý Đơn hàng',
      description: 'Xem danh sách đặt chỗ, xác nhận thanh toán và hủy tour.',
      icon: <ClipboardList className="text-emerald-600" size={32} />,
      path: '/admin/bookings',
      color: 'bg-emerald-50',
      count: `${stats.bookings} Đơn` // Dữ liệu thật
    },
    {
      title: 'Người dùng',
      description: 'Quản lý tài khoản khách hàng và phân quyền nhân viên.',
      icon: <Users className="text-purple-600" size={32} />,
      path: '/admin/users',
      color: 'bg-purple-50',
      count: `${stats.users} User` // Dữ liệu thật
    },
    {
      title: 'Báo cáo Thống kê',
      description: 'Xem doanh thu, biểu đồ tăng trưởng và hiệu suất tour.',
      icon: <BarChart3 className="text-orange-600" size={32} />,
      path: '/admin/stats',
      color: 'bg-orange-50',
      count: 'Live'
    },
    {
      title: 'Cấu hình hệ thống',
      description: 'Chỉnh sửa thông tin website, email và các tham số khác.',
      icon: <Settings className="text-gray-600" size={32} />,
      path: '/admin/settings',
      color: 'bg-gray-100',
      count: null
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Hệ thống Quản trị</h1>
            <p className="text-gray-500 mt-1">Chào mừng quay trở lại, <span className="font-semibold text-blue-600">{adminName}</span></p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-red-500 font-bold rounded-xl shadow-sm border border-red-100 hover:bg-red-50 transition-all w-fit"
          >
            <LogOut size={20} /> Đăng xuất
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-orange-50 rounded-2xl text-orange-600"><TrendingUp /></div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Tổng doanh thu</p>
              <p className="text-2xl font-black text-gray-800">
                {(stats.revenue / 1000000).toFixed(1)}Mđ
              </p>
            </div>
          </div>
          {/* Bạn có thể thêm các Stats khác ở đây */}
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <div 
              key={index}
              onClick={() => navigate(item.path)}
              className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${item.color} opacity-50 group-hover:scale-150 transition-transform duration-500`} />
              
              <div className="relative z-10">
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                  {item.count && (
                    <span className="text-[10px] uppercase tracking-widest font-black bg-blue-600 text-white px-2 py-1 rounded-md shadow-sm">
                      {item.count}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="flex items-center text-sm font-bold text-blue-600 group-hover:gap-2 transition-all">
                  Truy cập quản lý <ChevronRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-16 italic">
          Dữ liệu được cập nhật trực tiếp từ hệ thống SQL Server
        </p>
      </div>
    </div>
  );
};

export default AdminPortal;