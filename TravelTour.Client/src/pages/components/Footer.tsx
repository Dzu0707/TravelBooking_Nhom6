const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-xl font-bold mb-4 italic">Travel<span className="text-orange-500">Go</span></h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Hệ thống đặt tour du lịch hàng đầu Việt Nam. Mang lại trải nghiệm tuyệt vời cho mọi chuyến đi của bạn.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Liên kết nhanh</h4>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>Về chúng tôi</li>
            <li>Chính sách bảo mật</li>
            <li>Điều khoản dịch vụ</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Liên hệ</h4>
          <p className="text-gray-400 text-sm">Email: contact@travelgo.com</p>
          <p className="text-gray-400 text-sm">Hotline: 1900 1234</p>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-xs">
        © 2026 TravelGo Project - Đồ án Công nghệ phần mềm
      </div>
    </footer>
  );
};

export default Footer;