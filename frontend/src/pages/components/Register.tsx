import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Mail, Lock, User, Phone, 
  Loader2, ShieldCheck, 
  Compass, Map, PlaneTakeoff 
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Kiểm tra mật khẩu khớp nhau
    if (formData.password !== formData.confirmPassword) {
      return alert("Mật khẩu xác nhận không khớp!");
    }

    setLoading(true);
    try {
      // 2. Gọi API đăng ký
      await axios.post("http://localhost:5091/api/Auth/register", {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      // 3. LOGIC QUAN TRỌNG: Lưu sẵn thông tin vào localStorage để Profile sử dụng
      // Việc này giúp trang Profile có dữ liệu ngay lập tức mà không cần gọi API lần nữa
      localStorage.setItem('fullName', formData.fullName);
      localStorage.setItem('email', formData.email);
      localStorage.setItem('phone', formData.phone);
      localStorage.setItem('address', 'Chưa cập nhật địa chỉ'); // Mặc định ban đầu
      localStorage.setItem('role', '0'); // Mặc định khách hàng

      alert("Chúc mừng bạn đã gia nhập TravelGo! Hãy đăng nhập để bắt đầu hành trình.");
      
      // 4. Chuyển hướng sang trang đăng nhập
      navigate('/login');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Lỗi kết nối Server";
      alert("Lỗi: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center p-4 font-sans">
      <div className="max-w-6xl w-full bg-white shadow-[0_20px_60px_rgba(15,23,42,0.1)] rounded-[40px] flex overflow-hidden min-h-175 border border-white">
        
        {/* --- 🟢 BÊN TRÁI: FORM ĐĂNG KÝ 🟢 --- */}
        <div className="w-full lg:w-1/2 p-8 sm:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-6 rotate-3">
                <Compass className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">TravelGo Booking</h1>
              <p className="text-slate-500 text-sm mt-2 font-medium">Đăng ký để trở thành đối tác lữ hành tin cậy</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-100 transition-all text-sm font-bold outline-none"
                  type="text"
                  placeholder="Tên đại lý / Họ tên"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input
                    required
                    className="w-full pl-12 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-100 transition-all text-sm font-bold outline-none"
                    type="email"
                    placeholder="Email liên hệ"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input
                    required
                    className="w-full pl-12 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-100 transition-all text-sm font-bold outline-none"
                    type="tel"
                    placeholder="Hotline"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input
                    required
                    className="w-full pl-12 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-100 transition-all text-sm font-bold outline-none"
                    type="password"
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input
                    required
                    className="w-full pl-12 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-100 transition-all text-sm font-bold outline-none"
                    type="password"
                    placeholder="Xác nhận lại"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-slate-900 text-white font-black py-4.5 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center group disabled:bg-slate-200 mt-6"
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    <span className="uppercase tracking-[2px] text-xs">Mở khóa hành trình</span>
                    <PlaneTakeoff className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-400 text-sm font-medium">
                Bạn đã là thành viên? 
                <Link to="/login" className="text-blue-600 font-black hover:underline ml-1 italic">Đăng nhập</Link>
              </p>
            </div>
          </div>
        </div>

        {/* --- 🔵 BÊN PHẢI: BANNER 🔵 --- */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 relative items-center justify-center">
            <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="relative z-10 text-center px-12">
              <div className="flex justify-center gap-6 mb-10">
                  <div className="p-5 bg-white/10 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl animate-bounce">
                    <Map className="text-blue-200" size={40} />
                  </div>
              </div>

              <h2 className="text-4xl font-black text-white mb-6 leading-tight tracking-tight">
                Mở rộng <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-200 italic">Mạng lưới Du lịch</span>
              </h2>
              
              <div className="grid grid-cols-1 gap-3 max-w-xs mx-auto text-left">
                <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <span className="text-white/80 text-[11px] font-black uppercase tracking-widest">Hơn 1000+ Điểm đến quốc tế</span>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-white/80 text-[11px] font-black uppercase tracking-widest">Hệ thống Booking 24/7</span>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span className="text-white/80 text-[11px] font-black uppercase tracking-widest">Quản lý Tour chuyên nghiệp</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-10 text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">
               TravelGo Architecture
            </div>
        </div>
      </div>
    </div>
  );
};

export default Register;