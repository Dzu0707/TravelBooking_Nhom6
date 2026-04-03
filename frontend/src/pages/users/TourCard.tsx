import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

// Định nghĩa kiểu dữ liệu cho Tour - Giúp Code sạch và ít lỗi
interface TourProps {
  tour: {
    id: number;
    name: string;
    price: number;
    startPoint: string;
    category: string;
    image: string;
  };
}

const TourCard = ({ tour }: TourProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="relative">
        <img className="h-48 w-full object-cover" src={tour.image} alt={tour.name} />
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
          {tour.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 truncate">{tour.name}</h3>
        <div className="flex items-center text-gray-500 text-sm mt-2">
          <MapPin size={14} className="mr-1" /> {tour.startPoint}
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-blue-600 font-bold text-xl">{tour.price.toLocaleString()}đ</span>
          </div>
            <Link to={`/tours/${tour.id}`}>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              Xem chi tiết
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;