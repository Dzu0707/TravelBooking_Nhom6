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
function App() {
  return (
    <Router>
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-6 min-h-screen">
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/tours" element={<TourList />} />
          <Route path="/tours/:id" element={<TourDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/categories" element={<CategoryAdmin />} />
          <Route path="/checkout" element={<TourCheckout />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;