import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// --- COMPONENTS ---
import Navbar from './pages/components/Navbar';
import Footer from './pages/components/Footer';
import Login from './pages/components/Login';
import Register from './pages/components/Register';
import ProtectedRoute from './pages/components/ProtectedRoute';

// --- USER PAGES ---
import Home from './pages/users/Home';
import TourList from './pages/users/TourList';
import TourDetail from './pages/users/TourDetail';
import TourCheckout from './pages/users/TourCheckout';
// @ts-ignore
import Profile from './pages/users/Profile';

// --- ADMIN PAGES ---
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTours from './pages/admin/AdminTours';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCategories from './pages/admin/AdminCategories';
import AdminReviews from './pages/admin/AdminReviews';
import AdminSchedules from './pages/admin/AdminSchedules';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVouchers from './pages/admin/AdminVouchers';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};
// Layout dành riêng cho User/Khách
const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* CHỈNH SỬA: 
            Trang chủ để w-full đơn thuần.
            Các trang khác dùng pt-24 hoặc pt-32 để tạo khoảng cách an toàn dưới Nav.
        */}
      <main className={`flex-grow ${isHomePage
        ? "w-full overflow-x-hidden"
        : "max-w-7xl mx-auto px-6 pt-24 pb-20 w-full"
        }`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const NotFound = () => (
  <div className="flex flex-col items-center justify-center py-40 text-center animate-fadeIn min-h-screen">
    <h1 className="text-[12rem] font-black text-gray-100 leading-none">404</h1>
    <div className="relative -mt-12">
      <p className="text-3xl font-bold text-gray-800 uppercase italic">Ối! Trang này không tồn tại</p>
      <p className="text-gray-500 mt-3 max-w-md">Hãy để TravelGo dẫn bạn về nhà nhé!</p>
      <button
        onClick={() => window.location.href = '/'}
        className="mt-10 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest transition-all hover:scale-105"
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
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <ScrollToTop />

      <Routes>
        {/* --- PUBLIC ROUTE --- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<TourList />} />
          <Route path="/tours/:id" element={<TourDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={
            <div className="text-center py-40 font-bold text-red-500 text-2xl uppercase">403 - Quyền truy cập bị từ chối</div>
          } />

          <Route element={<ProtectedRoute allowedRoles={['User', 'Admin']} />}>
            <Route path="/checkout/:id" element={<TourCheckout />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* --- ADMIN ROUTE --- */}
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