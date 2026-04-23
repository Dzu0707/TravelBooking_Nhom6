import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Profile = () => {
  // 1. Khởi tạo State lấy dữ liệu từ localStorage
  const [user, setUser] = useState(() => {
    const fullName = localStorage.getItem('fullName') || 'Thành viên';
    return {
      name: fullName,
      role: localStorage.getItem('role') === '1' || localStorage.getItem('role') === 'Admin' ? 'Quản trị viên' : 'Khách hàng',
      email: localStorage.getItem('email') || 'chưa cập nhật',
      phone: localStorage.getItem('phone') || 'chưa cập nhật', // Đảm bảo key 'phone' khớp localStorage
      address: localStorage.getItem('address') || 'chưa cập nhật',
      joinDate: 'Tháng 04, 2026',
      avatarLetter: fullName.trim().charAt(0).toUpperCase() || 'T'
    };
  });

  // 2. State điều khiển Modal và dữ liệu Form tạm thời
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    newPassword: '' 
  });

  // Đồng bộ formData khi mở modal
  useEffect(() => {
    if (isEditing) {
      setFormData({ 
        name: user.name,
        phone: user.phone === 'chưa cập nhật' ? '' : user.phone,
        email: user.email === 'chưa cập nhật' ? '' : user.email,
        address: user.address === 'chưa cập nhật' ? '' : user.address,
        newPassword: '' 
      });
    }
  }, [isEditing, user]);

  // 3. Xử lý khi người dùng nhập liệu
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 4. Xử lý lưu thông tin
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation cơ bản
    if (!formData.name.trim()) {
      toast.error('Tên không được để trống!');
      return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      toast.error('Số điện thoại phải là số (10-11 chữ số)!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5091/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          newPassword: formData.newPassword 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Lỗi khi cập nhật từ server');
        return; 
      }

      // Cập nhật State cục bộ
      const updatedUser = {
        ...user,
        name: formData.name.trim(),
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        avatarLetter: formData.name.trim().charAt(0).toUpperCase()
      };

      setUser(updatedUser); 
      setIsEditing(false);
      
      // FIX LỖI CHÍNH TẢ: Đã đổi setIlem -> setItem
      localStorage.setItem('fullName', updatedUser.name);
      localStorage.setItem('phone', updatedUser.phone);
      localStorage.setItem('email', updatedUser.email);
      localStorage.setItem('address', updatedUser.address);

      toast.success('Cập nhật hồ sơ thành công!');
      
      // Tải lại nhẹ để cập nhật Header/Navbar
      setTimeout(() => {
        window.location.reload();
      }, 800);

    } catch (error) {
      toast.error('Có lỗi xảy ra khi kết nối máy chủ!');
      console.error(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 animate-fadeIn">
      {/* --- BANNER & AVATAR --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8 transition-all hover:shadow-md">
        <div className="h-44 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400"></div>
        <div className="px-8 pb-8 relative flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="-mt-16 w-32 h-32 bg-blue-50 border-4 border-white rounded-3xl shadow-xl flex items-center justify-center text-blue-600 text-5xl font-black uppercase select-none">
              {user.avatarLetter}
            </div>
            <div className="pb-2 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center md:justify-start gap-2">
                {user.name}
                <span className="bg-green-100 text-green-600 p-1.5 rounded-full shadow-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
                  </svg>
                </span>
              </h1>
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs mt-1">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsEditing(true)} 
            className="mb-2 px-8 py-3 bg-white border-2 border-gray-100 rounded-2xl font-black text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95 shadow-sm text-sm"
          >
            CHỈNH SỬA HỒ SƠ
          </button>
        </div>
      </div>

      {/* --- CHI TIẾT --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-black text-gray-800 uppercase mb-8 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div> Thông tin cá nhân
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Địa chỉ Email</p>
              <p className="font-bold text-gray-700 break-all">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Số điện thoại</p>
              <p className="font-bold text-gray-700">{user.phone}</p>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Địa chỉ thường trú</p>
              <p className="font-bold text-gray-700">{user.address}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col justify-between">
          <div>
            <p className="text-xs font-black text-gray-400 mb-6 uppercase tracking-widest">Tài khoản & Hệ thống</p>
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                <span className="text-gray-400 text-sm font-bold">Ngày gia nhập</span>
                <span className="font-black text-gray-700">{user.joinDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm font-bold">Trạng thái</span>
                <span className="text-emerald-500 font-black bg-emerald-50 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider shadow-inner">
                  Đang hoạt động
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
             <p className="text-blue-600 text-[10px] font-black uppercase tracking-tighter text-center">
               Mọi thông tin được bảo mật bởi TravelGo Architecture
             </p>
          </div>
        </div>
      </div>

      {/* --- MODAL --- */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-2xl font-black text-gray-800">Cập nhật hồ sơ</h3>
              </div>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-red-500 p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Họ và Tên</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Số điện thoại</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Địa chỉ</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold" />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="block text-[10px] font-black text-blue-500 uppercase mb-2 ml-1">Mật khẩu mới (Tùy chọn)</label>
                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="Bỏ trống nếu không đổi..." className="w-full px-6 py-4 rounded-2xl bg-blue-50/50 border-2 border-transparent focus:border-blue-500 outline-none font-bold" />
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 font-black text-gray-400 uppercase text-xs">Hủy</button>
                <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all uppercase text-xs">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
