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
import PaymentGateway from './pages/users/PaymentGateway'; 

// Tự động cuộn lên đầu trang khi chuyển trang
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- LAYOUT CHÍNH ---
const MainLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  // Xác định các trang cần tràn viền (Full Width)
  const isFullWidthPage = path === '/' || path.startsWith('/tours');

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f8faff]">
      {/* Đảm bảo Navbar trong file Navbar.tsx dùng sticky top-0 w-full */}
      <Navbar />
      
      <main className={`flex-grow w-full ${
        isFullWidthPage 
          ? "w-full" // Không giới hạn chiều rộng cho Home và Tour List
          : "max-w-7xl mx-auto px-4 md:px-6 py-10" // Giới hạn cho Login, Register, MyBookings...
      }`}>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

// Trang báo lỗi 404
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center bg-white px-6">
    <h1 className="text-[10rem] md:text-[15rem] font-black text-gray-100 leading-none select-none">404</h1>
    <div className="relative -mt-16 md:-mt-24">
      <p className="text-2xl md:text-4xl font-extrabold text-gray-800 uppercase tracking-tighter">Trang bạn tìm không tồn tại</p>
      <p className="text-gray-500 mt-4 font-medium">Có vẻ như hành trình này đã kết thúc hoặc đường dẫn bị sai.</p>
      <button
        onClick={() => window.location.href = '/'}
        className="mt-10 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-full font-bold uppercase transition-all shadow-lg active:scale-95"
      >
        Về trang chủ
      </button>
    </div>
  </div>
);

const AppContent = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#0f172a',
            color: '#fff',
            padding: '16px',
          },
        }}
      />
      <ScrollToTop />

      <Routes>
        {/* --- 1. USER & PUBLIC ROUTES --- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<TourList />} />
          <Route path="/tours/:id" element={<TourDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          
          <Route path="/unauthorized" element={
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-5xl font-black text-red-600 uppercase italic">403</h2>
                <p className="text-gray-500 font-bold mt-2">Bạn không có quyền truy cập trang này!</p>
            </div>
          } />

          <Route element={<ProtectedRoute allowedRoles={['User', 'Admin']} />}>
            <Route path="/checkout/:id" element={<TourCheckout />} />
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