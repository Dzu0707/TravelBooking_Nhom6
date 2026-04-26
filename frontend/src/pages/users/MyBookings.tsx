import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Trash2, Calendar, Users, Loader2 } from 'lucide-react';

interface MyBooking {
  id: number;
  orderCode: string;
  tourName: string;
  totalPrice: number;
  totalPassengers: number;
  status: string;
  createdAt: string;
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://localhost:5091";

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/Bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (error) {
      toast.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number, code: string) => {
    if (!window.confirm(`Hủy đơn hàng ${code}?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/Bookings/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Đã hủy đơn hàng");
      fetchMyBookings();
    } catch (error: any) {
      toast.error("Không thể hủy đơn này");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Lịch sử đặt tour</h1>

        <div className="space-y-4">
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <div key={b.id} className="border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      #{b.orderCode}
                    </span>
                    <span className={`text-xs font-medium ${
                      b.status === 'Confirmed' ? 'text-emerald-600' : 
                      b.status === 'Cancelled' ? 'text-rose-600' : 'text-amber-600'
                    }`}>
                      • {b.status === 'Confirmed' ? 'Thành công' : b.status === 'Cancelled' ? 'Đã hủy' : 'Chờ duyệt'}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-slate-800 text-lg">{b.tourName}</h3>
                  
                  <div className="flex items-center gap-4 text-slate-500 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar size={14}/> {format(new Date(b.createdAt), 'dd/MM/yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14}/> {b.totalPassengers} khách
                    </span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2">
                  <div className="text-xl font-bold text-slate-900">
                    {b.totalPrice.toLocaleString()}₫
                  </div>
                  
                  {b.status === 'Pending' && (
                    <button 
                      onClick={() => handleCancel(b.id, b.orderCode)}
                      className="text-rose-500 hover:text-rose-700 text-sm font-medium flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Hủy chuyến
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400">
              Bạn chưa có đơn đặt tour nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;