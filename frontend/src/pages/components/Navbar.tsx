import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // Đọc thông tin từ kho lưu trữ
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const fullName = localStorage.getItem('fullName') || "Thành viên";

  const isLoggedIn = !!token;
  // Kiểm tra nếu RoleId là 1 hoặc chữ 'Admin'
  const isAdmin = isLoggedIn && (role === '1' || role === 'Admin');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-6 md:px-20 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      {/* TRÁI: LOGO */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-200">T</div>
        <span className="text-xl font-bold tracking-tight text-gray-800">Travel<span className="text-blue-600">Go</span></span>
      </Link>

      {/* GIỮA: LINKS CƠ BẢN */}
      <div className="hidden md:flex gap-8 font-medium text-gray-500">
        <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
        <Link to="/tours" className="hover:text-blue-600 transition-colors">Tour du lịch</Link>
      </div>

      {/* PHẢI: USER AREA */}
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <>
            {/* NÚT QUẢN TRỊ NỔI BẬT (Chỉ hiện cho Admin) */}
            {isAdmin && (
              <Link 
                to="/admin" 
                className="hidden md:flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-amber-100"
              >
                <LayoutDashboard size={16} />
                Quản trị hệ thống
              </Link>
            )}

            {/* DROPDOWN USER */}
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 hover:bg-gray-100 transition-all"
              >
                <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                  {fullName.charAt(0)}
                </div>
                <span className="text-sm font-semibold text-gray-700">Hi, {fullName}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Tài khoản</p>
                    <p className="text-xs text-blue-600 font-medium">{isAdmin ? 'Quản trị viên' : 'Khách hàng'}</p>
                  </div>
                  
                  {/* Link quản trị cũng có trong mobile hoặc dropdown để chắc ăn */}
                  {isAdmin && (
                    <Link to="/admin" className="md:hidden flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-amber-600 hover:bg-amber-50">
                       <LayoutDashboard size={16} /> Quản trị
                    </Link>
                  )}

                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
                    <User size={16} /> Hồ sơ cá nhân
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 border-t border-gray-50 mt-1">
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition-all">Đăng nhập</Link>
            <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100">Đăng ký</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;