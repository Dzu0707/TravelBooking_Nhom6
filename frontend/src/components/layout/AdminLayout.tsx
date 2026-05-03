import { useEffect, useState } from 'react';
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
  CreditCard,
  Ticket,
  Star,
  Menu,
  X,
  ExternalLink,
  Home,
  Newspaper,
  Images,
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{"fullName":"Quản Trị Viên"}');

  const menuItems = [
    { title: 'Tổng quan', path: '/admin', icon: <LayoutDashboard size={17} /> },
    { title: 'Kho ảnh', path: '/admin/media', icon: <Images size={17} /> },
    { title: 'Quản lý Tour', path: '/admin/tours', icon: <Map size={17} /> },
    { title: 'Danh mục', path: '/admin/categories', icon: <Layers size={17} /> },
    { title: 'Lịch khởi hành', path: '/admin/schedules', icon: <Calendar size={17} /> },
    { title: 'Đơn hàng', path: '/admin/bookings', icon: <ClipboardList size={17} /> },
    { title: 'Giao dịch', path: '/admin/transactions', icon: <CreditCard size={17} /> },
    { title: 'Mã giảm giá', path: '/admin/vouchers', icon: <Ticket size={17} /> },
    { title: 'Đánh giá', path: '/admin/reviews', icon: <Star size={17} /> },
    { title: 'Tin tức', path: '/admin/news', icon: <Newspaper size={17} /> },
    { title: 'Người dùng', path: '/admin/users', icon: <Users size={17} /> },
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

  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const renderSidebarContent = (isMobile = false) => (
    <>
      <div className="border-b border-slate-800 px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl border border-cyan-500/25 bg-cyan-500/10 text-cyan-300">
            <Zap size={17} />
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-300">
              Admin
            </div>
            <div className="mt-0.5 text-sm font-black uppercase tracking-tight text-slate-100">
              Travel<span className="text-cyan-400">Go</span>
            </div>
          </div>
        </div>

        <Link
          to="/"
          onClick={isMobile ? closeMobileMenu : undefined}
          className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-emerald-300 transition-all hover:border-emerald-400/30 hover:bg-emerald-500/15"
        >
          <Home size={16} />
          <span className="text-xs font-bold">Trang chủ</span>
          <ExternalLink size={13} className="ml-auto opacity-70" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 custom-scrollbar">
        <div className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Quản trị
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
                onClick={isMobile ? closeMobileMenu : undefined}
                className={`group flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition-all ${
                  isActive
                    ? 'border border-cyan-500/25 bg-cyan-500/10 text-cyan-300'
                    : 'border border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-950 hover:text-slate-100'
                }`}
              >
                <span className={isActive ? 'text-cyan-300' : 'text-slate-500 group-hover:text-cyan-300'}>
                  {item.icon}
                </span>
                <span className="text-[12px] font-semibold truncate">{item.title}</span>
                {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 font-sans text-slate-300 antialiased selection:bg-cyan-500/20">
      {/* Desktop sidebar (gọn lại) */}
      <aside className="hidden w-60 xl:w-64 shrink-0 border-r border-slate-800 bg-slate-900/95 lg:flex lg:flex-col">
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition ${
          mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div
          onClick={closeMobileMenu}
          className={`absolute inset-0 bg-black/60 transition-opacity ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-[84%] max-w-[300px] border-r border-slate-800 bg-slate-900 transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-end px-3 pt-3">
              <button
                onClick={closeMobileMenu}
                className="rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-300"
                aria-label="Đóng menu"
              >
                <X size={17} />
              </button>
            </div>
            {renderSidebarContent(true)}
          </div>
        </aside>
      </div>

      <main className="flex min-w-0 flex-1 flex-col bg-slate-950">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/95 px-3 py-3.5 backdrop-blur sm:px-5 sm:py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            {/* Left */}
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-300 lg:hidden"
                aria-label="Mở menu quản trị"
              >
                <Menu size={18} />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  <button
                    onClick={() => navigate('/admin')}
                    className="transition-colors hover:text-cyan-300"
                  >
                    Hệ thống
                  </button>
                  <ChevronRight size={12} className="text-slate-700" />
                  <span className="truncate text-cyan-300">{currentItem?.title || 'Tổng quan'}</span>
                </div>
                <div className="mt-0.5 text-base sm:text-lg font-black tracking-tight text-slate-100 truncate">
                  {currentItem?.title || 'Dashboard'}
                </div>
              </div>
            </div>

            {/* Right: admin info + logout */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/')}
                className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-400 transition-colors hover:text-emerald-400 lg:hidden"
                title="Về trang chủ"
              >
                <Home size={16} />
              </button>

              <div className="hidden sm:flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-3 py-2">
                <div className="flex size-7 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-[11px] font-black text-slate-100">
                  {user.fullName?.charAt(0) || 'A'}
                </div>
                <div className="max-w-[140px] truncate text-xs font-bold text-slate-100">
                  {user.fullName || 'Admin'}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-rose-300 transition hover:bg-rose-500/20"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content rộng hơn */}
        <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
          <div className="mx-auto max-w-[1600px]">
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