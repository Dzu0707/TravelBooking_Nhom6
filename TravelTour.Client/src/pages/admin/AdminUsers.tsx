import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const navigate = useNavigate();
  const title = "Quản lý Người dùng";

  return (
    <div className="p-8 text-purple-900">
      <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-purple-600 mb-4 font-bold">
        <ArrowLeft size={20}/> Quay lại
      </button>
      <h1 className="text-3xl font-black">{title}</h1>
      <div className="mt-10 p-20 border-4 border-dashed border-purple-100 rounded-3xl text-gray-300 text-center text-xl">
        Danh sách tài khoản khách hàng ở đây...
      </div>
    </div>
  );
};

export default AdminUsers;