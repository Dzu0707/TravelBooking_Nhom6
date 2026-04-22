import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, ShieldCheck, Users, Calendar, 
  ChevronRight, Ticket, Info, MapPin, Tag, CheckCircle2, CreditCard, Wallet
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
        } catch (vErr) { 
          console.warn("Voucher fetch restricted"); 
        }
        setLoading(false);
      } catch (error) { 
        console.error("Fetch error:", error);
        setLoading(false); 
      }
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
    const total = (adultCount * aPrice) + (childCount * cPrice);
    return isNaN(total) ? 0 : total;
  }, [adultCount, childCount, selectedSchedule]);

  const discountAmount = useMemo(() => {
    if (!appliedVoucher) return 0;
    const val = Number(appliedVoucher.discountValue ?? appliedVoucher.DiscountValue ?? 0);
    const type = String(appliedVoucher.discountType ?? appliedVoucher.DiscountType ?? "").toLowerCase();
    if (isNaN(val)) return 0;
    return type.includes('percent') ? (subTotal * val) / 100 : val;
  }, [appliedVoucher, subTotal]);

  const totalAmount = useMemo(() => Math.max(0, subTotal - discountAmount), [subTotal, discountAmount]);

  const validateForm = () => {
    if (!fullName.trim() || fullName.trim().split(" ").length < 2) {
      toast.error("Vui lòng nhập đầy đủ Họ và Tên!");
      return false;
    }
    const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Số điện thoại không hợp lệ!");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email không đúng định dạng!");
      return false;
    }
    return true;
  };

  const handleApplyVoucher = async () => {
    const code = voucherInput.trim().toUpperCase();
    if (!code) return toast.error("Vui lòng nhập mã!");
    const localVoucher = systemVouchers.find(v => (v.code || v.Code || "").toUpperCase() === code);
    if (localVoucher) {
      setAppliedVoucher(localVoucher);
      toast.success("Áp dụng mã thành công!");
    } else {
      const loadId = toast.loading("Đang kiểm tra mã...");
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(`${API_BASE_URL}/api/Vouchers/validate`, 
          { code, orderAmount: subTotal }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data) {
          setAppliedVoucher(res.data);
          toast.success("Áp dụng mã thành công!", { id: loadId });
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Mã không hợp lệ", { id: loadId });
      }
    }
  };

  // --- HÀM SUBMIT ĐÃ ĐƯỢC CẬP NHẬT ĐỂ KHÔNG BỊ UNDEFINED ---
  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error("Vui lòng đăng nhập để đặt tour!");
    if (!validateForm()) return;

    const loadId = toast.loading("Đang xử lý đặt tour...");
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
        paymentMethod, 
        voucherCode: appliedVoucher?.code || appliedVoucher?.Code || null
      };

      const response = await axios.post(`${API_BASE_URL}/api/Bookings`, data, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      // Lấy ID từ phản hồi của Backend (Thử cả chữ thường và chữ hoa tùy theo API)
      const bookingId = response.data.id || response.data.BookingId || response.data.bookingId;

      if (!bookingId) {
        console.error("Dữ liệu trả về không có ID:", response.data);
        toast.error("Lỗi: Không nhận được mã đơn hàng từ hệ thống!", { id: loadId });
        return;
      }

      toast.success("Ghi nhận đơn đặt tour!", { id: loadId });

      if (paymentMethod === 'online') {
        // Sử dụng bookingId chắc chắn đã lấy được ở trên
        setTimeout(() => navigate(`/payment-gateway?bookingId=${bookingId}&amount=${totalAmount}`), 1000);
      } else {
        setTimeout(() => navigate('/my-bookings'), 1500);
      }

    } catch (error: any) { 
      const errorMsg = error.response?.data || "Lỗi hệ thống, vui lòng thử lại!";
      toast.error(errorMsg, { id: loadId }); 
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-indigo-600 uppercase italic">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-[#f8faff] min-h-screen pb-20 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto px-4 pt-12">
        <button onClick={() => navigate(-1)} className="group flex items-center text-slate-400 mb-10 font-black uppercase text-[10px] tracking-[0.4em] hover:text-indigo-600 transition-all outline-none">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform"/> QUAY LẠI
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* CỘT TRÁI */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-2xl shadow-indigo-100/20 border border-white">
              <h2 className="text-2xl font-black text-slate-800 mb-10 uppercase italic flex items-center gap-4">
                <div className="w-2.5 h-10 bg-indigo-600 rounded-full"></div> THÔNG TIN LIÊN LẠC
              </h2>

              <div className="space-y-8">
                <div className="flex items-center gap-4 bg-indigo-50 text-indigo-600 p-5 rounded-[2rem] border border-indigo-100/50">
                  <Info size={22} />
                  <p className="text-[11px] font-black uppercase tracking-widest text-indigo-700">Kiểm tra kỹ thông tin trước khi xác nhận.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 ml-5 uppercase tracking-widest">Họ và tên *</label>
                    <input value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.8rem] p-5 text-sm font-bold outline-none transition-all" placeholder="Nguyễn Văn A" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 ml-5 uppercase tracking-widest">Số điện thoại *</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.8rem] p-5 text-sm font-bold outline-none transition-all" placeholder="090..." />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 ml-5 uppercase tracking-widest">Địa chỉ Email *</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.8rem] p-5 text-sm font-bold outline-none transition-all" placeholder="example@gmail.com" />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 ml-5 uppercase tracking-widest">Yêu cầu đặc biệt</label>
                  <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.8rem] p-5 text-sm font-medium outline-none transition-all resize-none" placeholder="Ghi chú thêm về dịch vụ..." />
                </div>

                {/* PHƯƠNG THỨC THANH TOÁN */}
                <div className="pt-10 border-t border-slate-100">
                  <div className="flex items-center gap-3 mb-6"><Wallet size={20} className="text-indigo-600" /><h3 className="text-[12px] font-black uppercase text-slate-800 tracking-widest">Phương thức thanh toán</h3></div>
                  <div className="grid grid-cols-1 gap-4">
                    <PaymentOption 
                      active={paymentMethod === 'cod'} 
                      onClick={() => setPaymentMethod('cod')}
                      title="Thanh toán khi khởi hành"
                      desc="Trả trực tiếp cho hướng dẫn viên"
                    />
                    <PaymentOption 
                      active={paymentMethod === 'online'} 
                      onClick={() => setPaymentMethod('online')}
                      title="Chuyển khoản / Cổng thanh toán"
                      desc="Thanh toán ngay qua QR hoặc Thẻ"
                      icon={<CreditCard size={20} className="text-slate-400" />}
                    />
                  </div>
                </div>

                {/* VOUCHER & SỐ KHÁCH */}
                <div className="grid grid-cols-1 gap-10 pt-10 border-t border-slate-100">
                  <div>
                    <div className="flex items-center gap-3 mb-6"><Tag size={20} className="text-indigo-600" /><h3 className="text-[12px] font-black uppercase text-slate-800 tracking-widest">Ưu đãi / Voucher</h3></div>
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <input value={voucherInput} onChange={e => setVoucherInput(e.target.value)} disabled={!!appliedVoucher} className="w-full bg-slate-100 rounded-[1.8rem] p-5 text-sm font-black uppercase tracking-widest outline-none" placeholder="NHẬP MÃ..." />
                        {appliedVoucher && <CheckCircle2 className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500" size={24} />}
                      </div>
                      {appliedVoucher ? (
                        <button onClick={() => {setAppliedVoucher(null); setVoucherInput('')}} className="px-8 bg-slate-200 rounded-[1.8rem] font-black text-[11px] uppercase transition-colors hover:bg-slate-300">Gỡ mã</button>
                      ) : (
                        <button onClick={handleApplyVoucher} className="px-10 bg-indigo-600 text-white rounded-[1.8rem] font-black text-[11px] uppercase shadow-xl hover:bg-indigo-700 transition-all">Áp dụng</button>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-8"><Users size={22} className="text-indigo-600" /><h3 className="text-[12px] font-black uppercase text-slate-800 tracking-widest">Hành khách</h3></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Counter label="Người lớn" count={adultCount} setCount={setAdultCount} min={1} />
                      <Counter label="Trẻ em" count={childCount} setCount={setChildCount} min={0} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#1a237e] rounded-[4rem] p-10 md:p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-5 rotate-12"><Ticket size={300} /></div>
                <h3 className="text-2xl font-black mb-10 uppercase italic relative z-10">Tóm tắt đơn hàng</h3>
                
                <div className="flex gap-6 mb-12 relative z-10 bg-white/10 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                  <img src={getImgUrl(tour?.thumbnail || tour?.imageUrl)} className="w-24 h-24 rounded-[2rem] object-cover border-2 border-white/20 shadow-2xl" alt="" />
                  <div className="flex flex-col justify-center">
                    <h4 className="font-black text-md uppercase italic line-clamp-2 leading-tight mb-3 tracking-tighter">{tour?.name}</h4>
                    <div className="space-y-1.5 opacity-80">
                      <p className="text-[10px] uppercase font-bold flex items-center gap-2">
                        <Calendar size={14} className="text-amber-400"/> {formatDate(selectedSchedule?.departureDate)}
                      </p>
                      <p className="text-[10px] uppercase font-bold flex items-center gap-2">
                        <MapPin size={14} className="text-amber-400"/> {tour?.departureLocation || 'TP.HCM'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 pt-8 border-t border-white/10 relative z-10">
                  <div className="flex justify-between text-[12px] font-bold uppercase opacity-50 tracking-widest">
                    <span>Tạm tính ({adultCount}L + {childCount}T)</span>
                    <span>{subTotal.toLocaleString()}đ</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[12px] font-black uppercase text-emerald-400 tracking-widest">
                      <span>Giảm giá Voucher</span>
                      <span>-{discountAmount.toLocaleString()}đ</span>
                    </div>
                  )}
                  <div className="flex flex-col pt-10 border-t border-white/10">
                    <span className="text-[11px] font-black uppercase italic tracking-[0.4em] opacity-40 mb-3">Tổng cộng</span>
                    <span className="text-6xl font-black tracking-tighter text-amber-400 drop-shadow-2xl">{totalAmount.toLocaleString()}đ</span>
                  </div>
                </div>
            </div>

            <div className="bg-white p-10 md:p-12 rounded-[4rem] shadow-xl border border-indigo-50 text-center">
               <button onClick={handleSubmit} className="w-full bg-indigo-600 hover:bg-[#1a237e] text-white py-8 rounded-[2.5rem] font-black uppercase text-[12px] tracking-[0.4em] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-indigo-100 hover:scale-[1.02]">
                 {paymentMethod === 'online' ? 'TIẾN HÀNH THANH TOÁN' : 'XÁC NHẬN ĐẶT TOUR'} <ChevronRight size={20} />
               </button>
               <p className="mt-8 text-[10px] font-black uppercase text-slate-300 tracking-widest italic flex items-center justify-center gap-2">
                 <ShieldCheck size={14} className="text-emerald-500" /> Thanh toán an toàn & bảo mật
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentOption = ({ active, onClick, title, desc, icon }: any) => (
  <div 
    onClick={onClick}
    className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center gap-5 ${active ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-indigo-200 bg-slate-50/50'}`}
  >
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${active ? 'border-indigo-600' : 'border-slate-300'}`}>
      {active && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
    </div>
    <div className="flex-1">
      <p className="text-[12px] font-black uppercase tracking-tight">{title}</p>
      <p className="text-[10px] text-slate-400 font-bold uppercase">{desc}</p>
    </div>
    {icon}
  </div>
);

const Counter = ({ label, count, setCount, min }: any) => (
  <div className="bg-slate-50 p-6 rounded-[2.2rem] flex items-center justify-between border border-white">
    <span className="text-[11px] font-black uppercase text-slate-500 tracking-widest">{label}</span>
    <div className="flex items-center gap-6">
      <button onClick={() => setCount(Math.max(min, count - 1))} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center font-black text-slate-800 hover:bg-indigo-600 hover:text-white transition-all outline-none">-</button>
      <span className="font-black text-indigo-600 text-xl w-6 text-center">{count}</span>
      <button onClick={() => setCount(count + 1)} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center font-black text-slate-800 hover:bg-indigo-600 hover:text-white transition-all outline-none">+</button>
    </div>
  </div>
);

export default TourCheckout;