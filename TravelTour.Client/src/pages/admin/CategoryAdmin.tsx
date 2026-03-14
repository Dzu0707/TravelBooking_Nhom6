import { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryAdmin = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const token = localStorage.getItem('token');
  const API_URL = "http://localhost:5091/api/Categories";

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
    } catch (err) { console.error("Lỗi load data", err); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Demo Mục 3: Gửi data xuống SQL Server qua API
      await axios.post(API_URL, { name, description }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Tích hợp thành công! Đã lưu vào SQL Server.");
      setName(''); setDescription('');
      fetchCategories();
    } catch (err: any) {
      // Demo Mục 4: Hiển thị lỗi Validation từ Backend (ví dụ 400 Bad Request)
      alert("❌ Lỗi Validation: " + (err.response?.data || "Dữ liệu không hợp lệ"));
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-gray-800 mb-8">Quản lý <span className="text-blue-600">Danh mục</span></h1>
        
        {/* Form Thêm (Mục 3 Integration) */}
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              className="border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tên danh mục mới..."
              value={name} onChange={e => setName(e.target.value)}
            />
            <input 
              className="border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mô tả..."
              value={description} onChange={e => setDescription(e.target.value)}
            />
          </div>
          <button className="mt-4 w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all">
            Lưu vào Hệ thống (SQL Server)
          </button>
        </form>

        {/* Danh sách (Kết quả Integration) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-bold text-gray-600">ID</th>
                <th className="p-4 font-bold text-gray-600">Tên Danh Mục</th>
                <th className="p-4 font-bold text-gray-600">Mô tả</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id} className="border-b hover:bg-blue-50 transition-colors">
                  <td className="p-4 text-gray-500">#{c.id}</td>
                  <td className="p-4 font-semibold">{c.name}</td>
                  <td className="p-4 text-gray-600">{c.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryAdmin;