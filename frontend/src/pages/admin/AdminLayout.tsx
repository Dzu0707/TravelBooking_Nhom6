import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  ClipboardList,
  Users,
  LogOut,
  Zap,
  Layers,
  Calendar,
  ChevronRight,
  Bell,
  Search,
  CreditCard,
  Ticket,
  Star,
  Menu,
  ExternalLink,
  Home,
  Newspaper,
  Images,
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user') || '{"fullName":"Quản Trị Viên"}');

  const menuItems = [
    { title: 'Tổng quan', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { title: 'Kho ảnh', path: '/admin/media', icon: <Images size={18} /> },
    { title: 'Quản lý Tour', path: '/admin/tours', icon: <Map size={18} /> },
    { title: 'Danh mục', path: '/admin/categories', icon: <Layers size={18} /> },
    { title: 'Lịch khởi hành', path: '/admin/schedules', icon: <Calendar size={18} /> },
    { title: 'Đơn hàng', path: '/admin/bookings', icon: <ClipboardList size={18} /> },
    { title: 'Giao dịch', path: '/admin/transactions', icon: <CreditCard size={18} /> },
    { title: 'Mã giảm giá', path: '/admin/vouchers', icon: <Ticket size={18} /> },
    { title: 'Đánh giá', path: '/admin/reviews', icon: <Star size={18} /> },
    { title: 'Tin tức', path: '/admin/news', icon: <Newspaper size={18} /> },
    { title: 'Người dùng', path: '/admin/users', icon: <Users size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const currentItem = menuItems.find((item) =>
    item.path === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(item.path)
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 font-sans text-slate-300 antialiased selection:bg-cyan-500/20">
      <aside className="hidden w-72 shrink-0 border-r border-slate-800 bg-slate-900/95 lg:flex lg:flex-col">
        <div className="border-b border-slate-800 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
              <Zap size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                Admin Panel
              </div>
              <div className="mt-1 text-base font-black uppercase tracking-tight text-slate-100">
                Travel<span className="text-cyan-400">Go</span>
              </div>
            </div>
          </div>

          <Link
            to="/"
            className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-emerald-300 transition-all hover:border-emerald-400/30 hover:bg-emerald-500/15"
          >
            <Home size={18} />
            <span className="text-sm font-bold">Xem trang chủ</span>
            <ExternalLink size={14} className="ml-auto opacity-70" />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
          <div className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Hệ thống quản trị
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-3 rounded-2xl px-3 py-3 transition-all ${
                    isActive
                      ? 'border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 shadow-[0_0_0_1px_rgba(34,211,238,0.05)]'
                      : 'border border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-950 hover:text-slate-100'
                  }`}
                >
                  <span
                    className={`transition-colors ${
                      isActive ? 'text-cyan-300' : 'text-slate-500 group-hover:text-cyan-300'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[13px] font-semibold">{item.title}</span>
                  {isActive && <div className="ml-auto h-2 w-2 rounded-full bg-cyan-400" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800 p-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 text-sm font-black text-slate-100">
                {user.fullName?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-slate-100">
                  {user.fullName || 'Admin'}
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-emerald-400">Đang hoạt động</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/15 bg-rose-500/5 py-2.5 text-xs font-bold uppercase text-rose-300 transition-all hover:border-rose-400/25 hover:bg-rose-500/10"
            >
              <LogOut size={14} />
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col bg-slate-950">
        <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/95 px-5 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-400 lg:hidden">
                <Menu size={18} />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  <button
                    onClick={() => navigate('/admin')}
                    className="transition-colors hover:text-cyan-300"
                  >
                    Hệ thống
                  </button>
                  <ChevronRight size={12} className="text-slate-700" />
                  <span className="truncate text-cyan-300">{currentItem?.title || 'Tổng quan'}</span>
                </div>

                <div className="mt-1 text-lg font-black tracking-tight text-slate-100">
                  {currentItem?.title || 'Dashboard'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2 sm:flex">
                <Search size={14} className="text-slate-500" />
                <input
                  type="text"
                  placeholder="Tìm kiếm nhanh..."
                  className="w-44 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
                />
              </div>

              <button
                onClick={() => navigate('/')}
                className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-400 transition-colors hover:text-emerald-400 sm:hidden"
                title="Về trang chủ"
              >
                <Home size={17} />
              </button>

              <button className="relative rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-400 transition-colors hover:text-slate-100">
                <Bell size={16} />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 lg:px-6 lg:py-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 999px; }
      `}</style>
    </div>
  );
};

export default AdminLayout;
