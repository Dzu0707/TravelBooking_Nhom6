import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5091';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Vui lòng nhập email');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/api/Auth/forgot-password`, {
        email: email.trim(),
      });

      toast.success(res.data.message || 'Đã gửi email đặt lại mật khẩu');
      setEmail('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể gửi email đặt lại mật khẩu');
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
          <Mail size={24} />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Quên mật khẩu</h1>
        <p className="mt-2 text-sm text-slate-500">
          Nhập email tài khoản. Hệ thống sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email của bạn"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Mail size={18} />}
          Gửi liên kết đặt lại
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
