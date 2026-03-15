import { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryAdmin = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  // 1. Tối ưu Header: Luôn lấy token mới nhất mỗi khi gọi API
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const API_URL = "http://localhost:5091/api/Categories";

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL, getAuthHeader());
      setCategories(res.data);
    } catch (err: any) { 
        if(err.response?.status === 401) alert("Phiên đăng nhập hết hạn!");
        console.error("Lỗi load data", err); 
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!name) return alert("Vui lòng nhập tên danh mục");

    try {
      await axios.post(API_URL, { name, description }, getAuthHeader());
      alert("✅ Đã lưu vào SQL Server thành công!");
      setName(''); setDescription('');
      fetchCategories(); // Reload danh sách
    } catch (err: any) {
      alert("❌ Lỗi: " + (err.response?.data || "Dữ liệu không hợp lệ"));
    }
  };

  // 2. Thêm tính năng XÓA để demo nốt CRUD
  const handleDelete = async (id: number) => {
    if(!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader());
      fetchCategories();
    } catch (err) {
      alert("Không thể xóa danh mục đang có Tour!");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black text-gray-800">Quản lý <span className="text-blue-600">Danh mục</span></h1>
            <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold">Admin Panel</span>
        </div>
        
        {/* Form Thêm */}
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 transition-all hover:shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Tên danh mục</label>
                <input 
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="Ví dụ: Du lịch Biển..."
                value={name} onChange={e => setName(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Mô tả chi tiết</label>
                <input 
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="Mô tả ngắn gọn về danh mục..."
                value={description} onChange={e => setDescription(e.target.value)}
                />
            </div>
          </div>
          <button className="mt-6 w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            Lưu vào Hệ thống (SQL Server)
          </button>
        </form>

        {/* Danh sách */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-bold text-gray-600">ID</th>
                <th className="p-4 font-bold text-gray-600">Tên Danh Mục</th>
                <th className="p-4 font-bold text-gray-600">Mô tả</th>
                <th className="p-4 font-bold text-gray-600 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id} className="border-b hover:bg-blue-50/50 transition-colors">
                  <td className="p-4 text-gray-400 font-mono">#{c.id}</td>
                  <td className="p-4 font-bold text-gray-700">{c.name}</td>
                  <td className="p-4 text-gray-600 text-sm">{c.description || "N/A"}</td>
                  <td className="p-4 text-center">
                    <button 
                        onClick={() => handleDelete(c.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                        🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && (
            <div className="p-10 text-center text-gray-400 italic">Hiện chưa có danh mục nào trong SQL Server.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryAdmin;