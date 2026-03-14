import { useState } from 'react';
import axios from 'axios';

const TourCheckout = () => {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const ADULT_PRICE = 4500000; 
  const CHILD_PRICE = 2500000; 
  const totalPrice = (adults * ADULT_PRICE) + (children * CHILD_PRICE);

  const handleBooking = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Vui lòng đăng nhập để đặt tour!");

    setLoading(true);
    try {
      // Gửi dữ liệu với tourScheduleId là 3 (Khớp với SQL hiện tại của bạn)
      const response = await axios.post("http://localhost:5091/api/Bookings", {
        tourScheduleId: 3, 
        totalPassengers: adults + children,
        totalPrice: totalPrice
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`✅ Đặt thành công! Đơn hàng ID: ${response.data.bookingId}`);
    } catch (err: any) {
      // In lỗi chi tiết ra console để nếu có lỗi thì mình biết tại sao
      console.error(err.response?.data);
      alert("❌ Lỗi: " + (err.response?.data || "Không thể đặt tour"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-2xl rounded-3xl border">
      <h2 className="text-2xl font-bold mb-6 text-center">Chi tiết đặt Tour</h2>
      
      {/* Selector Người lớn */}
      <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-xl">
        <div>
          <p className="font-bold">Người lớn</p>
          <p className="text-sm text-gray-500">{ADULT_PRICE.toLocaleString()}đ</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 bg-gray-200 rounded-full border shadow-sm">-</button>
          <span className="font-bold">{adults}</span>
          <button onClick={() => setAdults(adults + 1)} className="w-8 h-8 bg-gray-200 rounded-full border shadow-sm">+</button>
        </div>
      </div>

      {/* Selector Trẻ em */}
      <div className="flex justify-between items-center mb-6 p-3 bg-gray-50 rounded-xl">
        <div>
          <p className="font-bold">Trẻ em</p>
          <p className="text-sm text-gray-500">{CHILD_PRICE.toLocaleString()}đ</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 bg-gray-200 rounded-full border shadow-sm">-</button>
          <span className="font-bold">{children}</span>
          <button onClick={() => setChildren(children + 1)} className="w-8 h-8 bg-gray-200 rounded-full border shadow-sm">+</button>
        </div>
      </div>

      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between text-xl font-black">
          <span>Tổng tiền:</span>
          <span className="text-red-500">{totalPrice.toLocaleString()}đ</span>
        </div>
      </div>

      <button 
        onClick={handleBooking}
        disabled={loading}
        className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 disabled:bg-gray-400 transition-all"
      >
        {loading ? "ĐANG XỬ LÝ..." : "🛒 XÁC NHẬN ĐẶT NGAY"}
      </button>
    </div>
  );
};

export default TourCheckout;