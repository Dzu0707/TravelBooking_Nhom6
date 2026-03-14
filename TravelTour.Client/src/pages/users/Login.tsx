import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // SỬA PORT: Nhớ đổi 5091 thành port đang hiện trên Swagger của bạn
      const res = await axios.post('http://localhost:5091/api/Auth/login', { 
        email: email, 
        password: password 
      });
      
      const { token, user } = res.data;
      
      // Lưu Token và Role để demo mục 2
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role || 'User');
      
      alert(`Chào mừng ${user.fullName}!`);
      
      // Chuyển hướng theo role
      if (user.role === 'Admin') {
          navigate('/admin');
      } else {
          navigate('/');
      }
      window.location.reload(); 
      
    } catch (error: any) {
      console.error("Login Error:", error.response?.data);
      const msg = typeof error.response?.data === 'string' 
                  ? error.response?.data 
                  : "Email hoặc mật khẩu không chính xác!";
      alert("Lỗi xác thực: " + msg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-2xl rounded-3xl border border-gray-100">
      <h2 className="text-3xl font-black text-center text-gray-800 mb-8">Travel<span className="text-blue-600">Go</span></h2>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Email Admin</label>
          <input 
            type="email" 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="test@gmail.com"
            value={email} // Thêm value để đồng bộ state
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu</label>
          <input 
            type="password" 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="••••••••"
            value={password} // Thêm value để đồng bộ state
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95">
          Xác thực hệ thống
        </button>
      </form>
    </div>
  );
};

export default Login;