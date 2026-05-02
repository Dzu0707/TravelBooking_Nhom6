import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  Star,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  User,
  Quote,
  MessageSquare,
  Loader2,
} from 'lucide-react';

import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  Flex,
  Grid,
  Metric,
  Title,
} from '@tremor/react';

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const API_BASE_URL = 'http://localhost:5091';

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Lỗi lấy dữ liệu:', error);
      toast.error('Không thể tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn đánh giá này?')) return;

    const token = localStorage.getItem('token');
    const loadId = toast.loading('Đang xử lý xóa...');

    try {
      await axios.delete(`${API_BASE_URL}/api/Reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Đã xóa đánh giá thành công', { id: loadId });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      toast.error('Lỗi: Bạn không có quyền hoặc server gặp sự cố', { id: loadId });
    }
  };

  const renderStars = (count: number) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={10}
          fill={i < count ? '#EAB308' : 'none'}
          className={i < count ? 'text-yellow-500' : 'text-slate-700'}
        />
      ))}
    </div>
  );

  const filteredReviews = reviews.filter(
    (review) =>
      review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
      : '0';

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-cyan-400" size={36} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-xl border border-slate-800 bg-slate-900/95 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(2,6,23,0.45)]">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
            Review Management
          </div>
          <Title className="mt-2 flex items-center gap-2 text-lg font-black uppercase tracking-tight text-slate-100">
            Quản lý đánh giá <MessageSquare size={20} className="text-cyan-400" />
          </Title>
          <Text className="mt-1 text-sm text-slate-400">
            Kiểm soát phản hồi từ người dùng và theo dõi chất lượng trải nghiệm tour.
          </Text>
        </div>
      </section>

      <Grid numItemsMd={2} numItemsLg={3} className="gap-4">
        <Card className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-none">
          <Text className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Xếp hạng trung bình
          </Text>
          <Flex justifyContent="start" alignItems="baseline" className="mt-2 gap-2">
            <Metric className="text-2xl font-black text-slate-100">{avgRating}</Metric>
            <div className="mb-1 flex">{renderStars(Math.round(Number(avgRating)))}</div>
          </Flex>
          <Text className="mt-2 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-400">
            Dữ liệu từ {reviews.length} đánh giá
          </Text>
        </Card>

        <Card className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-none">
          <Text className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Tổng phản hồi
          </Text>
          <Metric className="mt-2 text-2xl font-black text-amber-400">{reviews.length}</Metric>
          <Text className="mt-2 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
            Cập nhật thời gian thực
          </Text>
        </Card>

        <Card className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-5 shadow-none">
          <Text className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">
            Trạng thái hệ thống
          </Text>
          <Text className="mt-2 flex items-center gap-2 text-sm font-black uppercase text-white">
            <CheckCircle size={15} />
            Sẵn sàng quản lý dữ liệu
          </Text>
        </Card>
      </Grid>

      <Card className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-none">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Tìm khách hàng hoặc nội dung đánh giá..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-sm text-slate-200 outline-none transition-all focus:border-cyan-500/40"
          />
        </div>
      </Card>

      <Card className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-0 shadow-none">
        <Table>
          <TableHead className="bg-slate-950/60">
            <TableRow>
              <TableHeaderCell className="p-5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Người dùng
              </TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Đánh giá nội dung
              </TableHeaderCell>
              <TableHeaderCell className="text-right text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Thao tác
              </TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow
                key={review.id}
                className="group border-b border-slate-800/50 transition-colors hover:bg-slate-800/30"
              >
                <TableCell className="p-5">
                  <Flex justifyContent="start" className="gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-500">
                      <User size={18} />
                    </div>

                    <div>
                      <Text className="text-[11px] font-bold uppercase leading-tight text-slate-100">
                        {review.userName || 'Ẩn danh'}
                      </Text>
                      <Text className="mt-1 text-[10px] font-medium text-slate-500">
                        ID: #{review.id}
                      </Text>
                    </div>
                  </Flex>
                </TableCell>

                <TableCell className="max-w-md p-5">
                  <div className="flex gap-2">
                    <Quote size={10} className="mt-1 shrink-0 text-slate-700" />
                    <div>
                      <Text className="line-clamp-2 text-sm italic leading-relaxed text-slate-300">
                        "{review.comment}"
                      </Text>
                      <div className="mt-2 flex items-center gap-3">
                        {renderStars(review.rating)}
                        <Text className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
                          {review.createdAt
                            ? format(new Date(review.createdAt), 'dd/MM/yyyy HH:mm')
                            : '---'}
                        </Text>
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="p-5 text-right">
                  <Flex justifyContent="end" className="gap-2">
                    <button
                      className="rounded-lg border border-emerald-500/15 bg-emerald-500/5 p-2.5 text-emerald-300 transition-colors hover:bg-emerald-500/10"
                      title="Duyệt nhanh"
                    >
                      <CheckCircle size={16} />
                    </button>

                    <button
                      className="rounded-lg border border-amber-500/15 bg-amber-500/5 p-2.5 text-amber-300 transition-colors hover:bg-amber-500/10"
                      title="Gắn cờ"
                    >
                      <XCircle size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(review.id)}
                      className="rounded-lg border border-rose-500/15 bg-rose-500/5 p-2.5 text-rose-300 transition-colors hover:bg-rose-500/10"
                      title="Xóa vĩnh viễn"
                    >
                      <Trash2 size={16} />
                    </button>
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredReviews.length === 0 && (
          <div className="p-16 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Không có dữ liệu đánh giá
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminReviews;
