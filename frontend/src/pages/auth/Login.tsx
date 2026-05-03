import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import loginBanner from '../../assets/images/logo-login.jpg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5091';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    localStorage.removeItem('phone');
    localStorage.removeItem('address');

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

      const nextPath = res.data.role === 'Admin' ? '/admin' : '/';
      navigate(nextPath, { replace: true });

      setTimeout(() => {
        window.location.reload();
      }, 100);
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
    <div className="min-h-screen bg-[#f6f9ff] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl rounded-3xl border border-blue-100 bg-white shadow-xl overflow-hidden grid lg:grid-cols-2">
        {/* LEFT - FORM */}
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="mx-auto w-full max-w-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-600/20">
                <span className="text-lg font-black text-white">T</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800">Đăng nhập TravelGo</h1>
                <p className="text-xs text-slate-500 mt-0.5">Tiếp tục hành trình của bạn</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="group relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-blue-600"
                  size={17}
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-blue-400 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="group relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-blue-600"
                  size={17}
                />
                <input
                  required
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-blue-400 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end pr-1">
                <Link to="/forgot-password" className="text-[12px] font-bold text-blue-600 hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex w-full items-center justify-center rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.99] disabled:bg-slate-300"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <LogIn size={18} className="-ml-1" />
                    <span className="ml-2 text-[12px] font-black uppercase tracking-wider">Đăng nhập</span>
                  </>
                )}
              </button>

              <p className="pt-2 text-center text-sm font-medium text-slate-500">
                Chưa có tài khoản?
                <Link to="/register" className="ml-1 font-black text-blue-600 hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* RIGHT - BANNER */}
        <div className="relative hidden lg:block min-h-[520px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${loginBanner})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/55 via-blue-900/15 to-transparent" />

          <div className="absolute bottom-8 left-8 right-8">
            <h3 className="text-2xl font-black tracking-tight text-white drop-shadow">
              TravelGo Identity
            </h3>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.25em] text-white/85">
              Hệ thống quản lý hành trình
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;