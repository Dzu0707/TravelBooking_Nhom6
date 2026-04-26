const NewsCard = ({ news }: { news: any }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
    <img src={news.imageUrl} alt={news.title} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="font-black text-gray-800 text-lg mb-2 line-clamp-2">{news.title}</h3>
      <p className="text-gray-500 text-sm mb-4 line-clamp-3">{news.shortDescription}</p>
      <button className="text-blue-600 font-bold text-sm hover:underline">Đọc thêm →</button>
    </div>
  </div>
);
export default NewsCard;