import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("Mật khẩu xác nhận không khớp!");
    }

    setLoading(true);
    try {
      // Gọi API Đăng ký (Thay đổi URL cho đúng với Backend của bạn)
      await axios.post("http://localhost:5091/api/Auth/register", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      alert("🎉 Đăng ký thành công! Đang chuyển đến trang Đăng nhập.");
      navigate('/login');
    } catch (err: any) {
      alert("❌ Lỗi đăng ký: " + (err.response?.data || "Email đã tồn tại hoặc dữ liệu không hợp lệ"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50 px-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl shadow-blue-100/50 border border-gray-100">
        
        {/* Header của Form */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Tạo tài khoản mới</h2>
          <p className="text-gray-400 text-sm mt-2">Đăng ký để bắt đầu những chuyến hành trình tuyệt vời</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Họ tên */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">Họ và tên</label>
            <input 
              type="text" 
              required
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="Nguyễn Văn A"
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="example@gmail.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">Mật khẩu</label>
            <input 
              type="password" 
              required
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">Xác nhận mật khẩu</label>
            <input 
              type="password" 
              required
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          {/* Nút Đăng ký */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all mt-4 disabled:bg-gray-300"
          >
            {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ NGAY"}
          </button>
        </form>

        {/* Chuyển sang Đăng nhập */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;