import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components & Pages
import Navbar from './pages/components/Navbar';
import Footer from './pages/components/Footer';
import TourDetail from './pages/users/TourDetail';
import Home from './pages/users/Home';
import TourList from './pages/users/TourList';
import MyBookings from './pages/users/MyBookings';
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

// IMPORT TRANG THANH TOÁN MỚI VÀO ĐÂY
import PaymentGateway from './pages/users/PaymentGateway'; 

// Tự động cuộn lên đầu trang khi chuyển trang
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout dành cho User
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-grow w-full pt-32 pb-20 overflow-x-hidden">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

// Trang báo lỗi 404
const NotFound = () => (
  <div className="flex flex-col items-center justify-center py-40 text-center animate-fadeIn min-h-screen bg-white">
    <h1 className="text-[12rem] font-black text-gray-50 leading-none">404</h1>
    <div className="relative -mt-12">
      <p className="text-3xl font-bold text-gray-800 uppercase italic">Ối! Trang này không tồn tại</p>
      <button 
        onClick={() => window.location.href = '/'}
        className="mt-10 bg-indigo-600 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest shadow-xl"
      >
        Quay về trang chủ
      </button>
    </div>
  </div>
);

const AppContent = () => {
  return (
    <>
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '16px',
            background: '#1e293b',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600'
          },
        }}
      />
      <ScrollToTop />

      <Routes>
        {/* --- 1. USER ROUTES --- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<TourList />} />
          <Route path="/tours/:id" element={<TourDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/unauthorized" element={
            <div className="flex items-center justify-center min-h-[60vh] text-center p-20">
                <h2 className="text-4xl font-black text-rose-500 uppercase italic">403 Access Denied</h2>
            </div>
          } />
          
          <Route path="/my-bookings" element={<MyBookings />} />

          {/* User/Admin mới được vào checkout và thanh toán */}
          <Route element={<ProtectedRoute allowedRoles={['User', 'Admin']} />}>
            <Route path="/checkout/:id" element={<TourCheckout />} />
            
            {/* THÊM ROUTE THANH TOÁN Ở ĐÂY */}
            <Route path="/payment-gateway" element={<PaymentGateway />} />
          </Route>
        </Route>

        {/* --- 2. ADMIN ROUTES --- */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route element={<AdminLayout />}> 
            <Route index element={<AdminDashboard />} />
            <Route path="tours" element={<AdminTours />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="schedules" element={<AdminSchedules />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="vouchers" element={<AdminVouchers />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
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