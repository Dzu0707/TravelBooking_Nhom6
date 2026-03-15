import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Trong file Login.tsx, sửa đoạn logic chuyển hướng như sau:

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const res = await axios.post('http://localhost:5091/api/Auth/login', { email, password });
        
        const { token, role, fullName } = res.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('role', role?.toString() || '2');
        localStorage.setItem('fullName', fullName || 'Thành viên');
        
        alert(`Chào mừng ${fullName} quay trở lại!`);

        // TẤT CẢ đều về trang chủ, không phân biệt role ở đây nữa
        navigate('/'); 
        
        // Reload cực kỳ quan trọng để Navbar đọc lại localStorage
        window.location.reload(); 
        
      } catch (error: any) {
        alert("Lỗi: " + (error.response?.data || "Sai tài khoản/mật khẩu"));
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-[0_20px_50px_rgba(8,112,184,0.1)] rounded-[2.5rem] border border-gray-50">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
           <span className="text-white font-black text-3xl">T</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Mừng bạn quay lại!</h2>
        <p className="text-gray-400 text-sm mt-2">Đăng nhập để quản lý những chuyến hành trình</p>
      </div>
      
      <form onSubmit={handleLogin} className="space-y-5">
        {/* Nhập Email */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase ml-1 mb-2">Địa chỉ Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50"
            placeholder="admin@travelgo.vn"
            required 
          />
        </div>

        {/* Nhập Mật khẩu */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase ml-1 mb-2">Mật khẩu</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50"
            placeholder="••••••••"
            required 
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95 mt-4`}
        >
          {loading ? "ĐANG KIỂM TRA..." : "XÁC THỰC HỆ THỐNG"}
        </button>
      </form>
      
      <p className="text-center text-sm text-gray-500 mt-8">
        Chưa có tài khoản?{' '}
        <button onClick={() => navigate('/register')} className="text-blue-600 font-bold hover:underline">Đăng ký ngay</button>
      </p>
    </div>
  );
};

export default Login;