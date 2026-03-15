import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Edit, Plus, RefreshCw, X } from 'lucide-react';

const AdminDashboard = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States cho Modal Thêm/Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    departureLocation: '',
    description: '',
    categoryId: 1
  });

  const API_URL = 'http://localhost:5091/api/AdminTours';
  const token = localStorage.getItem('token');

  const fetchTours = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTours(res.data);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTours(); }, []);

  // Mở modal để thêm hoặc sửa
  const openModal = (tour: any = null) => {
    if (tour) {
      setEditingId(tour.id);
      setFormData({
        name: tour.name,
        code: tour.code,
        departureLocation: tour.departureLocation,
        description: tour.description || '',
        categoryId: tour.categoryId || 1
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', code: '', departureLocation: '', description: '', categoryId: 1 });
    }
    setIsModalOpen(true);
  };

  // Xử lý gửi Form (Cả POST và PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Cập nhật (PUT)
        await axios.put(`${API_URL}/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Thêm mới (POST)
        await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsModalOpen(false);
      fetchTours();
      alert("Thao tác thành công!");
    } catch (err) {
      alert("Có lỗi xảy ra, vui lòng kiểm tra lại dữ liệu!");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tour này?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTours();
    } catch (err) {
      alert("Không thể xóa tour này!");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
       <RefreshCw className="animate-spin text-blue-600 mb-2" size={32} />
       <p className="text-gray-500">Đang tải dữ liệu...</p>
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl mt-10 max-w-7xl mx-auto relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Quản trị Tour</h2>
          <p className="text-sm text-gray-400">Danh sách các chuyến đi hiện có</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all"
        >
          <Plus size={20}/> Thêm mới Tour
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-400 uppercase text-xs font-black">
              <th className="pb-4 pl-6">Thông tin Tour</th>
              <th className="pb-4">Mã Code</th>
              <th className="pb-4">Khởi hành</th>
              <th className="pb-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((t: any) => (
              <tr key={t.id} className="bg-gray-50/50 hover:bg-white hover:shadow-md transition-all">
                <td className="py-5 pl-6 rounded-l-2xl border-y border-l">
                  <div className="font-bold text-gray-800">{t.name}</div>
                  <div className="text-xs text-blue-500">{t.categoryName}</div>
                </td>
                <td className="py-5 font-mono text-sm border-y text-gray-500">#{t.code}</td>
                <td className="py-5 font-medium border-y text-gray-600">{t.departureLocation}</td>
                <td className="py-5 rounded-r-2xl border-y border-r text-center">
                  <button onClick={() => openModal(t)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg mr-2"><Edit size={18}/></button>
                  <button onClick={() => handleDelete(t.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingId ? 'Cập nhật Tour' : 'Thêm Tour Mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                placeholder="Tên Tour" className="w-full p-3 rounded-xl border" required
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="Mã Code (Vd: HN01)" className="w-full p-3 rounded-xl border" required
                  value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})}
                />
                <input 
                  placeholder="Điểm khởi hành" className="w-full p-3 rounded-xl border" required
                  value={formData.departureLocation} onChange={e => setFormData({...formData, departureLocation: e.target.value})}
                />
              </div>
              <select 
                className="w-full p-3 rounded-xl border"
                value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: parseInt(e.target.value)})}
              >
                <option value={1}>Du lịch Biển</option>
                <option value={2}>Khám phá Núi</option>
                <option value={3}>Văn hóa - Lịch sử</option>
                <option value={4}>Tour Quốc tế</option>
              </select>
              <textarea 
                placeholder="Mô tả ngắn gọn" className="w-full p-3 rounded-xl border h-24"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              />
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg">
                {editingId ? 'Lưu thay đổi' : 'Xác nhận Thêm'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;