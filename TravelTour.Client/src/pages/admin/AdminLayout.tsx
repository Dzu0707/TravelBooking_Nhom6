import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, ClipboardList, Users, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { title: 'Quản lý Tours', path: '/admin/tours', icon: <Map size={20} /> },
    { title: 'Đơn hàng', path: '/admin/bookings', icon: <ClipboardList size={20} /> },
    { title: 'Người dùng', path: '/admin/users', icon: <Users size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 text-2xl font-black text-blue-600">TRAVEL ADMIN</div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className="flex items-center gap-3 px-6 py-4 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all font-bold">
              {item.icon} {item.title}
            </Link>
          ))}
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-6 py-4 text-red-500 hover:bg-red-50 mt-10 font-bold">
            <LogOut size={20} /> Thoát Admin
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet /> {/* Đây là nơi nội dung của AdminTours, AdminBookings... sẽ hiện ra */}
      </main>
    </div>
  );
};

export default AdminLayout;