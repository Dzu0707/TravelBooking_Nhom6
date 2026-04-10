import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn, Mail, Lock, Loader2} from 'lucide-react';
import loginBanner from '../../assets/images/logo-login.jpg'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5091/api/Auth/login', { email, password });
      
      // Giả sử API trả về object chứa đầy đủ thông tin user
      // Ví dụ: { token, role, fullName, email, phone, address }
      const { token, role, fullName, email: userEmail, phone, address } = res.data;
      
      // 1. Dọn dẹp kho cũ trước khi ghi mới (đảm bảo không còn rác của tài khoản trước)
      localStorage.clear();

      // 2. Ghi đè thông tin MỚI của người vừa đăng nhập
      localStorage.setItem('token', token);
      localStorage.setItem('role', role?.toString() || '2');
      localStorage.setItem('fullName', fullName || 'Thành viên');
      
      // Lưu thêm các trường này để trang Profile cập nhật ngay lập tức
      localStorage.setItem('email', userEmail || email); // Ưu tiên email từ server
      localStorage.setItem('phone', phone || 'Chưa cập nhật');
      localStorage.setItem('address', address || 'Chưa cập nhật');
      
      alert(`Chào mừng ${fullName}!`);
      
      // 3. Chuyển hướng và làm mới trang để đồng bộ toàn bộ Navbar/Profile
      navigate('/'); 
      window.location.reload(); 
      
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.response?.data || "Sai tài khoản hoặc mật khẩu";
      alert("Lỗi: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex justify-center font-sans">
      <div className="max-w-7xl m-0 sm:m-10 bg-white shadow-2xl sm:rounded-3xl flex justify-center flex-1 overflow-hidden">
        
        {/* --- PHẦN BÊN TRÁI --- */}
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 rotate-3">
               <span className="text-white font-black text-2xl">T</span>
            </div>

            <div className="mt-8 w-full flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl font-black tracking-tight text-slate-800">
                Đăng nhập TravelGO
              </h1>
              <p className="text-slate-500 text-sm mt-2 font-medium">Tiếp tục hành trình TravelTour</p>
              
              <div className="w-full flex-1 mt-10">
                <form onSubmit={handleLogin} className="mx-auto max-w-xs space-y-5">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                      required
                      className="w-full px-12 py-4 rounded-xl font-medium bg-slate-50 border border-slate-200 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all shadow-inner"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                      required
                      className="w-full px-12 py-4 rounded-xl font-medium bg-slate-50 border border-slate-200 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all shadow-inner"
                      type="password"
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end pr-2">
                    <a href="#" className="text-[12px] font-bold text-blue-600 hover:underline">Quên mật khẩu?</a>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 tracking-wide font-bold bg-blue-600 text-white w-full py-4 rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all duration-300 flex items-center justify-center active:scale-95 disabled:bg-slate-300"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                      <>
                        <LogIn size={20} className="-ml-2" />
                        <span className="ml-3 font-black text-[13px] uppercase tracking-wider">Đăng nhập</span>
                      </>
                    )}
                  </button>

                  <p className="mt-8 text-sm text-slate-500 text-center font-medium">
                    Chưa có tài khoản? 
                    <Link to="/register" className="text-blue-600 font-black hover:underline ml-1">Đăng ký ngay</Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* --- PHẦN BÊN PHẢI --- */}
        <div className="flex-1 bg-blue-50 text-center hidden lg:flex items-center justify-center relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-bl-full z-10"></div>
            
            <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform hover:scale-110 duration-[3000ms]"
                style={{ backgroundImage: `url(${loginBanner})` }} 
            >
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 mt-auto mb-12 px-10">
                <h3 className="text-white font-black text-2xl tracking-tight drop-shadow-lg">
                    TravelTour Identity
                </h3>
                <p className="text-white/80 text-xs font-bold mt-2 uppercase tracking-[0.3em] drop-shadow-md">
                    Hệ thống quản lý hành trình
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;