import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://localhost:5091";

  // Hàm chuẩn hóa link ảnh từ Backend
  const getImgUrl = (path: any) => {
    if (!path) return "https://placehold.co/1200x600?text=No+Image";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  // Gọi API lấy dữ liệu thật
  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        // Lấy toàn bộ danh sách tin tức đã duyệt (API GetNews)
        const response = await axios.get(`${API_BASE_URL}/api/News`);
        
        // Tìm bài viết có ID khớp với ID trên thanh địa chỉ
        const foundArticle = response.data.find((item: any) => item.id.toString() === id);
        
        setArticle(foundArticle);
      } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        fetchNewsDetail();
        window.scrollTo(0, 0); // Tự động cuộn lên đầu trang khi vào bài
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <h2 className="text-2xl font-bold text-gray-500 uppercase tracking-widest">Bài viết không tồn tại</h2>
        <Link to="/news" className="text-blue-600 font-bold hover:underline">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24 pt-10">
      <div className="max-w-4xl mx-auto px-6">
        {/* Nút quay lại */}
        <Link to="/news" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors mb-8 text-sm uppercase tracking-widest">
          <ArrowLeft size={18} />
          <span>QUAY LẠI DANH SÁCH</span>
        </Link>

        {/* Header bài viết */}
        <div className="mb-10 text-center">
          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full uppercase tracking-widest border border-blue-100">
            {article.category || "Tin tức"}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-8 mb-6 leading-tight uppercase italic tracking-tighter">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm font-bold text-gray-400 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <Calendar size={16} /> {new Date(article.createdAt).toLocaleDateString('vi-VN')}
            </span>
            <span className="flex items-center gap-2">
              <User size={16} /> {article.author || "Admin"}
            </span>
          </div>
        </div>

        {/* Ảnh Thumbnail bài viết */}
        <div className="w-full h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-xl mb-12 border-8 border-white bg-slate-200">
          <img 
            src={getImgUrl(article.imageUrl)} 
            alt={article.title} 
            className="w-full h-full object-cover"
            onError={(e: any) => { e.target.src = 'https://placehold.co/1200x600?text=Hình+Ảnh+Bài+Viết' }}
          />
        </div>

        {/* Nội dung bài viết */}
        <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-sm border border-gray-100 text-lg text-gray-700 leading-relaxed font-medium">
          
          {/* Nếu có tóm tắt (Summary) thì in nghiêng nổi bật ở đầu bài */}
          {article.summary && (
            <p className="text-xl text-slate-500 font-semibold italic leading-relaxed border-l-4 border-blue-500 pl-6 mb-8">
               "{article.summary}"
            </p>
          )}

          {/* Dùng whitespace-pre-line để React tự động hiểu các ký tự xuống dòng (\n) mà Admin đã nhập */}
          <div className="whitespace-pre-line">
            {article.content || "Nội dung bài viết đang được cập nhật..."}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;