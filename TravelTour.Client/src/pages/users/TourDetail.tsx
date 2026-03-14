import { useParams, Link } from 'react-router-dom';
import { Calendar, Users, MapPin, ArrowLeft } from 'lucide-react';

const TourDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL

  return (
    <div className="animate-fadeIn">
      <Link to="/tours" className="flex items-center mb-6 hover:underline">
        <ArrowLeft size={20} className="mr-2"/> Quay lại danh sách
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <img 
          src="https://vcdn1-dulich.vnecdn.net/2022/05/11/vinh-Ha-Long-6630-1652260131.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=l_W7Q77TAsvYjS7v07Nf_A" 
          className="rounded-2xl shadow-lg w-full h-96 object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold mb-4">Tour Khám Phá Vịnh Hạ Long (ID: {id})</h1>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-center"><MapPin className="mr-2" size={18}/> Khởi hành: Hà Nội</div>
            <div className="flex items-center"><Calendar className="mr-2" size={18}/> Thời gian: 2 Ngày 1 Đêm</div>
            <div className="flex items-center"><Users className="mr-2" size={18}/> Chỗ trống: 10 người</div>
          </div>
          <div className="mt-8 p-6 bg-blue-50 rounded-xl">
            <div className="text-sm text-gray-500 italic">Giá từ</div>
            <div className="text-3xl font-black text-blue-700">2.500.000đ</div>
            <button className="w-full mt-4 bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-all">
              ĐẶT TOUR NGAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;