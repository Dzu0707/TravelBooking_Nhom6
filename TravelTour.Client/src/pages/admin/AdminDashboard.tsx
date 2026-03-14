import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Edit, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      // Lấy token
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error("Không tìm thấy Token trong LocalStorage");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:5091/api/tours', {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
        setTours(res.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          console.error("Token hết hạn hoặc không hợp lệ");
        } else {
          console.error("Lỗi kết nối Backend:", err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  if (loading) return <div className="p-8">Đang tải dữ liệu quản trị...</div>;

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border mt-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hệ thống Quản trị Tour</h2>
          <p className="text-sm text-gray-400">Quản lý danh sách tour hiện có trong hệ thống</p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-green-100">
          <Plus size={20}/> Thêm mới (POST)
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-400 uppercase text-xs tracking-widest">
              <th className="pb-4 pl-4">Tên Tour</th>
              <th className="pb-4">Giá</th>
              <th className="pb-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {tours.length > 0 ? (
              tours.map((t: any) => (
                <tr key={t.id} className="border-b hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 pl-4 font-semibold text-gray-700">{t.name}</td>
                  <td className="py-5 text-blue-600 font-bold">{t.price?.toLocaleString()}đ</td>
                  <td className="py-5">
                    <div className="flex justify-center gap-3">
                      <button title="Sửa" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={18}/>
                      </button>
                      <button title="Xóa" className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-10 text-gray-400 italic">
                  Chưa có dữ liệu tour nào để hiển thị.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;