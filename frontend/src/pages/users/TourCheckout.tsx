import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CreditCard, Users, Calendar, ChevronRight, Ticket, Info, MapPin } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scheduleId = searchParams.get('scheduleId');

  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Dòng 21: setNote đã được khai báo và giờ sẽ được sử dụng bên dưới
  const [note, setNote] = useState('');

  const API_BASE_URL = "http://localhost:5091";

  const getImgUrl = (path: string | null | undefined) => {
    if (!path) return "https://placehold.co/200x200?text=TravelGo";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchTour = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/Tours/${id}`);
        setTour(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Không thể lấy thông tin tour!");
        navigate('/tours');
      }
    };
    fetchTour();
  }, [id, navigate]);

  const selectedSchedule = tour?.tourSchedules?.find((s: any) => s.id === Number(scheduleId)) 
                           || tour?.tourSchedules?.[0];

  const adultPrice = selectedSchedule?.adultPrice || 0;
  const childPrice = selectedSchedule?.childPrice || 0;
  const totalAmount = (adultCount * adultPrice) + (childCount * childPrice);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) return toast.error("Vui lòng điền đủ thông tin!");

    const token = localStorage.getItem('token');
    if (!token) return toast.error("Vui lòng đăng nhập!");

    const loadId = toast.loading("Đang xử lý...");
    try {
      const bookingData = {
        tourId: parseInt(id!),
        tourScheduleId: selectedSchedule?.id,
        fullName, email, phone, adultCount, childCount, totalAmount, note,
        status: "Pending"
      };
      await axios.post(`${API_BASE_URL}/api/Bookings`, bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Đặt tour thành công!", { id: loadId });
      navigate('/profile');
    } catch (error) {
      toast.error("Thất bại!", { id: loadId });
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-[#f8faff] min-h-screen pb-20 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto px-4 pt-10">
        
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 mb-8 hover:text-indigo-600 font-black uppercase text-[10px] tracking-[0.4em]">
          <ArrowLeft size={16} className="mr-2"/> QUAY LẠI
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-white">
              <h2 className="text-2xl font-black text-slate-800 mb-8 uppercase italic tracking-tighter flex items-center gap-3">
                <div className="w-2 h-8 bg-indigo-600 rounded-full"></div> Thông tin khách hàng
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-3 bg-blue-50 text-blue-600 p-4 rounded-2xl mb-6 border border-blue-100">
                  <Info size={18} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Vui lòng kiểm tra kỹ thông tin liên lạc</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Họ và tên *</label>
                    <input value={fullName} onChange={e => setFullName(e.target.value)} type="text" placeholder="Nguyễn Văn A" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Số điện thoại *</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="090..." className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Email nhận vé *</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="example@gmail.com" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none" />
                </div>

                {/* SỬA LỖI TẠI ĐÂY: setNote đã được sử dụng */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Ghi chú chuyến đi</label>
                  <textarea 
                    value={note} 
                    onChange={e => setNote(e.target.value)} 
                    rows={3} 
                    placeholder="Yêu cầu đặc biệt về phòng, ăn uống..." 
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm italic outline-none focus:ring-2 focus:ring-indigo-100 transition-all resize-none shadow-inner" 
                  />
                </div>

                <div className="pt-8 border-t border-slate-50">
                   <div className="flex items-center gap-2 mb-6 text-slate-800">
                      <Users size={20} className="text-indigo-600" />
                      <h3 className="text-[11px] font-black uppercase tracking-widest">Số lượng thành viên</h3>
                   </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-6 rounded-[2rem] flex items-center justify-between border border-white">
                       <span className="text-[10px] font-black uppercase text-slate-500">Người lớn</span>
                       <div className="flex items-center gap-5">
                          <button type="button" onClick={() => setAdultCount(Math.max(1, adultCount - 1))} className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center font-black hover:bg-indigo-600 hover:text-white transition-all">-</button>
                          <span className="font-black text-indigo-600 text-lg">{adultCount}</span>
                          <button type="button" onClick={() => setAdultCount(adultCount + 1)} className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center font-black hover:bg-indigo-600 hover:text-white transition-all">+</button>
                       </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-[2rem] flex items-center justify-between border border-white">
                       <span className="text-[10px] font-black uppercase text-slate-500">Trẻ em</span>
                       <div className="flex items-center gap-5">
                          <button type="button" onClick={() => setChildCount(Math.max(0, childCount - 1))} className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center font-black hover:bg-amber-500 hover:text-white transition-all">-</button>
                          <span className="font-black text-amber-500 text-lg">{childCount}</span>
                          <button type="button" onClick={() => setChildCount(childCount + 1)} className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center font-black hover:bg-amber-500 hover:text-white transition-all">+</button>
                       </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-indigo-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-[-20px] right-[-20px] opacity-10"><Ticket size={180} /></div>
               <h3 className="text-xl font-black mb-10 uppercase italic tracking-tighter relative z-10">Tóm tắt chuyến đi</h3>
               <div className="flex gap-5 mb-10 relative z-10 bg-white/5 p-4 rounded-[2rem] border border-white/10">
                  <img src={getImgUrl(tour?.thumbnail || tour?.imageUrl)} className="w-20 h-20 rounded-[1.5rem] object-cover border-2 border-white/20" alt="" />
                  <div className="flex flex-col justify-center">
                    <h4 className="font-black text-sm uppercase italic line-clamp-1 leading-tight mb-2">{tour?.name}</h4>
                    <p className="text-[9px] uppercase font-bold text-indigo-300 flex items-center gap-2">
                       <Calendar size={12}/> Khởi hành: {selectedSchedule ? new Date(selectedSchedule.startDate).toLocaleDateString('vi-VN') : '---'}
                    </p>
                    <p className="text-[9px] uppercase font-bold text-indigo-300 flex items-center gap-2">
                       <MapPin size={12}/> {tour?.departureLocation}
                    </p>
                  </div>
               </div>
               <div className="pt-8 border-t border-white/10 relative z-10 flex justify-between items-center">
                    <span className="text-xs font-black uppercase italic tracking-widest">Tổng thanh toán</span>
                    <span className="text-4xl font-black tracking-tighter text-amber-400">{totalAmount.toLocaleString()}đ</span>
               </div>
            </div>

            <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-indigo-50">
               <div className="flex items-center gap-4 mb-10">
                  <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-500"><ShieldCheck size={28}/></div>
                  <p className="text-[10px] font-black uppercase text-slate-800 tracking-tighter">Giao dịch bảo mật qua hệ thống</p>
               </div>
               
               <button onClick={handleSubmit} className="w-full bg-indigo-600 hover:bg-slate-900 text-white py-6 rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 group mb-8">
                 Xác nhận thanh toán <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
               </button>

               <div className="flex flex-col items-center gap-4 opacity-30 pt-6 border-t border-slate-50">
                  <CreditCard size={24} className="text-slate-600" />
                  <span className="text-[8px] font-black uppercase tracking-widest italic text-center">Hỗ trợ thanh toán đa phương thức</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;