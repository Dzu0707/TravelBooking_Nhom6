import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Outlet,
  Navigate,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
// components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/layout/ProtectedRoute';
// user
import Home from './pages/users/Home';
import TourList from './pages/users/TourList';
import TourDetail from './pages/users/TourDetail';
import MyBookings from './pages/users/MyBookings';
import TourCheckout from './pages/users/TourCheckout';
import PaymentGateway from './pages/users/PaymentGateway';
import NewsList from './pages/users/NewsList';
import NewsDetail from './pages/users/NewsDetail';
import Profile from './pages/users/Profile';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import About from './pages/users/About';
import UserVouchers from './pages/users/UserVouchers';
// admin
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminSchedules from './pages/admin/Schedules';
import AdminTours from './pages/admin/Tours';
import AdminBookings from './pages/admin/Bookings';
import AdminUsers from './pages/admin/Users';
import AdminCategories from './pages/admin/Categories';
import AdminVouchers from './pages/admin/Vouchers';
import AdminTransactions from './pages/admin/Transactions';
import AdminReviews from './pages/admin/Reviews';
import AdminNews from './pages/admin/News';
import AdminMedia from './pages/admin/Media';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const MainLayout = () => {
  const { pathname } = useLocation();

  const isFullWidthPage =
    pathname === '/' ||
    pathname === '/tours' ||
    pathname.startsWith('/tours/');

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8faff]">
      <Navbar />
      <main
        className={`flex-grow ${
          isFullWidthPage ? 'w-full' : 'mx-auto w-full max-w-7xl px-4 py-10 md:px-6'
        }`}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
    <h1 className="select-none text-[10rem] font-black leading-none text-gray-100 md:text-[15rem]">
      404
    </h1>
    <div className="relative -mt-16 md:-mt-24">
      <p className="text-2xl font-extrabold uppercase tracking-tighter text-gray-800 md:text-4xl">
        Trang bạn tìm không tồn tại
      </p>
      <p className="mt-4 font-medium text-gray-500">
        Có vẻ như hành trình này đã kết thúc hoặc đường dẫn bị sai.
      </p>
      <button
        onClick={() => window.location.assign('/')}
        className="mt-10 rounded-full bg-indigo-600 px-10 py-4 font-bold uppercase text-white shadow-lg transition-all hover:bg-indigo-700 active:scale-95"
      >
        Về trang chủ
      </button>
    </div>
  </div>
);

const Unauthorized = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
    <h2 className="text-5xl font-black uppercase italic text-red-600">403</h2>
    <p className="mt-2 font-bold text-gray-500">Bạn không có quyền truy cập trang này!</p>
  </div>
);

const AppContent = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const isAdminPage = pathname.startsWith('/admin');

    document.documentElement.classList.toggle('admin-theme', isAdminPage);
    document.documentElement.style.colorScheme = isAdminPage ? 'dark' : 'light';

    return () => {
      document.documentElement.classList.remove('admin-theme');
      document.documentElement.style.colorScheme = 'light';
    };
  }, [pathname]);

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
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<TourList />} />
          <Route path="/tours/:id" element={<TourDetail />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/about" element={<About />} />
          <Route path="/vouchers" element={<UserVouchers />} />
          <Route element={<ProtectedRoute allowedRoles={['User', 'Admin']} />}>
            <Route path="/checkout/:id" element={<TourCheckout />} />
            <Route path="/payment-gateway" element={<PaymentGateway />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="tours" element={<AdminTours />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="schedules" element={<AdminSchedules />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="vouchers" element={<AdminVouchers />} />
            <Route path="news" element={<AdminNews />} />
          </Route>
        </Route>

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
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
