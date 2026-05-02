import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, KeyRound, Loader2, Lock } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5091';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const token = searchParams.get('token') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Liên kết đặt lại mật khẩu không hợp lệ');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Xác nhận mật khẩu không khớp');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/api/Auth/reset-password`, {
        token,
        newPassword,
      });

      toast.success(res.data.message || 'Đặt lại mật khẩu thành công');
      navigate('/login', { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <Link
        to="/login"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
      >
        <ArrowLeft size={16} />
        Quay lại đăng nhập
      </Link>

      <div className="mb-6">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <KeyRound size={24} />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Đặt lại mật khẩu</h1>
        <p className="mt-2 text-sm text-slate-500">
          Nhập mật khẩu mới cho tài khoản của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mật khẩu mới"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Xác nhận mật khẩu mới"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <KeyRound size={18} />}
          Cập nhật mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
