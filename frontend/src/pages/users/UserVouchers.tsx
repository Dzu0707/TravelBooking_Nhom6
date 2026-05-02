import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Ticket, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Tag, 
  Zap, 
  Info 
} from 'lucide-react';

const UserVouchers = () => {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = 'http://localhost:5091/api/Vouchers';

  // Hàm hỗ trợ lấy giá trị không phân biệt chữ hoa/thường từ API
  const getValue = (obj: any, key: string) => {
    if (!obj) return '';
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    return obj[key] !== undefined ? obj[key] : obj[capitalizedKey] || '';
  };

  // Lấy dữ liệu từ API
  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // Lấy token để sửa lỗi 401

      const response = await axios.get(API_BASE_URL, {
        headers: { 
          Authorization: `Bearer ${token}` // Gửi token lên server
        },
      });

      const data = Array.isArray(response.data) ? response.data : [];
      
      // Lọc các voucher còn hạn và còn lượt dùng
      const activeVouchers = data.filter((v: any) => {
        const expiryDate = getValue(v, 'expiryDate');
        const quantity = getValue(v, 'quantity');
        
        const isExpired = new Date(expiryDate) < new Date();
        const isOutOfStock = Number(quantity) <= 0;
        
        return !isExpired && !isOutOfStock;
      });

      setVouchers(activeVouchers);
    } catch (error: any) {
      console.error('Lỗi lấy dữ liệu:', error);
      if (error.response?.status === 401) {
        toast.error('Vui lòng đăng nhập để xem ưu đãi');
      } else {
        toast.error('Không thể kết nối đến máy chủ API');
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
    toast.success(`Đã sao chép mã: ${code}`, {
      icon: '🎁',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h2 className="flex items-center justify-center gap-2 text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
          <Zap className="fill-yellow-400 text-yellow-400" />
          Kho Ưu Đãi Đặc Biệt
        </h2>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Săn mã giảm giá ngay để tận hưởng chuyến đi tiết kiệm hơn cùng chúng tôi.
        </p>
      </div>

      {vouchers.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-20 text-center dark:border-slate-800">
          <Ticket className="mx-auto mb-4 text-slate-300" size={48} />
          <p className="text-slate-500 font-medium">Hiện tại chưa có chương trình ưu đãi nào.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vouchers.map((voucher, index) => {
            const code = getValue(voucher, 'code');
            const type = getValue(voucher, 'discountType');
            const val = getValue(voucher, 'discountValue');
            const expiry = getValue(voucher, 'expiryDate');
            const qty = getValue(voucher, 'quantity');

            return (
              <div 
                key={getValue(voucher, 'id') || index}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 dark:border-slate-800"
              >
                {/* Trang trí Ticket Hole */}
                <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800"></div>
                <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800"></div>

                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                      <Tag size={24} />
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-500">
                        {type?.toString().toLowerCase().includes('percent') 
                          ? `-${val}%` 
                          : `-${(Number(val)/1000).toLocaleString()}k`}
                      </span>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Giảm trực tiếp</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-tight">
                      Mã: <span className="text-cyan-600 dark:text-cyan-400">{code}</span>
                    </h3>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock size={14} className="text-slate-400" />
                        <span>Hạn: {new Date(expiry).toLocaleDateString('vi-VN')}</span>
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
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-95 dark:bg-cyan-600 dark:hover:bg-cyan-700"
                    >
                      <Copy size={16} />
                      Sao chép mã
                    </button>
                    <button className="flex items-center justify-center rounded-xl border border-slate-200 px-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
                      <Info size={18} className="text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Đường gạch đứt đoạn trang trí */}
                <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-slate-200 dark:border-slate-800 pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-16 rounded-2xl bg-cyan-50/50 border border-cyan-100 p-8 text-center dark:bg-slate-900/50 dark:border-slate-800">
        <h4 className="font-bold text-cyan-900 dark:text-cyan-400">Lưu ý sử dụng Voucher</h4>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Mỗi mã giảm giá chỉ áp dụng 1 lần cho mỗi giao dịch thành công. Không có giá trị quy đổi thành tiền mặt. 
          Vui lòng kiểm tra thời hạn sử dụng trước khi áp dụng mã.
        </p>
      </div>
    </div>
  );
};

export default UserVouchers;