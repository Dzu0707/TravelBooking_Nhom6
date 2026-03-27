import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  ArrowLeft, CheckCircle, XCircle, 
  Clock, CreditCard, User, MapPin 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.get('http://localhost:5091/api/Bookings', config);
      setBookings(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchBookings(); }, []);

  const filteredBookings = bookings.filter((b: any) => 
    filterStatus === "All" ? true : b.status === filterStatus
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate('/admin')} 
          className="flex items-center gap-2 text-gray-500 mb-6 font-bold hover:text-emerald-600 transition-all"
        >
          <ArrowLeft size={20}/> Quay lại Dashboard
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Quản lý Đơn hàng</h1>
            <p className="text-gray-500">Theo dõi doanh thu và trạng thái đặt tour của khách</p>
          </div>

          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
            {["All", "Pending", "Confirmed", "Cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  filterStatus === s ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                {s === "All" ? "TẤT CẢ" : s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-5 text-xs font-black text-gray-400 uppercase">Thông tin Tour & Khách</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase">Tổng tiền</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase">Ngày đặt</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center text-gray-400 font-bold">Đang tải dữ liệu đơn hàng...</td></tr>
              ) : filteredBookings.map((b: any) => (
                <tr key={b.id} className="hover:bg-emerald-50/20 transition-all group">
                  <td className="p-5">
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-gray-800 flex items-center gap-2">
                        <MapPin size={14} className="text-emerald-500"/> {b.tourName}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1 font-medium"><User size={12}/> {b.customerName}</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md">{b.totalPassengers} khách</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="font-black text-gray-900 text-lg flex items-center gap-1">
                      <CreditCard size={16} className="text-gray-400"/>
                      {b.totalPrice?.toLocaleString()}đ
                    </p>
                  </td>
                  <td className="p-5">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock size={14}/> 
                      {new Date(b.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-end items-center gap-3">
                      <span className={`px-3 py-1 border rounded-lg text-[10px] font-black uppercase ${getStatusStyle(b.status)}`}>
                        {b.status}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2 hover:bg-emerald-100 text-emerald-600 rounded-lg" title="Xác nhận"><CheckCircle size={18}/></button>
                        <button className="p-2 hover:bg-red-100 text-red-600 rounded-lg" title="Hủy đơn"><XCircle size={18}/></button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!loading && filteredBookings.length === 0 && (
            <div className="p-20 text-center text-gray-400 italic font-medium">
              Không có đơn hàng nào ở trạng thái này.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;