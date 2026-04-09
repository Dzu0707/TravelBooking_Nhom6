import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, User, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

// Nếu bạn để file logo trong thư mục assets, hãy import nó như sau:
// import logo from '../assets/logo.png'; 

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = location.pathname === '/';

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

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 md:px-20 flex justify-between items-center ${
        isTransparent 
          ? "bg-transparent py-7 border-transparent" 
          : "bg-white/95 backdrop-blur-md py-4 border-b border-gray-100 shadow-sm"
      }`}
    >
      {/* --- TRÁI: LOGO HÌNH ẢNH --- */}
      <Link to="/" className="flex items-center gap-3 group">
        <img 
          src="logo.svg" // Thay link hình logo của bạn vào đây
          alt="TravelGo Logo" 
          className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105"
        />
        {/* Nếu bạn muốn hiện cả chữ bên cạnh Logo thì giữ đoạn này, không thì xóa đi */}
        <span className={`text-2xl font-black tracking-tighter transition-colors duration-300 ${
          isTransparent ? "text-white" : "text-gray-800"
        }`}>
          Travel<span className={isTransparent ? "text-white" : "text-blue-600"}>Go</span>
        </span>
      </Link>

      {/* GIỮA: LINKS */}
      <div className={`hidden md:flex gap-10 font-bold text-sm uppercase tracking-widest transition-colors duration-300 ${
        isTransparent ? "text-white/80" : "text-gray-500"
      }`}>
        <Link to="/" className={`hover:text-blue-400 transition-colors ${isHomePage && !isTransparent ? "text-blue-600" : ""}`}>
          Trang chủ
        </Link>
        <Link to="/tours" className="hover:text-blue-400 transition-colors">
          Tour du lịch
        </Link>
      </div>

      {/* PHẢI: USER AREA */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-lg ${
                  isTransparent 
                  ? "bg-white/20 text-white hover:bg-white/30 backdrop-blur-md" 
                  : "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-200"
                }`}
              >
                <LayoutDashboard size={16} />
                QUẢN TRỊ
              </Link>
            )}

            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-300 ${
                  isTransparent 
                  ? "bg-white/10 border-white/20 text-white hover:bg-white/20" 
                  : "bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm">
                  {fullName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold hidden sm:inline">Hi, {fullName.split(' ').pop()}</span>
                <ChevronDown size={14} className={isTransparent ? "text-white/60" : "text-gray-400"} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 overflow-hidden text-gray-800 animate-in fade-in slide-in-from-top-3">
                  <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tài khoản</p>
                    <p className="text-sm text-blue-600 font-bold">{isAdmin ? 'Quản trị viên' : 'Khách hàng'}</p>
                  </div>
                  
                  {/* ĐIỂM THAY ĐỔI Ở ĐÂY: Thêm onClick đóng dropdown */}
                  <Link 
                    to="/profile" 
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <User size={18} /> Hồ sơ cá nhân
                  </Link>
                  
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50 mt-1">
                    <LogOut size={18} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className={`px-5 py-2 text-sm font-black transition-all ${
              isTransparent ? "text-white hover:text-white/70" : "text-gray-600 hover:text-blue-600"
            }`}>
              ĐĂNG NHẬP
            </Link>
            <Link to="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:scale-105 active:scale-95">
              ĐĂNG KÝ
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;