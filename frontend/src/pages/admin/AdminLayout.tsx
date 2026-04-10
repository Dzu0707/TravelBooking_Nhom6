import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Map, ClipboardList, 
  Users, LogOut, Zap, Layers, Calendar, ChevronRight, Bell, Search,
  CreditCard, Ticket, Star, Menu, ExternalLink, Home // Thêm ExternalLink và Home
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const user = JSON.parse(localStorage.getItem('user') || '{"fullName": "Quản Trị Viên"}');

  const menuItems = [
    { title: 'Tổng quan', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { title: 'Quản lý Tour', path: '/admin/tours', icon: <Map size={18} /> },
    { title: 'Danh mục', path: '/admin/categories', icon: <Layers size={18} /> },
    { title: 'Lịch khởi hành', path: '/admin/schedules', icon: <Calendar size={18} /> },
    { title: 'Đơn hàng', path: '/admin/bookings', icon: <ClipboardList size={18} /> },
    { title: 'Giao dịch', path: '/admin/transactions', icon: <CreditCard size={18} /> },
    { title: 'Mã giảm giá', path: '/admin/vouchers', icon: <Ticket size={18} /> },
    { title: 'Đánh giá', path: '/admin/reviews', icon: <Star size={18} /> },
    { title: 'Người dùng', path: '/admin/users', icon: <Users size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const currentItem = menuItems.find(item => 
    item.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.path)
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-400 font-sans antialiased overflow-hidden selection:bg-blue-500/30">
      
      <aside className="hidden lg:flex w-60 bg-slate-900 border-r border-slate-800 flex-col transition-all">
        
        <div className="h-14 flex items-center px-5 gap-3 border-b border-slate-800">
          <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
            <Zap size={16} className="text-white fill-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-100 uppercase">
            Travel<span className="text-blue-500">Go</span>
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          {/* NÚT QUAY VỀ TRANG CHỦ */}
          <Link 
            to="/" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-md mb-4 bg-emerald-500/5 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/10 transition-all group"
          >
            <Home size={18} />
            <span className="text-[13px] font-bold">Xem trang chủ</span>
            <ExternalLink size={12} className="ml-auto opacity-50 group-hover:opacity-100" />
          </Link>

          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 mb-2">Hệ thống quản trị</p>
          
          {menuItems.map((item) => {
            const isActive = item.path === '/admin' 
              ? location.pathname === '/admin' 
              : location.pathname.startsWith(item.path);
            
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-slate-800 text-blue-400 border border-slate-700' 
                    : 'hover:bg-slate-800/50 hover:text-slate-200 text-slate-500'
                }`}
              >
                <span className={isActive ? 'text-blue-500' : 'text-slate-600'}>
                  {item.icon}
                </span>
                <span className="text-[13px] font-medium">{item.title}</span>
                {isActive && <div className="ml-auto w-1 h-3 rounded-full bg-blue-500" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 p-2 rounded-lg border border-slate-800 mb-2">
            <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-white text-xs font-bold border border-slate-600">
              {user.fullName?.charAt(0) || 'A'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-slate-200 truncate">{user.fullName || 'Admin'}</span>
              <span className="text-[9px] text-emerald-500 font-medium">Online</span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 py-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded transition-colors text-[11px] font-bold border border-transparent hover:border-rose-500/10"
          >
            <LogOut size={13} /> 
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1 text-slate-500">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-medium uppercase tracking-wider">
              <span className="hover:text-blue-400 cursor-pointer" onClick={() => navigate('/admin')}>Hệ thống</span>
              <ChevronRight size={12} className="text-slate-700" />
              <span className="text-slate-200 font-bold">{currentItem?.title || 'Dashboard'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-slate-950 border border-slate-800 px-3 py-1 rounded gap-2 focus-within:border-slate-600 transition-all">
              <Search size={12} className="text-slate-600" />
              <input type="text" placeholder="Tìm kiếm nhanh..." className="bg-transparent border-none outline-none text-[11px] text-slate-300 w-40 placeholder:text-slate-700" />
            </div>
            {/* Nút trang chủ nhanh trên Header dành cho Mobile/Tablet */}
            <button 
              onClick={() => navigate('/')} 
              className="p-2 text-slate-500 hover:text-emerald-400 sm:hidden"
              title="Về trang chủ"
            >
              <Home size={18} />
            </button>
            <button className="p-2 text-slate-500 hover:text-slate-200 relative">
              <Bell size={16} />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-600 rounded-full" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 lg:p-6 bg-slate-950">
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        * { transition-duration: 150ms !important; }
      `}</style>
    </div>
  );
};

export default AdminLayout;