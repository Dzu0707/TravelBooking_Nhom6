import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './pages/components/Navbar';
import Footer from './pages/components/Footer';
import TourDetail from './pages/users/TourDetail';
import Home from './pages/users/Home';
import TourList from './pages/users/TourList';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/components/Login';
import TourCheckout from './pages/users/TourCheckout';
import Register from './pages/components/Register';
import ProtectedRoute from './pages/components/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminSchedules from './pages/admin/AdminSchedules';
import AdminTours from './pages/admin/AdminTours';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories'; 
import AdminVouchers from './pages/admin/AdminVouchers';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminReviews from './pages/admin/AdminReviews';

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      {!isAdminPath && <Navbar />}
      
      <main className={isAdminPath ? "min-h-screen" : "max-w-7xl mx-auto p-6 min-h-screen"}>
        <Routes>
          {/* --- 1. PUBLIC ROUTES (Ai cũng xem được) --- */}
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<TourList />} />
          
          {/* ĐẢM BẢO ĐƯỜNG DẪN NÀY KHỚP VỚI Link trong TourCard */}
          <Route path="/tours/:id" element={<TourDetail />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/unauthorized" element={
            <div className="text-center py-20 font-bold text-red-500">403 - Bạn không có quyền truy cập</div>
          } />

          {/* --- 2. USER ROUTES (Phải đăng nhập) --- */}
          <Route element={<ProtectedRoute allowedRoles={['User', 'Admin']} />}>
            {/* Chỉ khi bấm "Đặt Tour" trong trang chi tiết mới sang đây */}
            <Route path="/checkout/:id" element={<TourCheckout />} />
          </Route>

          {/* --- 3. ADMIN ROUTES (Chỉ Admin) --- */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route element={<AdminLayout />}> 
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/tours" element={<AdminTours />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/schedules" element={<AdminSchedules />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/transactions" element={<AdminTransactions />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/vouchers" element={<AdminVouchers />} />
            </Route>
          </Route>

          {/* 404 - Trang không tồn tại */}
          <Route path="*" element={<div className="text-center py-20 font-bold text-gray-400">404 - Trang này không tồn tại</div>} />
        </Routes>
      </main>

      {!isAdminPath && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;