import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TourProps {
  tour: {
    id: number;
    name: string;
    adultPrice: number;
    departureLocation: string;
    categoryName: string;
    thumbnail: string;
  };
}

const TourCard = ({ tour }: TourProps) => {
  const API_BASE_URL = "http://localhost:5091"; 

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full">
      <div className="relative">
        <img 
          className="h-48 w-full object-cover" 
          src={tour.thumbnail?.startsWith('http') ? tour.thumbnail : `${API_BASE_URL}${tour.thumbnail}`} 
          alt={tour.name} 
        />
      </div>

      <div className="p-4 flex flex-col grow">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{tour.name}</h3>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin size={14} className="mr-1 text-red-500" /> {tour.departureLocation}
        </div>

        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
          <span className="text-blue-600 font-black text-xl">
            {tour.adultPrice?.toLocaleString()}đ
          </span>

          {/* CHỖ NÀY LÀ QUAN TRỌNG NHẤT: Phải dẫn đến /tours/ chứ không phải /checkout */}
          <Link to={`/tours/${tour.id}`}>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all">
              Xem chi tiết
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;