import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Profile = () => {
  // 1. Lấy dữ liệu thật từ localStorage (nếu có) hoặc dùng dữ liệu mẫu
  const [user, setUser] = useState({
    name: localStorage.getItem('fullName') || 'Lâm Thọ Toàn',
    role: localStorage.getItem('role') === '1' || localStorage.getItem('role') === 'Admin' ? 'Quản trị viên' : 'Khách hàng',
    email: localStorage.getItem('email') || '',
    phone: localStorage.getItem('phone') || '0901 234 567',
    address: localStorage.getItem('address') || 'Hồ Chí Minh, Việt Nam',
    joinDate: 'Tháng 04, 2026',
    avatarLetter: (localStorage.getItem('fullName') || 'Lâm Thọ Toàn').charAt(0).toUpperCase()
  });

  // 2. State điều khiển Modal Edit và dữ liệu Form
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  // Mở Modal và copy dữ liệu hiện tại vào Form
  const handleOpenEdit = () => {
    setFormData(user);
    setIsEditing(true);
  };

  // Xử lý khi gõ vào input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý khi bấm Lưu
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate cơ bản
    if (!formData.name.trim()) {
      toast.error('Tên không được để trống!');
      return;
    }

    // Tạo avatar letter mới từ chữ cái đầu của tên mới
    const updatedUser = {
      ...formData,
      avatarLetter: formData.name.trim().charAt(0).toUpperCase()
    };

    // 1. Cập nhật UI ngay lập tức
    setUser(updatedUser); 
    setIsEditing(false); // Đóng modal
    
    // 2. LƯU VÀO LOCAL STORAGE để F5 không bị mất và Navbar có thể lấy được
    localStorage.setItem('fullName', formData.name);
    localStorage.setItem('phone', formData.phone);
    localStorage.setItem('email', formData.email);
    localStorage.setItem('address', formData.address);

    toast.success('Cập nhật hồ sơ thành công!');

    // 3. Đợi 1.5s cho thông báo hiện xong rồi tự động reload trang để Navbar cập nhật tên mới
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
      {/* --- PHẦN BANNER & HEADER --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="h-40 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
        
        <div className="px-8 pb-8 relative flex justify-between items-end">
          <div className="flex items-end gap-6">
            {/* Avatar */}
            <div className="-mt-16 w-32 h-32 bg-blue-50 border-4 border-white rounded-2xl shadow-md flex items-center justify-center text-blue-600 text-5xl font-black uppercase">
              {user.avatarLetter}
            </div>
            
            {/* Tên & Role */}
            <div className="pb-2">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                {user.name}
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              </h1>
              <p className="text-gray-500 font-medium uppercase tracking-wider text-sm mt-1">{user.role}</p>
            </div>
          </div>

          {/* Nút Edit */}
          <button 
            onClick={handleOpenEdit}
            className="mb-2 px-6 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-sm"
          >
            Chỉnh sửa hồ sơ
          </button>
        </div>
      </div>

      {/* --- PHẦN NỘI DUNG (THÔNG TIN & HOẠT ĐỘNG) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Cột trái: Thông tin liên hệ */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-800 uppercase">Thông tin liên hệ</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email liên lạc</p>
                <p className="font-medium text-gray-800">{user.email || 'Chưa cập nhật'}</p>
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Số điện thoại</p>
                <p className="font-medium text-gray-800">{user.phone || 'Chưa cập nhật'}</p>
              </div>
            </div>

            {/* Địa chỉ */}
            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors col-span-1 sm:col-span-2">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Địa chỉ hiện tại</p>
                <p className="font-medium text-gray-800">{user.address || 'Chưa cập nhật'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Hoạt động & Cột mốc */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-800 uppercase mb-6">Hoạt động</h2>
          
          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-200 flex items-center gap-4 mb-8">
            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <div>
              <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Gia nhập</p>
              <p className="font-bold text-xl">{user.joinDate}</p>
            </div>
          </div>

          <h3 className="font-bold text-gray-800 mb-4">Lịch sử chuyến đi</h3>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400">
            Bạn chưa có chuyến đi nào cùng TravelGo.
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/*             MODAL CHỈNH SỬA HỒ SƠ          */}
      {/* ========================================== */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Cập nhật hồ sơ</h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Modal Body (Form) */}
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và Tên <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                  placeholder="Nhập họ tên của bạn"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                    placeholder="VD: 0901..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                  placeholder="Nhập địa chỉ hiện tại"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;