import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, User, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Để xử lý click bên ngoài

  const isHomePage = location.pathname === '/';

  // Xử lý cuộn chuột
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
    } else {
      setIsScrolled(true);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage, location.pathname]);

  // Xử lý đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const fullName = localStorage.getItem('fullName') || "Thành viên";
  const isLoggedIn = !!token;
  const isAdmin = isLoggedIn && (role === '1' || role === 'Admin');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const isTransparent = isHomePage && !isScrolled;

  // Hàm kiểm tra link đang active
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-20 flex justify-between items-center ${
        isTransparent 
          ? "bg-transparent py-6 border-transparent" 
          : "bg-white/95 backdrop-blur-md py-3 border-b border-gray-100 shadow-md"
      }`}
    >
      {/* --- TRÁI: LOGO --- */}
      <Link to="/" className="flex items-center gap-2 group">
        <img 
          src="logo-travel-tour.svg" 
          alt="TravelGo Logo" 
          className="h-12 md:h-20 w-auto object-contain transition-transform group-hover:scale-105"
        />
        <span className={`text-2xl font-black tracking-tighter transition-colors duration-300 ${
          isTransparent ? "text-white" : "text-gray-800"
        }`}>
       
        </span>
      </Link>

      {/* GIỮA: NAV LINKS */}
      <div className={`hidden md:flex gap-8 font-bold text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
        isTransparent ? "text-white/90" : "text-gray-500"
      }`}>
        <Link 
          to="/" 
          className={`hover:text-blue-400 transition-all relative group ${isActive('/') ? (isTransparent ? "text-white" : "text-blue-600") : ""}`}
        >
          Trang chủ
          <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-current transition-transform duration-300 ${isActive('/') ? "scale-100" : "scale-0 group-hover:scale-100"}`}></span>
        </Link>
        <Link 
          to="/tours" 
          className={`hover:text-blue-400 transition-all relative group ${isActive('/tours') ? "text-blue-600" : ""}`}
        >
          Tour du lịch
          <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-current transition-transform duration-300 ${isActive('/tours') ? "scale-100" : "scale-0 group-hover:scale-100"}`}></span>
        </Link>
      </div>

      {/* PHẢI: USER AREA */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${
                  isTransparent 
                  ? "bg-white/20 text-white hover:bg-white/30 backdrop-blur-md" 
                  : "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-200"
                }`}
              >
                <LayoutDashboard size={14} />
                QUẢN TRỊ
              </Link>
            )}

            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className={`flex items-center gap-3 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                  isTransparent 
                  ? "bg-white/10 border-white/20 text-white hover:bg-white/20" 
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-200"
                }`}
              >
                <div className="w-8 h-8 bg-linear-to-tr from-blue-600 to-cyan-400 text-white rounded-full flex items-center justify-center font-black text-xs shadow-inner">
                  {fullName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold hidden sm:inline">
                  {fullName.split(' ').pop()}
                </span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${showDropdown ? "rotate-180" : ""} ${isTransparent ? "text-white/60" : "text-gray-400"}`} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-3 w-60 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 overflow-hidden text-gray-800 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Tài khoản</p>
                    <p className="text-sm text-blue-600 font-bold flex items-center gap-1">
                      {isAdmin ? 'Quản trị viên' : 'Khách hàng'}
                    </p>
                  </div>
                  
                  <Link 
                    to="/profile" 
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <User size={18} className="text-blue-400" /> Hồ sơ cá nhân
                  </Link>

                  <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50 mt-1"
                  >
                    <LogOut size={18} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className={`px-4 py-2 text-xs font-black tracking-widest transition-all ${
              isTransparent ? "text-white hover:text-blue-300" : "text-gray-600 hover:text-blue-600"
            }`}>
              ĐĂNG NHẬP
            </Link>
            <Link to="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-xs font-black tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0">
              ĐĂNG KÝ
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;