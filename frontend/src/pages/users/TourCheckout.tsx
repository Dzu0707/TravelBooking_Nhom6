import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, ShieldCheck, Calendar, 
  ChevronRight, Ticket, MapPin, Tag, CreditCard, Wallet, XCircle, Clock, Zap,
  Headphones, MessageSquare
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TourCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scheduleId = searchParams.get('scheduleId');

  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [adultCount, setAdultCount] = useState(Number(searchParams.get('adult')) || 1);
  const [childCount, setChildCount] = useState(Number(searchParams.get('child')) || 0);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState(''); 

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [systemVouchers, setSystemVouchers] = useState<any[]>([]);

  const API_BASE_URL = "http://localhost:5091";

  const getImgUrl = (path: string) => {
    if (!path) return "https://placehold.co/400x300?text=No+Image";
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const formatDate = (dateStr: any) => {
    if (!dateStr) return "Chưa cập nhật";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "Chưa cập nhật" : date.toLocaleDateString('vi-VN');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const tourRes = await axios.get(`${API_BASE_URL}/api/Tours/${id}`);
        setTour(tourRes.data);
        try {
          const vRes = await axios.get(`${API_BASE_URL}/api/Vouchers`, config);
          setSystemVouchers(Array.isArray(vRes.data) ? vRes.data : []);
        } catch (vErr) { console.warn("Voucher fetch restricted"); }
        setLoading(false);
      } catch (error) { setLoading(false); }
    };
    fetchData();
  }, [id]);

  const selectedSchedule = useMemo(() => {
    if (!tour?.tourSchedules) return null;
    return tour.tourSchedules.find((s: any) => s.id === Number(scheduleId)) || tour.tourSchedules[0];
  }, [tour, scheduleId]);

  const subTotal = useMemo(() => {
    const aPrice = Number(selectedSchedule?.adultPrice || 0);
    const cPrice = Number(selectedSchedule?.childPrice || 0);
    return (adultCount * aPrice) + (childCount * cPrice);
  }, [adultCount, childCount, selectedSchedule]);

  const discountAmount = useMemo(() => {
    if (!appliedVoucher) return 0;
    const val = Number(appliedVoucher.discountValue ?? appliedVoucher.DiscountValue ?? 0);
    const type = String(appliedVoucher.discountType ?? appliedVoucher.DiscountType ?? "").toLowerCase();
    return type.includes('percent') ? (subTotal * val) / 100 : val;
  }, [appliedVoucher, subTotal]);

  const totalAmount = useMemo(() => Math.max(0, subTotal - discountAmount), [subTotal, discountAmount]);

  // --- LOGIC XỬ LÝ VOUCHER ĐÃ CẬP NHẬT ---
  const handleApplyVoucher = async () => {
    const code = voucherInput.trim().toUpperCase();
    if (!code) return toast.error("Vui lòng nhập mã!");

    const v = systemVouchers.find(item => (item.code || item.Code || "").toUpperCase() === code);
    
    if (v) {
      // 1. Kiểm tra ngày hết hạn
      const expiry = new Date(v.expiryDate || v.ExpiryDate);
      if (expiry < new Date()) {
        return toast.error("Mã giảm giá này đã hết hạn sử dụng!");
      }

      // 2. Kiểm tra số lượng lượt dùng (Quantity)
      // Lưu ý: Đảm bảo trường này từ API trả về số lượng CÒN LẠI
      const qty = Number(v.quantity || v.Quantity || 0);
      if (qty <= 0) {
        return toast.error("Mã giảm giá này đã hết lượt sử dụng!");
      }

      // 3. Kiểm tra đơn hàng tối thiểu
      const minOrder = Number(v.minOrderAmount || v.MinOrderAmount || 0);
      if (subTotal < minOrder) {
        return toast.error(`Đơn hàng tối thiểu ${minOrder.toLocaleString()}đ để dùng mã này!`);
      }

      setAppliedVoucher(v);
      toast.success("Áp dụng mã thành công!");
    } else {
      // Nếu không tìm thấy trong list có sẵn, gọi API validate trực tiếp để server kiểm tra database mới nhất
      const loadId = toast.loading("Đang kiểm tra mã...");
      try {
        const token = localStorage.getItem('token');
        // Gửi kèm subTotal để server check MinOrder và số lượng thực tế trong DB
        const res = await axios.post(`${API_BASE_URL}/api/Vouchers/validate`, 
          { code, orderAmount: subTotal }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setAppliedVoucher(res.data);
        toast.success("Áp dụng mã thành công!", { id: loadId });
      } catch (err: any) {
        // Server nên trả về lỗi 400 kèm message "Hết lượt dùng" hoặc "Hết hạn"
        toast.error(err.response?.data?.message || "Mã không hợp lệ hoặc đã hết lượt dùng", { id: loadId });
      }
    }
  };

  const handleSubmit = async () => {
    if (!fullName.trim() || !phone.trim() || !email.trim()) return toast.error("Vui lòng điền đầy đủ thông tin!");
    const token = localStorage.getItem('token');
    const loadId = toast.loading("Đang xử lý...");
    try {
      const data = {
        tourScheduleId: Number(selectedSchedule?.id),
        totalPassengers: adultCount + childCount,
        totalPrice: totalAmount,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        note: note.trim(), 
        adultCount,
        childCount,
        paymentMethod: paymentMethod,
        voucherCode: appliedVoucher?.code || appliedVoucher?.Code || null
      };
      
      const response = await axios.post(`${API_BASE_URL}/api/Bookings`, data, { headers: { Authorization: `Bearer ${token}` } });
      
      const orderCode = response.data.orderCode;
      const history = JSON.parse(localStorage.getItem('checkout_history') || '{}');
      history[orderCode] = { fullName: fullName.trim(), phone: phone.trim(), email: email.trim() };
      localStorage.setItem('checkout_history', JSON.stringify(history));

      const bookingId = response.data.id || response.data.bookingId;
      toast.success("Đặt tour thành công!", { id: loadId });
      
      if (paymentMethod === 'online') {
        setTimeout(() => navigate(`/payment-gateway?bookingId=${bookingId}&amount=${totalAmount}`), 1000);
      } else {
        setTimeout(() => navigate('/my-bookings'), 1500);
      }
    } catch (error: any) { 
      toast.error(error.response?.data?.message || error.response?.data || "Lỗi hệ thống!", { id: loadId }); 
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-indigo-600 italic tracking-[0.5em]">LOADING...</div>;

  return (
    <div className="bg-[#f8faff] min-h-screen pb-20 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto px-4 pt-6"> 
        <button onClick={() => navigate(-1)} className="group flex items-center text-slate-400 mb-6 transition-all hover:text-indigo-600">
          <ArrowLeft size={14} strokeWidth={2} className="mr-2 group-hover:-translate-x-1 transition-transform"/> 
          <span className="text-[11px] font-medium uppercase tracking-[0.2em]">Quay lại</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-white w-full flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-800 mb-8 uppercase italic flex items-center gap-4">
                  <div className="w-2 h-8 bg-indigo-600 rounded-full"></div> THÔNG TIN ĐẶT CHỖ
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 ml-4 uppercase tracking-widest italic">Họ và tên *</label>
                      <input value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.5rem] p-4 text-sm font-bold outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 ml-4 uppercase tracking-widest italic">Số điện thoại *</label>
                      <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.5rem] p-4 text-sm font-bold outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2 pb-2">
                    <label className="text-[10px] font-black text-slate-400 ml-4 uppercase tracking-widest italic">Email xác nhận *</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.5rem] p-4 text-sm font-bold outline-none transition-all" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 ml-4 uppercase tracking-widest italic flex items-center gap-2">
                      <MessageSquare size={14} className="text-indigo-600"/> Yêu cầu đặc biệt
                    </label>
                    <textarea 
                      value={note} 
                      onChange={e => setNote(e.target.value)}
                      placeholder="Ví dụ: Có trẻ em đi cùng, dị ứng hải sản, cần hỗ trợ xe lăn hoặc vị trí chỗ ngồi..."
                      rows={3}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.5rem] p-5 text-sm font-bold outline-none transition-all resize-none shadow-inner"
                    />
                  </div>

                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ServiceCommit icon={<Clock size={18}/>} title="Xác nhận tức thì" desc="Sau khi thanh toán" />
                    <ServiceCommit icon={<ShieldCheck size={18}/>} title="Bảo hiểm du lịch" desc="Mức bồi thường cao" />
                    <ServiceCommit icon={<Zap size={18}/>} title="Hỗ trợ 24/7" desc="Hotline & Zalo" />
                    <ServiceCommit icon={<Headphones size={18}/>} title="HDV Tận Tâm" desc="Nhiều kinh nghiệm" />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 mt-8">
                <div className="flex items-center gap-3 mb-6"><Wallet size={20} className="text-indigo-600" /><h3 className="text-[11px] font-black uppercase text-slate-800 tracking-widest">Phương thức thanh toán</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentOption active={paymentMethod === 'cod'} onClick={() => setPaymentMethod('cod')} title="Thanh toán khi đi" desc="Trả tiền mặt cho HDV" icon={<Wallet size={18} className="text-slate-400" />} />
                  <PaymentOption active={paymentMethod === 'online'} onClick={() => setPaymentMethod('online')} title="Thanh toán Online" desc="VNPay / QR / ATM" icon={<CreditCard size={18} className="text-slate-400" />} />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex">
            <div className="bg-[#1a237e] rounded-[3.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col w-full">
                <div className="absolute -top-10 -right-10 opacity-5 rotate-12"><Ticket size={250} /></div>
                
                <div className="flex gap-5 mb-8 relative z-10 bg-white/10 p-5 rounded-[2rem] border border-white/10 backdrop-blur-md">
                  <img src={getImgUrl(tour?.thumbnail || tour?.imageUrl)} className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-xl" alt="" />
                  <div className="flex flex-col justify-center">
                    <h4 className="font-black text-sm uppercase italic line-clamp-2 leading-tight mb-2 tracking-tighter">{tour?.name}</h4>
                    <p className="text-[9px] uppercase font-bold flex items-center gap-2 opacity-70">
                        <Calendar size={12} className="text-amber-400"/> {formatDate(selectedSchedule?.departureDate)}
                    </p>
                    <p className="text-[9px] uppercase font-bold flex items-center gap-2 opacity-70">
                        <MapPin size={12} className="text-amber-400"/> {tour?.departureLocation || 'TP.HCM'}
                    </p>
                  </div>
                </div>

                <div className="space-y-6 relative z-10 flex-grow">
                  <div className="space-y-4 bg-black/20 p-5 rounded-[2.5rem] border border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest">Người lớn</span>
                        <span className="text-[9px] opacity-60">{(selectedSchedule?.adultPrice || 0).toLocaleString()}đ</span>
                      </div>
                      <InlineCounter count={adultCount} setCount={setAdultCount} min={1} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest">Trẻ em</span>
                        <span className="text-[9px] opacity-60">{(selectedSchedule?.childPrice || 0).toLocaleString()}đ</span>
                      </div>
                      <InlineCounter count={childCount} setCount={setChildCount} min={0} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={14} />
                          <input value={voucherInput} onChange={e => setVoucherInput(e.target.value)} disabled={!!appliedVoucher} placeholder="MÃ GIẢM GIÁ" className="w-full bg-white/10 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-[10px] font-black uppercase outline-none focus:bg-white/20 transition-all" />
                      </div>
                      {appliedVoucher ? (
                        <button onClick={() => {setAppliedVoucher(null); setVoucherInput('')}} className="bg-red-500/20 text-red-400 p-3.5 rounded-xl"><XCircle size={18}/></button>
                      ) : (
                        <button onClick={handleApplyVoucher} className="bg-amber-400 text-indigo-900 px-6 py-3.5 rounded-xl font-black text-[10px] uppercase hover:bg-amber-300 transition-all">DÙNG</button>
                      )}
                    </div>

                    <div className="flex justify-between text-[11px] font-black uppercase opacity-40 pt-4 tracking-widest">
                      <span>Tạm tính</span>
                      <span>{subTotal.toLocaleString()}đ</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[11px] font-black uppercase text-emerald-400 tracking-widest">
                        <span>Voucher giảm giá</span>
                        <span>-{discountAmount.toLocaleString()}đ</span>
                      </div>
                    )}

                    <div className="flex flex-col pt-6 border-t border-white/10">
                      <span className="text-[10px] font-black uppercase italic tracking-[0.4em] opacity-40 mb-2">Tổng thanh toán</span>
                      <span className="text-5xl font-black tracking-tighter text-amber-400 drop-shadow-2xl">{totalAmount.toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-8 mt-auto">
                  <button onClick={handleSubmit} className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-6 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.4em] flex items-center justify-center gap-3 transition-all shadow-xl hover:scale-[1.02]">
                    {paymentMethod === 'online' ? 'TIẾN HÀNH THANH TOÁN' : 'XÁC NHẬN ĐẶT TOUR'} <ChevronRight size={20} />
                  </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceCommit = ({ icon, title, desc }: any) => (
  <div className="flex gap-3 items-center">
    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">{icon}</div>
    <div>
      <p className="text-[10px] font-black uppercase">{title}</p>
      <p className="text-[9px] text-slate-400 font-bold uppercase">{desc}</p>
    </div>
  </div>
);

const PaymentOption = ({ active, onClick, title, desc, icon }: any) => (
  <div onClick={onClick} className={`p-5 rounded-[1.8rem] border-2 cursor-pointer transition-all flex items-center gap-4 h-full ${active ? 'border-indigo-600 bg-indigo-50' : 'border-slate-50 bg-slate-50/50 hover:border-indigo-100'}`}>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? 'border-indigo-600' : 'border-slate-300'}`}>
      {active && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
    </div>
    <div className="flex-1">
      <p className="text-[11px] font-black uppercase tracking-tight leading-tight">{title}</p>
      <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{desc}</p>
    </div>
    {icon}
  </div>
);

const InlineCounter = ({ count, setCount, min }: any) => (
  <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-1.5 border border-white/5">
    <button onClick={() => setCount(Math.max(min, count - 1))} className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center font-black text-white hover:bg-white/20 transition-all">-</button>
    <span className="font-black text-amber-400 text-sm w-4 text-center">{count}</span>
    <button onClick={() => setCount(count + 1)} className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-white hover:bg-white/40 transition-all">+</button>
  </div>
);

export default TourCheckout;