import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

// --- IMPORT CÁC TRANG ADMIN ---
import AdminTours from './pages/admin/AdminTours';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';

// 1. Tách phần nội dung ra để có thể sử dụng useLocation() bên trong Router
const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Chỉ hiện Navbar nếu không phải Admin */}
      {!isAdminPath && <Navbar />}
      
      <main className={isAdminPath ? "min-h-screen" : "max-w-7xl mx-auto p-6 min-h-screen"}>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<TourList />} />
          <Route path="/tours/:id" element={<TourDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/unauthorized" element={
            <div className="text-center py-20 font-bold">403 - Forbidden</div>
          } />

          {/* --- USER ROUTES --- */}
          <Route element={<ProtectedRoute allowedRoles={['User', 'Admin']} />}>
            <Route path="/checkout" element={<TourCheckout />} />
          </Route>

          {/* --- ADMIN ROUTES --- */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route element={<AdminLayout />}> 
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/tours" element={<AdminTours />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<div className="text-center py-20 font-bold">404 - Not Found</div>} />
        </Routes>
      </main>

      {!isAdminPath && <Footer />}
    </>
  );
};

// 2. Component App chính chỉ bọc Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;