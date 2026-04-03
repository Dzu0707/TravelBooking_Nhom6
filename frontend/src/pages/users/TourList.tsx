import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TourList = () => {
  const [tours, setTours] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi API lấy danh sách tour đã nạp trong SQL
    axios.get("http://localhost:5091/api/Tours")
      .then(res => setTours(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-10">Khám Phá Tour Du Lịch</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tours.map((tour) => (
          <div key={tour.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500" 
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded uppercase">
                {tour.code}
              </span>
              <h3 className="text-xl font-bold mt-2">{tour.name}</h3>
              <p className="text-gray-500 text-sm mt-1">📍 {tour.departureLocation}</p>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-red-500 font-black text-lg">
                    {/* Đổi từ tourSchedules thành schedules cho khớp với Backend mới */}
                    {tour.schedules?.[0]?.adultPrice?.toLocaleString() || "Liên hệ"}đ
                </span>
                <button 
                    onClick={() => navigate('/checkout')} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700"
                >
                    Xem chi tiết
                </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourList;