import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  User,
  ChevronDown,
  Compass,
  Newspaper,
  Menu,
  X,
  ReceiptText,
  Tag,
  Info,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const fullName = localStorage.getItem('fullName') || 'Thành viên';

  const isLoggedIn = !!token;
  const isAdmin = isLoggedIn && (role === '1' || role === 'Admin');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setShowDropdown(false);
    setShowMobileMenu(false);
  }, [location.pathname]);

  const handleLogout = () => {
    ['token', 'user', 'role', 'fullName', 'email', 'phone', 'address'].forEach((k) =>
      localStorage.removeItem(k)
    );
    navigate('/login', { replace: true });
    setTimeout(() => window.location.reload(), 100);
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navLinkClass = (active: boolean) =>
    `group relative inline-flex items-center gap-2 px-1 py-2 text-sm font-semibold transition ${
      active ? 'text-sky-600' : 'text-slate-600 hover:text-sky-600'
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/40 bg-white/85 backdrop-blur-xl shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      <div className="mx-auto flex h-16 sm:h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-md shadow-sky-100 ring-1 ring-slate-200">
            <img src="/logo-travel-tour.svg" alt="TravelGo Logo" className="h-7 w-7 sm:h-8 sm:w-8 object-contain" />
          </div>
          <div className="leading-tight min-w-0">
            <div className="text-base sm:text-lg font-black tracking-tight text-slate-900 truncate">TravelGo</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-600">
              Travel Tour
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-7 md:flex">
          <Link to="/" className={navLinkClass(isActive('/'))}>
            Trang chủ
            <span className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-sky-600 transition-all duration-300 ${isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </Link>

          <Link to="/about" className={navLinkClass(isActive('/about'))}>
            <Info size={15} />
            Về chúng tôi
            <span className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-sky-600 transition-all duration-300 ${isActive('/about') ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </Link>

          <Link to="/tours" className={navLinkClass(isActive('/tours'))}>
            <Compass size={15} />
            Tour
            <span className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-sky-600 transition-all duration-300 ${isActive('/tours') ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </Link>

          <Link to="/vouchers" className={navLinkClass(isActive('/vouchers'))}>
            <Tag size={15} />
            Ưu đãi
            <span className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-sky-600 transition-all duration-300 ${isActive('/vouchers') ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </Link>

          <Link to="/news" className={navLinkClass(isActive('/news'))}>
            <Newspaper size={15} />
            Tin tức
            <span className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-sky-600 transition-all duration-300 ${isActive('/news') ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </Link>

          {isLoggedIn && (
            <Link to="/my-bookings" className={navLinkClass(isActive('/my-bookings'))}>
              <ReceiptText size={15} />
              Đơn hàng
              <span className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-sky-600 transition-all duration-300 ${isActive('/my-bookings') ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
          )}
        </div>

        {/* Desktop auth */}
        <div className="hidden items-center gap-2.5 md:flex">
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-2 text-sm font-bold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"
                >
                  <LayoutDashboard size={14} />
                  Admin
                </Link>
              )}

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition hover:border-slate-300 hover:shadow"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#38bdf8_0%,#2563eb_100%)] text-sm font-black text-white">
                    {fullName.charAt(0).toUpperCase()}
                  </div>

                  <div className="hidden text-left lg:block">
                    <p className="max-w-[130px] truncate text-sm font-bold text-slate-800">{fullName}</p>
                    <p className="text-xs text-slate-400">{isAdmin ? 'Quản trị viên' : 'Khách hàng'}</p>
                  </div>

                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2.5 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
                    <div className="bg-[linear-gradient(135deg,#eff6ff_0%,#f0f9ff_100%)] px-5 py-4">
                      <p className="truncate text-sm font-bold text-slate-900">{fullName}</p>
                      <p className="mt-1 text-xs font-medium text-slate-500">{isAdmin ? 'Quản trị viên' : 'Khách hàng'}</p>
                    </div>

                    <div className="p-2">
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <User size={16} />
                        Hồ sơ cá nhân
                      </Link>

                      <Link
                        to="/my-bookings"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <ReceiptText size={16} />
                        Đơn hàng của tôi
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                      >
                        <LogOut size={16} />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-600 transition hover:text-sky-600">
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-[linear-gradient(135deg,#0ea5e9_0%,#2563eb_100%)] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-sky-200/70 transition hover:translate-y-[-1px] hover:shadow-lg"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setShowMobileMenu((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden"
          aria-label="Toggle menu"
        >
          {showMobileMenu ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1.5">
            <Link
              to="/"
              className={`rounded-xl px-4 py-3 text-sm font-semibold ${isActive('/') ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              Trang chủ
            </Link>
            <Link
              to="/about"
              className={`rounded-xl px-4 py-3 text-sm font-semibold ${isActive('/about') ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              Về chúng tôi
            </Link>
            <Link
              to="/tours"
              className={`rounded-xl px-4 py-3 text-sm font-semibold ${isActive('/tours') ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              Tour
            </Link>
            <Link
              to="/vouchers"
              className={`rounded-xl px-4 py-3 text-sm font-semibold ${isActive('/vouchers') ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              Ưu đãi
            </Link>
            <Link
              to="/news"
              className={`rounded-xl px-4 py-3 text-sm font-semibold ${isActive('/news') ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              Tin tức
            </Link>

            {isLoggedIn && (
              <Link
                to="/my-bookings"
                className={`rounded-xl px-4 py-3 text-sm font-semibold ${isActive('/my-bookings') ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                Đơn hàng
              </Link>
            )}

            {isLoggedIn ? (
              <>
                <Link to="/profile" className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Hồ sơ
                </Link>

                {isAdmin && (
                  <Link to="/admin" className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Trang quản trị
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-[linear-gradient(135deg,#0ea5e9_0%,#2563eb_100%)] px-4 py-3 text-center text-sm font-bold text-white"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;