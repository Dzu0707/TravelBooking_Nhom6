import { Link } from 'react-router-dom';
import { Map, ShieldCheck, CreditCard } from 'lucide-react';

const Home = () => {
  return (
    <div className="animate-fadeIn">
      {/* 1. HERO SECTION */}
      <section className="relative h-150 rounded-3xl overflow-hidden mb-16">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80" 
          alt="Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            KHÁM PHÁ THẾ GIỚI <br/> THEO CÁCH CỦA BẠN
          </h2>
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl">
            Hàng trăm tour du lịch hấp dẫn đang chờ đón bạn. Trải nghiệm dịch vụ đẳng cấp, giá cả hợp lý.
          </p>
          <Link to="/tours" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:scale-105">
            Bắt đầu hành trình ngay
          </Link>
        </div>
      </section>

      {/* 2. FEATURES SECTION (Lý do chọn chúng tôi) */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800">Tại sao chọn TravelGo?</h3>
          <div className="h-1 w-20 bg-blue-600 mx-auto mt-4"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
              <Map size={32} />
            </div>
            <h4 className="text-xl font-bold mb-3">Lịch trình đa dạng</h4>
            <p className="text-gray-500 text-sm">Hơn 500+ tour trong và ngoài nước với lịch khởi hành linh hoạt mỗi ngày.</p>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <ShieldCheck size={32} />
            </div>
            <h4 className="text-xl font-bold mb-3">An toàn tuyệt đối</h4>
            <p className="text-gray-500 text-sm">Mọi chuyến đi đều được bảo hiểm đầy đủ và đội ngũ hướng dẫn viên tận tâm.</p>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
              <CreditCard size={32} />
            </div>
            <h4 className="text-xl font-bold mb-3">Thanh toán linh hoạt</h4>
            <p className="text-gray-500 text-sm">Hỗ trợ nhiều hình thức thanh toán online, nhanh chóng và bảo mật cao.</p>
          </div>
        </div>
      </section>

      {/* 3. CTA SECTION */}
      <section className="bg-blue-700 rounded-3xl p-10 md:p-16 text-center text-white">
        <h3 className="text-3xl font-bold mb-6">Bạn đã sẵn sàng cho chuyến đi tiếp theo?</h3>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">Đăng ký nhận tin để không bỏ lỡ các chương trình giảm giá lên đến 50% hàng tháng.</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <input 
            type="email" 
            placeholder="Nhập email của bạn..." 
            className="px-6 py-3 rounded-full text-gray-800 outline-none w-full md:w-80"
          />
          <button className="bg-white text-blue-700 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
            Đăng ký ngay
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;