import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import axios from 'axios';
import { 
  Star, Search, CheckCircle, XCircle, 
  Trash2, User, Quote, MessageSquare, Loader2
} from 'lucide-react';

import { 
  Card, Table, TableHead, TableRow, TableHeaderCell, 
  TableBody, TableCell, Text, Flex, 
  Grid, Metric
} from '@tremor/react';

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  // Giả sử backend của bạn chưa có trường status, 
  // chúng ta có thể ẩn/hiện dựa trên logic riêng hoặc bổ sung sau.
}

const API_BASE_URL = "http://localhost:5091";

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Lấy toàn bộ danh sách đánh giá từ Backend
  const fetchAllReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
      toast.error("Không thể tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  // 2. Xóa vĩnh viễn đánh giá
  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn đánh giá này?")) return;
    
    const token = localStorage.getItem('token');
    const loadId = toast.loading("Đang xử lý xóa...");
    
    try {
      await axios.delete(`${API_BASE_URL}/api/Reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Đã xóa đánh giá thành công", { id: loadId });
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      toast.error("Lỗi: Bạn không có quyền hoặc server gặp sự cố", { id: loadId });
    }
  };

  const renderStars = (count: number) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={10} 
          fill={i < count ? "#EAB308" : "none"} 
          className={i < count ? "text-yellow-500" : "text-slate-700"} 
        />
      ))}
    </div>
  );

  // Lọc dữ liệu theo tìm kiếm
  const filteredReviews = reviews.filter(r => 
    r.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính toán chỉ số thống kê thực tế
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4 pt-6 animate-in fade-in duration-500">
      
      {/* STATS */}
      <Grid numItemsMd={2} numItemsLg={3} className="gap-4">
        <Card className="bg-slate-900 border-slate-800 p-4 rounded-xl">
          <Text className="text-[10px] text-slate-500 font-bold uppercase">Xếp hạng trung bình</Text>
          <Flex justifyContent="start" alignItems="baseline" className="gap-2 mt-1">
            <Metric className="text-white font-black text-xl">{avgRating}</Metric>
            <div className="flex mb-1">{renderStars(Math.round(Number(avgRating)))}</div>
          </Flex>
          <Text className="text-[9px] text-emerald-500 font-bold mt-2 italic uppercase tracking-tighter">Dữ liệu từ {reviews.length} đánh giá</Text>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-4 rounded-xl border-l-4 border-l-amber-500">
          <Text className="text-[10px] text-slate-500 font-bold uppercase">Tổng phản hồi</Text>
          <Metric className="text-amber-500 font-black text-xl mt-1">{reviews.length}</Metric>
          <Text className="text-[9px] text-slate-600 font-bold mt-2 uppercase italic tracking-tighter">Cập nhật thời gian thực</Text>
        </Card>

        <Card className="bg-blue-600 border-none p-4 rounded-xl flex flex-col justify-between shadow-lg">
          <Text className="text-blue-100 font-bold uppercase text-[10px]">Trạng thái hệ thống</Text>
          <Text className="text-white text-[12px] font-black uppercase mt-2 flex items-center gap-2">
            <MessageSquare size={14}/> Sẵn sàng quản lý dữ liệu
          </Text>
          <div className="mt-2 size-7 rounded-full bg-blue-400 flex items-center justify-center text-[10px] text-blue-900 font-black">
            <CheckCircle size={16}/>
          </div>
        </Card>
      </Grid>

      {/* FILTER BAR */}
      <Card className="bg-slate-900 border-slate-800 rounded-xl p-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={15} />
            <input 
              type="text"
              placeholder="Tìm khách hàng hoặc nội dung đánh giá..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-[11px] text-slate-200 outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>
      </Card>

      {/* TABLE */}
      <Card className="bg-slate-900 border-slate-800 rounded-xl p-0 overflow-hidden shadow-2xl">
        <Table>
          <TableHead className="bg-slate-950/60">
            <TableRow>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 p-5">Người dùng</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500">Đánh giá nội dung</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 text-right">Thao tác</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReviews.map((r) => (
              <TableRow key={r.id} className="hover:bg-slate-800/40 transition-colors border-b border-slate-800/50 group">
                <TableCell className="p-4">
                  <Flex justifyContent="start" className="gap-3">
                    <div className="size-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-500 shrink-0">
                      <User size={18} />
                    </div>
                    <div>
                      <Text className="font-bold text-slate-100 text-[11px] uppercase leading-tight">{r.userName || "Ẩn danh"}</Text>
                      <Text className="text-[9px] text-slate-500 font-medium mt-0.5 tracking-tighter">
                        ID: #{r.id}
                      </Text>
                    </div>
                  </Flex>
                </TableCell>
                
                <TableCell className="max-w-md">
                  <div className="flex gap-2">
                    <Quote size={10} className="text-slate-700 shrink-0 mt-1"/>
                    <div>
                      <Text className="text-[11px] text-slate-300 italic line-clamp-2 leading-relaxed">"{r.comment}"</Text>
                      <div className="flex items-center gap-3 mt-2">
                        {renderStars(r.rating)}
                        <Text className="text-[9px] text-slate-600 font-bold uppercase">
                          {r.createdAt ? format(new Date(r.createdAt), 'dd/MM/yyyy HH:mm') : '---'}
                        </Text>
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-right p-4">
                  <Flex justifyContent="end" className="gap-2">
                    <button 
                      className="p-2 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all" 
                      title="Duyệt nhanh"
                    >
                      <CheckCircle size={18}/>
                    </button>
                    <button 
                      className="p-2 text-slate-500 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all" 
                      title="Gắn cờ"
                    >
                      <XCircle size={18}/>
                    </button>
                    <button 
                      onClick={() => handleDelete(r.id)} 
                      className="p-2 text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all" 
                      title="Xóa vĩnh viễn"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredReviews.length === 0 && (
          <div className="p-16 text-center text-slate-500 font-bold uppercase text-[10px] tracking-widest opacity-40">
            Không có dữ liệu đánh giá
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminReviews;