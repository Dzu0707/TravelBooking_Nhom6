import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Send
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">

        {/* TOP */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* BRAND */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                T
              </div>
              <span className="text-lg font-semibold text-white">
                Travel<span className="text-blue-500">Go</span>
              </span>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Nền tảng đặt tour du lịch giúp bạn khám phá thế giới dễ dàng,
              an toàn và tiết kiệm hơn.
            </p>

            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <div
                  key={i}
                  className="w-9 h-9 bg-gray-900 hover:bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer transition"
                >
                  <Icon size={16} />
                </div>
              ))}
            </div>
          </div>

          {/* LINKS */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              Khám phá
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Về chúng tôi",
                "Tour du lịch",
                "Điểm đến",
                "Tin tức",
                "Ưu đãi"
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="hover:text-blue-500 transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              Liên hệ
            </h4>
            <ul className="space-y-4 text-sm">

              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-1 text-blue-500" />
                <span>contact@travelgo.com</span>
              </li>

              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-1 text-green-500" />
                <span>1900 1234</span>
              </li>

              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 text-red-500" />
                <span>Quận 12, TP.HCM</span>
              </li>

            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              Nhận ưu đãi
            </h4>

            <p className="text-sm text-gray-400 mb-4">
              Đăng ký để nhận thông tin khuyến mãi mới nhất.
            </p>

            <div className="flex items-center bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
              />
              <button className="bg-blue-600 px-3 py-2 hover:bg-blue-700 transition">
                <Send size={16} />
              </button>
            </div>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-900 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>
            © 2026 TravelGo. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link to="#" className="hover:text-gray-300 transition">
              Quy định
            </Link>
            <Link to="#" className="hover:text-gray-300 transition">
              Bảo mật
            </Link>
            <Link to="#" className="hover:text-gray-300 transition">
              Sitemap
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;