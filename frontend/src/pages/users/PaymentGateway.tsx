import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck, 
  Copy, 
  Clock, 
  Wallet,
  AlertCircle,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentGateway = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(600);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy ID và số tiền từ URL
  const bookingId = searchParams.get('bookingId');
  const amount = Number(searchParams.get('amount') || 0);

  // Kiểm tra nếu bookingId bị undefined hoặc null thì đá về trang chủ
  useEffect(() => {
    if (!bookingId || bookingId === "undefined") {
      toast.error("Không tìm thấy mã đơn hàng!");
      const timer = setTimeout(() => navigate('/'), 2000);
      return () => clearTimeout(timer);
    }
  }, [bookingId, navigate]);

  const ACCOUNT_NO = "0337132733";
  const ACCOUNT_NAME = "LE PHU THINH";
  const BANK_ID = "970422"; 

  // Tạo nội dung chuyển khoản chuẩn theo Backend: PAYTOUR + ID + NHOM6
  const paymentContent = useMemo(() => {
    return `PAYTOUR${bookingId}NHOM6`;
  }, [bookingId]);

  // Link QR VietQR
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${paymentContent}&accountName=${ACCOUNT_NAME.replace(/ /g, '%20')}`;

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  const handleConfirm = () => {
    setIsSubmitting(true);
    // Giả lập thời gian chờ kiểm tra hệ thống
    setTimeout(() => {
      toast.success("Thông báo chuyển khoản đã được gửi tới Admin!");
      setIsSubmitting(false);
      navigate('/my-bookings');
    }, 2000);
  };

  // Màn hình loading khi đang check ID
  if (!bookingId || bookingId === "undefined") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin mx-auto text-pink-600" size={40} />
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Đang tải dữ liệu thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* CỘT TRÁI: THÔNG TIN TÀI KHOẢN */}
        <div className="space-y-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-pink-600 transition-all"
          >
            <ArrowLeft size={16} className="mr-2" /> Quay lại
          </button>

          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-[#A50064] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-200">
                <Wallet size={28} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 uppercase italic leading-none">Ví điện tử MoMo</h2>
                <p className="text-[10px] text-pink-600 font-bold uppercase tracking-widest mt-1">Giao dịch VietQR tự động</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-pink-50 p-6 rounded-[2rem] border border-pink-100">
                <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-2 text-center">Số tiền cần thanh toán</p>
                <p className="text-4xl font-black text-[#A50064] italic tracking-tighter text-center">
                  {amount.toLocaleString()} <span className="text-lg">VND</span>
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase">Chủ tài khoản</p>
                   <p className="font-black text-slate-700 text-lg uppercase leading-tight">{ACCOUNT_NAME}</p>
                </div>

                <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Nội dung (Mã đối soát)</p>
                    <p className="font-black text-pink-700 uppercase italic text-lg tracking-wider">{paymentContent}</p>
                  </div>
                  <button onClick={() => handleCopy(paymentContent, "Nội dung")} className="p-3 bg-white shadow-sm hover:text-pink-600 rounded-xl transition-all">
                    <Copy size={20} />
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700">
                <AlertCircle size={24} className="shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold uppercase leading-relaxed tracking-wider">
                  Vui lòng không thay đổi nội dung chuyển khoản để đơn hàng được duyệt tự động.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: QR CODE */}
        <div className="lg:sticky lg:top-12 space-y-6">
          <div className="bg-[#1a1a1a] rounded-[3.5rem] p-10 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-white mb-8 border border-white/10">
                <Clock size={14} className="text-pink-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Thời gian còn lại: {formatTime(timeLeft)}</span>
              </div>

              <div className="bg-white p-6 rounded-[2.5rem] inline-block shadow-2xl mb-8 border-4 border-pink-500/30">
                <img 
                  src={qrUrl} 
                  alt="QR Thanh toán" 
                  className="w-64 h-64 object-contain"
                />
              </div>

              <h3 className="text-white font-black text-xl uppercase italic tracking-tight mb-2">Quét mã bằng MoMo</h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-10">Dùng App ngân hàng hoặc MoMo</p>

              <button 
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="w-full bg-[#A50064] hover:bg-[#d4007f] disabled:bg-slate-700 text-white py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] transition-all shadow-xl shadow-pink-900/40 flex items-center justify-center gap-3"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Tôi đã hoàn tất chuyển khoản"} <CheckCircle2 size={18} />
              </button>

              <div className="mt-8 flex items-center justify-center gap-2 text-slate-500">
                <ShieldCheck size={14} className="text-pink-500" />
                <span className="text-[9px] font-black uppercase tracking-widest">Bảo mật giao dịch bởi VietQR</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentGateway;