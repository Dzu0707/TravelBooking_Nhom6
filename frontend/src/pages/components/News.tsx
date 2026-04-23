import { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const News = () => {
  // 1. Khai báo các State quản lý dữ liệu và tìm kiếm
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const API_BASE_URL = "http://localhost:5091";

  // Hàm xử lý ảnh chuẩn từ Backend
  const getImgUrl = (path: any) => {
    if (!path) return "https://placehold.co/800x600?text=No+Image";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  // 2. Gọi API lấy dữ liệu thực tế
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/News`);
        // Đảo ngược mảng để bài mới nhất lên đầu (nếu Backend chưa sort)
        setNewsList(response.data);
      } catch (error) {
        console.error("Lỗi lấy danh sách tin tức:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    window.scrollTo(0, 0);
  }, []);

  // 3. Logic lọc dữ liệu theo thanh tìm kiếm
  const filteredNews = newsList.filter((news) => {
    const titleMatch = news.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = news.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || categoryMatch;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* HEADER TRANG TIN TỨC */}
      <div className="bg-white pt-32 pb-16 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic">
            Travel <span className="text-blue-600 font-normal">Insights</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-2xl mx-auto">
            Nơi chia sẻ những câu chuyện truyền cảm hứng, kinh nghiệm du lịch thực tế và cập nhật xu hướng mới nhất.
          </p>
          
          {/* Thanh tìm kiếm nhanh (Đã kết nối dữ liệu) */}
          <div className="mt-10 max-w-md mx-auto relative group">
            <input 
              type="text" 
              placeholder="Tìm kiếm bài viết, chủ đề..."
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 ring-blue-500/20 focus:border-blue-500 font-medium shadow-inner transition-all text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          </div>
        </div>
      </div>

      {/* DANH SÁCH BÀI VIẾT */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {filteredNews.map((news) => (
              <Link 
                to={`/news/${news.id}`} 
                key={news.id}
                className="group bg-white rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-50"
              >
                {/* Ảnh bên trái */}
                <div className="lg:w-2/5 h-64 lg:h-auto overflow-hidden relative">
                  <img 
                    src={getImgUrl(news.imageUrl)} 
                    alt={news.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-slate-100"
                    onError={(e: any) => { e.target.src = 'https://placehold.co/800x600?text=No+Image' }}
                  />
                </div>

                {/* Nội dung bên phải */}
                <div className="lg:w-3/5 p-8 flex flex-col justify-between">
                  <div>
                    <span className="inline-block text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                      {news.category || "Tin tức"}
                    </span>
                    <h2 className="text-xl font-black text-gray-900 mt-4 mb-3 group-hover:text-blue-600 transition-colors leading-tight uppercase line-clamp-2">
                      {news.title}
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 font-medium">
                      {news.summary || "Khám phá chi tiết hành trình và những kinh nghiệm quý báu được chia sẻ trong bài viết này."}
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-dashed border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                      <span className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(news.createdAt).toLocaleDateString('vi-VN')}</span>
                      <span className="flex items-center gap-1.5"><User size={14}/> {news.author || "Admin"}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-blue-600 transition-colors shadow-md">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-slate-100">
             <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest italic mb-2">Không tìm thấy bài viết</h3>
             <p className="text-slate-500">Chưa có bài viết nào khớp với từ khóa "{searchTerm}"</p>
             <button onClick={() => setSearchTerm("")} className="mt-4 text-blue-600 font-bold hover:underline text-sm uppercase tracking-widest">
               Xóa tìm kiếm
             </button>
          </div>
        )}

        {/* PHÂN TRANG (UI) - Chỉ hiển thị nếu có dữ liệu */}
        {filteredNews.length > 0 && (
            <div className="mt-20 flex justify-center gap-2">
            <button className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black shadow-lg shadow-blue-200">1</button>
            <button className="w-12 h-12 rounded-2xl bg-white text-gray-400 font-black hover:bg-blue-50 hover:text-blue-600 transition-all border border-gray-100 shadow-sm">2</button>
            <button className="w-12 h-12 rounded-2xl bg-white text-gray-400 font-black hover:bg-blue-50 hover:text-blue-600 transition-all border border-gray-100 shadow-sm">3</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default News;