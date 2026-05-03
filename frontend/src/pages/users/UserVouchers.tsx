import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  Ticket,
  Clock,
  CheckCircle2,
  Copy,
  Tag,
  Zap,
  Info,
  LogIn
} from 'lucide-react';

const UserVouchers = () => {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5091'}/api/Vouchers`;

  const getValue = (obj: any, key: string) => {
    if (!obj) return '';
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    return obj[key] !== undefined ? obj[key] : obj[capitalizedKey] || '';
  };

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      setIsUnauthorized(false);

      const token = localStorage.getItem('token');
      if (!token) {
        setIsUnauthorized(true);
        setVouchers([]);
        return;
      }

      const response = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(response.data) ? response.data : [];

      const activeVouchers = data.filter((v: any) => {
        const expiryDate = getValue(v, 'expiryDate');
        const quantity = Number(getValue(v, 'quantity') || 0);

        const isExpired = expiryDate ? new Date(expiryDate) < new Date() : true;
        const isOutOfStock = quantity <= 0;

        return !isExpired && !isOutOfStock;
      });

      setVouchers(activeVouchers);
    } catch (error: any) {
      console.error('Lỗi lấy dữ liệu vouchers:', error);
      if (error.response?.status === 401) {
        setIsUnauthorized(true);
        setVouchers([]);
      } else {
        toast.error('Không thể tải danh sách ưu đãi');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const copyToClipboard = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast.success(`Đã sao chép mã: ${code}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center bg-[#f8fbff]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h2 className="flex items-center justify-center gap-2 text-3xl font-black uppercase tracking-tight text-slate-900">
          <Zap className="fill-yellow-400 text-yellow-400" />
          Kho Ưu Đãi Đặc Biệt
        </h2>
        <p className="mt-3 text-slate-500">
          Mã giảm giá cập nhật theo chương trình hiện hành của TravelGo.
        </p>
      </div>

      {/* Chưa đăng nhập */}
      {isUnauthorized ? (
        <div className="rounded-3xl border border-blue-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <LogIn size={24} />
          </div>
          <h3 className="text-xl font-black text-slate-900">Bạn chưa đăng nhập</h3>
          <p className="mt-2 text-slate-500 max-w-md mx-auto">
            Đăng nhập để xem mã ưu đãi dành riêng cho tài khoản của bạn.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-all"
          >
            Đăng nhập ngay
          </button>
        </div>
      ) : vouchers.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-20 text-center bg-white">
          <Ticket className="mx-auto mb-4 text-slate-300" size={48} />
          <p className="text-slate-500 font-medium">Hiện tại chưa có chương trình ưu đãi nào.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vouchers.map((voucher, index) => {
            const code = getValue(voucher, 'code');
            const type = getValue(voucher, 'discountType');
            const val = Number(getValue(voucher, 'discountValue') || 0);
            const expiry = getValue(voucher, 'expiryDate');
            const qty = Number(getValue(voucher, 'quantity') || 0);

            return (
              <div
                key={getValue(voucher, 'id') || index}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-sm border border-blue-100 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#f8fbff] border border-blue-100"></div>
                <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#f8fbff] border border-blue-100"></div>

                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Tag size={24} />
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-500">
                        {type?.toString().toLowerCase().includes('percent')
                          ? `-${val}%`
                          : `-${(val / 1000).toLocaleString()}k`}
                      </span>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Giảm trực tiếp</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                      Mã: <span className="text-blue-600">{code}</span>
                    </h3>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock size={14} className="text-slate-400" />
                        <span>Hạn: {expiry ? new Date(expiry).toLocaleDateString('vi-VN') : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span>Còn {qty} lượt sử dụng</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-2 relative z-10">
                    <button
                      onClick={() => copyToClipboard(code)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-95"
                    >
                      <Copy size={16} />
                      Sao chép mã
                    </button>
                    <button className="flex items-center justify-center rounded-xl border border-slate-200 px-3 transition-colors hover:bg-slate-50">
                      <Info size={18} className="text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-blue-100 pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Info */}
      {!isUnauthorized && (
        <div className="mt-16 rounded-2xl bg-blue-50 border border-blue-100 p-8 text-center">
          <h4 className="font-bold text-blue-900">Lưu ý sử dụng Voucher</h4>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Mỗi mã giảm giá chỉ áp dụng 1 lần cho mỗi giao dịch thành công. Không quy đổi tiền mặt.
            Vui lòng kiểm tra thời hạn sử dụng trước khi áp dụng.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserVouchers;