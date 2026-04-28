import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  Ticket,
  Search,
  X,
  Trash2,
  Copy,
  Pencil,
  Plus,
  ShieldCheck,
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
  Title,
  Flex,
  Grid,
  Metric,
  ProgressBar,
} from '@tremor/react';

const AdminVouchers = () => {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVoucher, setEditingVoucher] = useState<any | null>(null);

  const { register, handleSubmit, reset } = useForm<any>();
  const API_BASE_URL = 'http://localhost:5091/api/Vouchers';

  const fetchVouchers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVouchers(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      console.error('Lỗi lấy dữ liệu:', error);
      toast.error('Không thể kết nối đến máy chủ API');
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const getValue = (obj: any, key: string) => {
    if (!obj) return '';
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    return obj[key] !== undefined ? obj[key] : obj[capitalizedKey] || '';
  };

  const onSubmit = async (data: any) => {
    const loadId = toast.loading('Đang xử lý...');
    const token = localStorage.getItem('token');

    const payload: any = {
      Code: data.code.toUpperCase(),
      DiscountType: data.discountType,
      DiscountValue: Number(data.discountValue),
      Quantity: Number(data.quantity),
      ExpiryDate: new Date(data.expiryDate).toISOString(),
    };

    try {
      if (editingVoucher) {
        const id = getValue(editingVoucher, 'id');
        payload.Id = id;

        await axios.put(`${API_BASE_URL}/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Cập nhật thành công!', { id: loadId });
      } else {
        await axios.post(API_BASE_URL, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Đã lưu mã mới vào hệ thống!', { id: loadId });
      }

      fetchVouchers();
      setIsModalOpen(false);
      setEditingVoucher(null);
      reset();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Lỗi: Dữ liệu không hợp lệ!';
      toast.error(errorMsg, { id: loadId });
    }
  };

  const handleDeleteVoucher = async (voucher: any) => {
    const id = getValue(voucher, 'id');
    if (!window.confirm('Xóa vĩnh viễn mã này khỏi Database?')) return;

    const loadId = toast.loading('Đang xóa...');
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Đã xóa mã thành công', { id: loadId });
      fetchVouchers();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Không thể xóa mã này!';
      toast.error(errorMsg, { id: loadId });
    }
  };

  const handleOpenEdit = (voucher: any) => {
    setEditingVoucher(voucher);
    reset({
      code: getValue(voucher, 'code'),
      discountType: getValue(voucher, 'discountType'),
      discountValue: getValue(voucher, 'discountValue'),
      quantity: getValue(voucher, 'quantity'),
      expiryDate: getValue(voucher, 'expiryDate')?.split('T')[0],
    });
    setIsModalOpen(true);
  };

  const filteredVouchers = vouchers.filter((voucher) =>
    getValue(voucher, 'code')?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-xl border border-slate-800 bg-slate-900/95 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(2,6,23,0.45)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
              Voucher Management
            </div>
            <Title className="mt-2 flex items-center gap-2 text-lg font-black uppercase tracking-tight text-slate-100">
              Hệ thống Voucher <ShieldCheck size={20} className="text-cyan-400" />
            </Title>
            <Text className="mt-1 text-sm text-slate-400">
              Tạo, cập nhật và điều chỉnh mã giảm giá cho toàn bộ hệ thống.
            </Text>
          </div>

          <button
            onClick={() => {
              setEditingVoucher(null);
              reset({});
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300 transition-all hover:bg-cyan-500/15"
          >
            <Plus size={16} />
            Tạo mới
          </button>
        </div>
      </section>

      <Grid numItemsMd={2} numItemsLg={3} className="gap-4">
        <Card className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-none lg:col-span-2">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Tìm nhanh mã giảm giá..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-10 text-sm text-slate-200 outline-none transition-all focus:border-cyan-500/40"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition-colors hover:text-rose-400"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </Card>

        <Card className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-none">
          <Text className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Tổng số mã
          </Text>
          <Metric className="mt-2 text-2xl font-black text-slate-100">
            {vouchers.length} <span className="text-sm font-normal text-slate-500">Mã</span>
          </Metric>
          <ProgressBar value={100} color="cyan" className="mt-4 h-1.5" />
        </Card>
      </Grid>

      <Card className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-0 shadow-none">
        <Table>
          <TableHead className="bg-slate-950/60">
            <TableRow>
              <TableHeaderCell className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Mã định danh
              </TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Trạng thái
              </TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Ưu đãi
              </TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Số lượng
              </TableHeaderCell>
              <TableHeaderCell className="text-right text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Thao tác
              </TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredVouchers.map((voucher, index) => {
              const code = getValue(voucher, 'code');
              const type = getValue(voucher, 'discountType');
              const val = getValue(voucher, 'discountValue');
              const qty = getValue(voucher, 'quantity');
              const expiry = getValue(voucher, 'expiryDate');
              const id = getValue(voucher, 'id');

              const isExpired = new Date(expiry) < new Date();
              const isOutOfStock = qty <= 0;

              return (
                <TableRow
                  key={id || index}
                  className={`group border-b border-slate-800/50 transition-colors hover:bg-slate-800/30 ${
                    isExpired || isOutOfStock ? 'opacity-60' : ''
                  }`}
                >
                  <TableCell className="px-6 py-5">
                    <Flex justifyContent="start" className="gap-3">
                      <div
                        className={`flex size-10 items-center justify-center rounded-lg border ${
                          isExpired || isOutOfStock
                            ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                            : 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300'
                        }`}
                      >
                        <Ticket size={18} />
                      </div>

                      <Flex justifyContent="start" className="gap-2">
                        <Text className="text-sm font-black uppercase tracking-tight text-slate-100">
                          {code}
                        </Text>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(code);
                            toast.success('Đã copy!');
                          }}
                          className="text-slate-500 transition-colors hover:text-cyan-300"
                        >
                          <Copy size={12} />
                        </button>
                      </Flex>
                    </Flex>
                  </TableCell>

                  <TableCell>
                    {isExpired ? (
                      <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-rose-400">
                        Hết hạn
                      </span>
                    ) : isOutOfStock ? (
                      <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-amber-400">
                        Hết lượt
                      </span>
                    ) : (
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                        Hoạt động
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Text className="text-sm font-bold italic text-emerald-400">
                      {type?.toLowerCase().includes('percent')
                        ? `${val}%`
                        : `${val?.toLocaleString()}₫`}
                    </Text>
                  </TableCell>

                  <TableCell>
                    <Text
                      className={`text-sm font-medium ${
                        isOutOfStock ? 'text-rose-400' : 'text-slate-300'
                      }`}
                    >
                      {qty} lượt
                    </Text>
                  </TableCell>

                  <TableCell className="px-6 text-right">
                    <Flex justifyContent="end" className="gap-2">
                      <button
                        onClick={() => handleOpenEdit(voucher)}
                        className="rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-slate-400 transition-colors hover:text-cyan-300"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteVoucher(voucher)}
                        className="rounded-lg border border-rose-500/15 bg-rose-500/5 p-2.5 text-rose-300 transition-colors hover:bg-rose-500/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </Flex>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredVouchers.length === 0 && (
          <div className="p-16 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Không có voucher nào phù hợp
          </div>
        )}
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-5">
              <div>
                <Text className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-100">
                  {editingVoucher ? 'Hiệu chỉnh Voucher' : 'Tạo mới Voucher'}
                </Text>
                <Text className="mt-1 text-xs text-slate-500">
                  Cấu hình mã giảm giá và điều kiện sử dụng.
                </Text>
              </div>

              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingVoucher(null);
                }}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:text-rose-400"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Mã Voucher *
                  </label>
                  <input
                    {...register('code')}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-bold uppercase text-cyan-300 outline-none focus:border-cyan-500/40"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Hết hạn *
                  </label>
                  <input
                    {...register('expiryDate')}
                    type="date"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-500/40"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Loại giảm
                  </label>
                  <select
                    {...register('discountType')}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 text-sm text-slate-200 outline-none focus:border-cyan-500/40"
                  >
                    <option value="Percentage">Phần trăm (%)</option>
                    <option value="FixedAmount">Tiền mặt (₫)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Giá trị
                  </label>
                  <input
                    {...register('discountValue')}
                    type="number"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-bold text-emerald-400 outline-none focus:border-cyan-500/40"
                    required
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Số lượng tối đa
                  </label>
                  <input
                    {...register('quantity')}
                    type="number"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-500/40"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl border border-cyan-500/20 bg-cyan-500/10 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300 transition-all hover:bg-cyan-500/15"
              >
                {editingVoucher ? 'Cập nhật thay đổi' : 'Lưu vào hệ thống'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVouchers;
