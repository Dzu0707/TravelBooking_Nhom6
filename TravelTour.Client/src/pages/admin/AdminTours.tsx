import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Plus, Pencil, Trash2, Search, Filter, 
  Eye, MapPin, Tag
} from 'lucide-react';

const AdminTours = () => {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTours = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5091/api/Tours');
      setTours(res.data);
    } catch (err) {
      console.error("Lỗi kết nối:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTours(); }, []);

  // Lọc theo trường "name" từ JSON của bạn
  const filteredTours = tours.filter((tour: any) =>
    tour.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Danh Sách Tour Hệ Thống</h1>
          <p className="text-sm text-gray-500">Tìm thấy {tours.length} tour trong cơ sở dữ liệu.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-blue-200 transition-all">
          <Plus size={20} /> Thêm Tour Mới
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Tìm theo tên tour hoặc mã tour (VD: HL001)..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-6 py-3 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-all flex items-center gap-2">
          <Filter size={18} /> Bộ lọc
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-5 text-xs font-black text-gray-400 uppercase">Thông tin Tour</th>
              <th className="p-5 text-xs font-black text-gray-400 uppercase">Phân loại</th>
              <th className="p-5 text-xs font-black text-gray-400 uppercase">Giá thấp nhất</th>
              <th className="p-5 text-xs font-black text-gray-400 uppercase text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={4} className="p-20 text-center text-gray-400 font-bold">Đang lấy dữ liệu từ Server...</td></tr>
            ) : filteredTours.map((tour: any) => (
              <tr key={tour.id} className="hover:bg-blue-50/30 transition-all group">
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-black">
                      {tour.thumbnail ? <img src={tour.thumbnail} className="w-full h-full object-cover rounded-2xl" /> : tour.code.substring(0,2)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">{tour.name}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><Tag size={12}/> {tour.code}</span>
                        <span className="flex items-center gap-1"><MapPin size={12}/> {tour.departureLocation}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase">
                    {tour.categoryName}
                  </span>
                </td>
                <td className="p-5">
                  <p className="font-black text-orange-600 text-lg">
                    {tour.minPrice.toLocaleString()} <span className="text-xs">₫</span>
                  </p>
                </td>
                <td className="p-5">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-xl"><Eye size={18}/></button>
                    <button className="p-2 hover:bg-amber-100 text-amber-600 rounded-xl"><Pencil size={18}/></button>
                    <button className="p-2 hover:bg-red-100 text-red-600 rounded-xl"><Trash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTours;