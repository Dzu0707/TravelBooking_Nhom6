import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Admin hoặc User

  // 1. Nếu chưa đăng nhập -> Đẩy về trang Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Nếu Role không hợp lệ -> Đẩy về trang Unauthorized (hoặc Home)
  if (!allowedRoles.includes(userRole || '')) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Hợp lệ -> Cho vào trang con
  return <Outlet />;
};

export default ProtectedRoute;