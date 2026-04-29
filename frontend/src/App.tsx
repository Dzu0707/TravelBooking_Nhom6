import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components & Pages
import Navbar from './pages/components/Navbar';
import Footer from './pages/components/Footer';
<<<<<<< HEAD
=======
import TourDetail from './pages/users/TourDetail';
import Home from './pages/users/Home';
import TourList from './pages/users/TourList';
import MyBookings from './pages/users/MyBookings';
import Profile from './pages/users/Profile';
import NewsDetail from './pages/users/NewsDetail';
import NewsList from './pages/users/NewsList'; // Đã thêm NewsList
import AdminDashboard from './pages/admin/AdminDashboard';
>>>>>>> 9fcc8939d677855e115e5ea79c439a0f496ca9fa
import Login from './pages/components/Login';
import Register from './pages/components/Register';
import ProtectedRoute from './pages/components/ProtectedRoute';

// User Pages
import Home from './pages/users/Home';
import TourList from './pages/users/TourList';
import TourDetail from './pages/users/TourDetail';
import MyBookings from './pages/users/MyBookings';
import TourCheckout from './pages/users/TourCheckout';
import PaymentGateway from './pages/users/PaymentGateway';
import NewsList from './pages/users/NewsList';
import NewsDetail from './pages/users/NewsDetail';
import Profile from './pages/users/Profile'; // Đã thêm import Profile

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSchedules from './pages/admin/AdminSchedules';
import AdminTours from './pages/admin/AdminTours';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminVouchers from './pages/admin/AdminVouchers';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminReviews from './pages/admin/AdminReviews';
import AdminNews from './pages/admin/AdminNews';
import AdminMedia from './pages/admin/AdminMedia';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
<<<<<<< HEAD
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main
        className={`flex-grow ${
          isHomePage ? 'w-full' : 'mx-auto w-full max-w-7xl px-4 py-10 md:px-6'
        }`}
      >
=======
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className={`flex-grow ${
        isHomePage 
          ? "w-full" 
          : "max-w-7xl mx-auto w-full px-4 md:px-6 py-10" 
      }`}>
>>>>>>> 9fcc8939d677855e115e5ea79c439a0f496ca9fa
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
    <h1 className="select-none text-[10rem] font-black leading-none text-gray-100 md:text-[15rem]">404</h1>
    <div className="relative -mt-16 md:-mt-24">
      <p className="text-2xl font-extrabold uppercase tracking-tighter text-gray-800 md:text-4xl">
        Trang bạn tìm không tồn tại
      </p>
      <p className="mt-4 font-medium text-gray-500">
        Có vẻ như hành trình này đã kết thúc hoặc đường dẫn bị sai.
      </p>
      <button
        onClick={() => {
          window.location.href = '/';
        }}
        className="mt-10 rounded-full bg-blue-600 px-10 py-4 font-bold uppercase text-white shadow-lg transition-all active:scale-95 hover:bg-blue-700"
      >
        Về trang chủ
      </button>
    </div>
  </div>
);

const Unauthorized = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
    <h2 className="text-5xl font-black uppercase italic text-red-600">403</h2>
    <p className="mt-2 font-bold text-gray-500">Bạn không có quyền truy cập trang này!</p>
  </div>
);

const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      document.documentElement.classList.add('admin-theme');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('admin-theme');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [location.pathname]);

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
<<<<<<< HEAD
          <Route path="/news" element={<NewsList />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
=======
          <Route path="/news" element={<NewsList />} /> {/* Route danh sách tin */}
          <Route path="/news/:id" element={<NewsDetail />} />
>>>>>>> 9fcc8939d677855e115e5ea79c439a0f496ca9fa
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} /> {/* Đã thêm Route Profile */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute allowedRoles={['User', 'Admin']} />}>
            <Route path="/checkout/:id" element={<TourCheckout />} />
            <Route path="/payment-gateway" element={<PaymentGateway />} />
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