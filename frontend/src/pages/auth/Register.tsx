import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import registerBanner from '../../assets/images/logo-login.jpg'; // đổi sang ảnh bạn muốn
import logoTravel from '../../../public/logo.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5091';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  // ✅ phải nằm trong component
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password.trim()) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/Auth/register`, {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password
      });

      localStorage.setItem('fullName', formData.fullName.trim());
      localStorage.setItem('email', formData.email.trim());
      localStorage.setItem('phone', formData.phone.trim());
      localStorage.setItem('address', 'Chưa cập nhật');
      localStorage.setItem('role', 'User');

      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data ||
        'Không thể kết nối máy chủ';
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
            <div className="flex items-center gap-3 mb-5">
              <div className="h-12 w-12 rounded-xl bg-white border border-blue-100 shadow-sm overflow-hidden flex items-center justify-center">
                <img src={logoTravel} alt="TravelGo logo" className="h-10 w-10 object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-800">Đăng ký TravelGo</h1>
                <p className="text-[12px] text-slate-500">Tạo tài khoản để bắt đầu hành trình</p>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Hàng 1: Tên + SĐT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="group relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600" size={17} />
                  <input
                    required
                    type="text"
                    placeholder="Họ và tên"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="group relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600" size={17} />
                  <input
                    required
                    type="tel"
                    placeholder="Số điện thoại"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Hàng 2: Email */}
              <div className="group relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600" size={17} />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Hàng 3: Mật khẩu + Xác nhận */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="group relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600" size={17} />
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                <div className="group relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600" size={17} />
                  <input
                    required
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Xác nhận"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                    aria-label={showConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
                    title={showConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
                  >
                    {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
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
                    <UserPlus size={17} />
                    <span className="text-[12px] uppercase tracking-wide">Đăng ký</span>
                  </>
                )}
              </button>

              <p className="pt-1 text-center text-sm text-slate-500">
                Đã có tài khoản?
                <Link to="/login" className="ml-1 font-black text-blue-600 hover:underline">
                  Đăng nhập ngay
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative hidden lg:block h-[400px] xl:h-[420px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${registerBanner})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/55 via-blue-900/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-xl font-black text-white drop-shadow">TravelGo Register</h3>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/85">
              Sẵn sàng cho chuyến đi tiếp theo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;