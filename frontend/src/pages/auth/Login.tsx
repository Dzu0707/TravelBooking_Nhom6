import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import loginBanner from '../../assets/images/logo-login.jpg';
import logoTravel from '../../../public/logo.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5091';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // ✅ thêm state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const persistAuth = (data: any, fallbackEmail: string) => {
    const { token, id, role, fullName, email: userEmail, phone, address } = data;

    const userData = {
      id,
      role: role || 'User',
      fullName: fullName || 'Thành viên',
      email: userEmail || fallbackEmail,
    };

    ['token', 'user', 'role', 'fullName', 'email', 'phone', 'address'].forEach((k) =>
      localStorage.removeItem(k)
    );

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userData.role);
    localStorage.setItem('fullName', userData.fullName);
    localStorage.setItem('email', userData.email);
    localStorage.setItem('phone', phone || 'Chưa cập nhật');
    localStorage.setItem('address', address || 'Chưa cập nhật');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/Auth/login`, {
        email: email.trim(),
        password,
      });

      persistAuth(res.data, email);
      toast.success(`Chào mừng ${res.data.fullName || 'bạn'}!`);

      navigate(res.data.role === 'Admin' ? '/admin' : '/', { replace: true });
      setTimeout(() => window.location.reload(), 80);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data ||
        'Sai tài khoản hoặc mật khẩu';
      toast.error(`Lỗi: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f6f9ff] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-4xl rounded-3xl border border-blue-100 bg-white shadow-lg overflow-hidden grid lg:grid-cols-2">
        {/* LEFT */}
        <div className="px-6 py-6 sm:px-8 sm:py-7">
          <div className="mx-auto w-full max-w-sm">
            {/* logo */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-12 w-12 rounded-xl bg-white border border-blue-100 shadow-sm overflow-hidden flex items-center justify-center">
                <img src={logoTravel} alt="TravelGo logo" className="h-10 w-10 object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-800">Đăng nhập TravelGo</h1>
                <p className="text-[12px] text-slate-500">Tiếp tục hành trình của bạn</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-3.5">
              <div className="group relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600" size={17} />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Password + toggle */}
              <div className="group relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600" size={17} />
                <input
                  required
                  type={showPassword ? 'text' : 'password'} // ✅ đổi type
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-[12px] font-bold text-blue-600 hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:bg-slate-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <LogIn size={17} />
                    <span className="text-[12px] uppercase tracking-wide">Đăng nhập</span>
                  </>
                )}
              </button>

              <p className="pt-1 text-center text-sm text-slate-500">
                Chưa có tài khoản?
                <Link to="/register" className="ml-1 font-black text-blue-600 hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative hidden lg:block h-[400px] xl:h-[420px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${loginBanner})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/55 via-blue-900/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-xl font-black text-white drop-shadow">TravelGo Identity</h3>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/85">
              Hệ thống quản lý hành trình
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;