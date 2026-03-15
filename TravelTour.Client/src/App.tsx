import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './pages/components/Navbar';
import Footer from './pages/components/Footer';
import TourDetail from './pages/users/TourDetail';
import Home from './pages/users/Home';
import TourList from './pages/users/TourList';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/users/Login';
import CategoryAdmin from './pages/admin/CategoryAdmin';
import TourCheckout from './pages/users/TourCheckout';
import Register from './pages/users/Register';
import ProtectedRoute from './pages/components/ProtectedRoute'; // Import gác cổng

function App() {
  return (
    <Router>
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-6 min-h-screen">
        <Routes>
          {/* --- PUBLIC ROUTES (Ai cũng xem được) --- */}
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<TourList />} />
          <Route path="/tours/:id" element={<TourDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<div className="text-center py-20"> 
            <h1 className="text-4xl font-bold text-red-500">403 - Truy cập bị từ chối</h1>
            <p>Bạn không có quyền quản trị viên để vào trang này.</p>
          </div>} />

          {/* --- USER ROUTES (Phải đăng nhập mới được Checkout) --- */}
          <Route element={<ProtectedRoute allowedRoles={['User', 'Admin']} />}>
            <Route path="/checkout" element={<TourCheckout />} />
          </Route>

          {/* --- ADMIN ROUTES (BẢO MẬT TUYỆT ĐỐI) --- */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/categories" element={<CategoryAdmin />} />
            <Route path="/admin/tours" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminDashboard />} />
            <Route path="/admin/reviews" element={<AdminDashboard />} />
            <Route path="/admin/vouchers" element={<AdminDashboard />} />
            <Route path="/admin/transactions" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminDashboard />} />
            <Route path="/admin/schedules" element={<AdminDashboard />} />
            <Route path="/admin/feedbacks" element={<AdminDashboard />} />
            {/* Nếu có thêm trang quản lý tour, quản lý user thì bỏ vào đây */}
          </Route>

          {/* Route 404 nếu gõ sai URL */}
          <Route path="*" element={<div className="text-center py-20">Trang không tồn tại</div>} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;