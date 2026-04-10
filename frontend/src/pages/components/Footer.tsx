import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Youtube, 
  Send,
  ArrowRight
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* CỘT 1: THÔNG TIN THƯƠNG HIỆU */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg transition-transform group-hover:rotate-12">
                T
              </div>
              <span className="text-2xl font-black tracking-tighter">
                Travel<span className="text-blue-500">Go</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Hệ thống đặt tour du lịch hàng đầu Việt Nam. Chúng tôi cam kết mang lại trải nghiệm tuyệt vời và an toàn cho mọi hành trình của bạn trên khắp thế giới.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-900 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all group shadow-sm">
                <Facebook size={18} className="text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-900 hover:bg-pink-600 rounded-xl flex items-center justify-center transition-all group shadow-sm">
                <Instagram size={18} className="text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-900 hover:bg-red-600 rounded-xl flex items-center justify-center transition-all group shadow-sm">
                <Youtube size={18} className="text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* CỘT 2: LIÊN KẾT NHANH */}
          <div>
            <h4 className="text-lg font-bold mb-8 relative inline-block">
              Liên kết nhanh
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-blue-600 rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              {['Về chúng tôi', 'Tour du lịch', 'Điểm đến nổi bật', 'Tin tức du lịch', 'Ưu đãi đặc biệt'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-400 hover:text-blue-500 text-sm transition-all flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CỘT 3: THÔNG TIN LIÊN HỆ */}
          <div>
            <h4 className="text-lg font-bold mb-8 relative inline-block">
              Thông tin liên hệ
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-blue-600 rounded-full"></span>
            </h4>
            <ul className="space-y-5">
              <li className="flex gap-4">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase">Email hỗ trợ</p>
                  <p className="text-sm font-bold text-gray-300">contact@travelgo.com</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-green-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase">Hotline 24/7</p>
                  <p className="text-sm font-bold text-gray-300">1900 1234</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-red-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase">Trụ sở chính</p>
                  <p className="text-sm font-bold text-gray-300">Quận 12, TP. Hồ Chí Minh</p>
                </div>
              </li>
            </ul>
          </div>

          {/* CỘT 4: BẢN TIN */}
          <div>
            <h4 className="text-lg font-bold mb-8 relative inline-block">
              Đăng ký nhận tin
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-blue-600 rounded-full"></span>
            </h4>
            <p className="text-gray-400 text-sm mb-6 font-medium">
              Nhận ngay ưu đãi giảm giá lên đến 30% khi đăng ký hôm nay.
            </p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email của bạn..." 
                className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 px-5 text-sm outline-none focus:border-blue-600 transition-all font-medium"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-xl transition-all shadow-lg active:scale-95">
                <Send size={18} />
              </button>
            </div>
            <p className="mt-4 text-[10px] text-gray-600 italic">
              * Chúng tôi cam kết không spam hòm thư của bạn.
            </p>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-900 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs font-medium">
            © 2026 <span className="text-blue-600 font-bold">TravelGo Project</span> - Đồ án Công nghệ phần mềm. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link to="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors uppercase font-black tracking-widest">Quy định</Link>
            <Link to="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors uppercase font-black tracking-widest">Bảo mật</Link>
            <Link to="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors uppercase font-black tracking-widest">Sơ đồ web</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;