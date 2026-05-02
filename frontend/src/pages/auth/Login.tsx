import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import loginBanner from '../../assets/images/logo-login.jpg';

const API_BASE_URL = 'http://localhost:5091';

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
    <div className="flex min-h-screen justify-center bg-slate-100 font-sans text-slate-900">
      <div className="m-0 flex max-w-7xl flex-1 justify-center overflow-hidden bg-white shadow-2xl sm:m-10 sm:rounded-3xl">
        <div className="p-6 sm:p-12 lg:w-1/2 xl:w-5/12">
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 rotate-3 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30">
              <span className="text-2xl font-black text-white">T</span>
            </div>

            <div className="mt-8 flex w-full flex-col items-center">
              <h1 className="text-2xl font-black tracking-tight text-slate-800 xl:text-3xl">
                Đăng nhập TravelGO
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Tiếp tục hành trình TravelTour
              </p>

              <div className="mt-10 w-full flex-1">
                <form onSubmit={handleLogin} className="mx-auto max-w-xs space-y-5">
                  <div className="group relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-blue-600"
                      size={18}
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-12 py-4 text-sm font-medium text-slate-800 placeholder-slate-400 shadow-inner transition-all focus:border-blue-400 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="group relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-blue-600"
                      size={18}
                    />
                    <input
                      required
                      type="password"
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-12 py-4 text-sm font-medium text-slate-800 placeholder-slate-400 shadow-inner transition-all focus:border-blue-400 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end pr-2">
                    <Link
                      to="/forgot-password"
                      className="text-[12px] font-bold text-blue-600 hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 flex w-full items-center justify-center rounded-xl bg-blue-600 py-4 font-bold tracking-wide text-white shadow-xl shadow-blue-600/20 transition-all duration-300 hover:bg-blue-700 active:scale-95 disabled:bg-slate-300"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <LogIn size={20} className="-ml-2" />
                        <span className="ml-3 text-[13px] font-black uppercase tracking-wider">
                          Đăng nhập
                        </span>
                      </>
                    )}
                  </button>

                  <p className="mt-8 text-center text-sm font-medium text-slate-500">
                    Chưa có tài khoản?
                    <Link to="/register" className="ml-1 font-black text-blue-600 hover:underline">
                      Đăng ký ngay
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden flex-1 items-center justify-center bg-blue-50 text-center lg:flex">
          <div className="absolute right-0 top-0 z-10 h-32 w-32 rounded-bl-full bg-blue-600/10" />

          <div
            className="absolute inset-0 h-full w-full bg-cover bg-center transition-transform duration-[3000ms] hover:scale-110"
            style={{ backgroundImage: `url(${loginBanner})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 mb-12 mt-auto px-10">
            <h3 className="text-2xl font-black tracking-tight text-white drop-shadow-lg">
              TravelTour Identity
            </h3>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.3em] text-white/80 drop-shadow-md">
              Hệ thống quản lý hành trình
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
