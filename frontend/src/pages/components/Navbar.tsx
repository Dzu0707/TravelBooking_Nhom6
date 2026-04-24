import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, User, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside dropdown
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
  const fullName = localStorage.getItem('fullName') || 'Thành viên';

  const isLoggedIn = !!token;
  const isAdmin = isLoggedIn && (role === '1' || role === 'Admin');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm px-6 md:px-20 h-16 flex items-center justify-between">
      
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src="logo-travel-tour.svg"
          alt="TravelGo Logo"
          className="h-10 object-contain"
        />
        <span className="text-lg font-semibold text-gray-800">
          TravelGo
        </span>
      </Link>

      {/* NAV LINKS */}
      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
        <Link
          to="/"
          className={`relative ${
            isActive('/') ? 'text-blue-600' : 'hover:text-blue-500'
          }`}
        >
          Trang chủ
          {isActive('/') && (
            <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-600 rounded-full"></span>
          )}
        </Link>

        <Link
          to="/tours"
          className={`relative ${
            isActive('/tours') ? 'text-blue-600' : 'hover:text-blue-500'
          }`}
        >
          Tour
          {isActive('/tours') && (
            <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-600 rounded-full"></span>
          )}
        </Link>
      </div>

      {/* USER AREA */}
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <div className="flex items-center gap-3">

            {isAdmin && (
              <Link
                to="/admin"
                className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
              >
                <LayoutDashboard size={14} />
                Admin
              </Link>
            )}

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center text-sm font-bold">
                  {fullName.charAt(0).toUpperCase()}
                </div>

                <span className="text-sm hidden sm:block text-gray-700">
                  {fullName.split(' ').pop()}
                </span>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    showDropdown ? 'rotate-180' : ''
                  } text-gray-400`}
                />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                  
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">
                      {fullName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {isAdmin ? 'Quản trị viên' : 'Khách hàng'}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <User size={16} />
                    Hồ sơ
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            
            {/* LOGIN */}
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
            >
              Đăng nhập
            </Link>

            {/* REGISTER (CTA nổi bật) */}
            <Link
              to="/register"
              className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
            >
              Đăng ký
            </Link>

          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;