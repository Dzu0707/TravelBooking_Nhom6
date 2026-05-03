import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0b] text-gray-400 pt-10 pb-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* BRAND */}
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-2 mb-3 group">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white group-hover:rotate-6 transition-transform">
                <Globe size={16} />
              </div>
              <span className="text-lg font-bold text-white tracking-tighter uppercase">
                Travel<span className="text-blue-500">Go</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-xs opacity-70">
              Nền tảng đặt tour chuyên nghiệp, tối ưu trải nghiệm và an toàn cho mọi hành trình của bạn.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="md:col-span-3">
            <h4 className="text-white text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Khám phá</h4>
            <ul className="grid grid-cols-1 gap-2 text-xs">
              {[
                { n: 'Về chúng tôi', p: '/about' },
                { n: 'Tour du lịch', p: '/tours' },
                { n: 'Tin tức', p: '/news' },
                // { n: 'Ưu đãi', p: '/offers' }, // mở lại khi có route
              ].map((item) => (
                <li key={item.n}>
                  <Link to={item.p} className="hover:text-blue-500 transition-colors">
                    {item.n}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="md:col-span-4">
            <h4 className="text-white text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Liên hệ</h4>
            <div className="flex flex-col gap-3 text-xs">
              <a href="mailto:contact@travelgo.com" className="flex items-center gap-2 group hover:text-white transition-colors">
                <Mail size={14} className="text-blue-500 group-hover:scale-110 transition-transform" />
                <span>contact@travelgo.com</span>
              </a>
              <a href="tel:0383933267" className="flex items-center gap-2 group hover:text-white transition-colors">
                <Phone size={14} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                <span>0383933267</span>
              </a>
              <a
                href="https://maps.google.com/?q=Quan+12+TPHCM"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 group hover:text-white transition-colors"
              >
                <MapPin size={14} className="text-rose-500 group-hover:scale-110 transition-transform" />
                <span>Quận 12, TP.HCM</span>
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest">
          <p>© 2026 TravelGo</p>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook" className="hover:text-white transition-colors">
              <Facebook size={14} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">
              <Instagram size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;