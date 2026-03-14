import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  // Lấy role từ máy (thường là "1" hoặc "admin")
  const userRole = localStorage.getItem('role'); 
  const isLoggedIn = !!token;

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Tour du lịch', path: '/tours' },
  ];

  // CHỖ QUAN TRỌNG NHẤT: Sửa điều kiện ở đây
  // Chấp nhận Role là chữ 'admin' HOẶC số '1' (vì DB của bạn lưu RoleId = 1)
  if (isLoggedIn && (userRole === 'admin' || userRole === '1')) {
    navLinks.push({ name: 'Quản trị', path: '/admin' });
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 md:px-20 py-4 sticky top-0 z-50 shadow-sm">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight text-nowrap">
            Travel<span className="text-blue-600">Go</span>
          </h1>
        </Link>

        {/* MENU CHÍNH (Hiện thêm Quản trị nếu là Admin) */}
        <div className="hidden md:flex items-center space-x-8 font-medium text-gray-500 ml-10 flex-1">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`text-sm transition-all hover:text-blue-600 ${isActive(link.path) ? 'text-blue-600 font-bold underline underline-offset-8' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* NÚT BẤM BÊN PHẢI */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400 font-medium italic">
                {userRole === '1' || userRole === 'admin' ? 'Quyền: Admin' : 'Thành viên'}
              </span>
              <button 
                onClick={handleLogout}
                className="text-sm font-semibold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600">Đăng nhập</Link>
              <Link to="/register">
                <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                  Đăng ký
                </button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" /> : <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 p-6 space-y-4 shadow-xl">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              onClick={() => setIsOpen(false)}
              className={`block text-base font-medium ${isActive(link.path) ? 'text-blue-600' : 'text-gray-600'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;