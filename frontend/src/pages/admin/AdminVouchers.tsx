import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { 
  Ticket, Search, X, Trash2, Copy, 
  Pencil, Plus, ShieldCheck
} from 'lucide-react';

import { 
  Card, Table, TableHead, TableRow, TableHeaderCell, 
  TableBody, TableCell, Text, Title, Flex, 
  Grid, Metric, ProgressBar
} from '@tremor/react';

const AdminVouchers = () => {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVoucher, setEditingVoucher] = useState<any | null>(null);

  const { register, handleSubmit, reset } = useForm<any>();
  const API_BASE_URL = "http://localhost:5091/api/Vouchers"; 

  // --- LẤY DANH SÁCH VOUCHER ---
  const fetchVouchers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVouchers(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      console.error("Lỗi lấy dữ liệu:", error);
      toast.error("Không thể kết nối đến máy chủ API");
    }
  };

  useEffect(() => { fetchVouchers(); }, []);

  // Helper để lấy giá trị không phân biệt hoa thường từ API
  const getValue = (obj: any, key: string) => {
    if (!obj) return '';
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    return obj[key] !== undefined ? obj[key] : (obj[capitalizedKey] || '');
  };

  // --- HÀM XỬ LÝ SUBMIT (TẠO MỚI & CẬP NHẬT) ---
  const onSubmit = async (data: any) => {
    const loadId = toast.loading("Đang xử lý...");
    const token = localStorage.getItem('token');
    
    // Payload khớp chính xác với Class Voucher ở Backend (PascalCase)
    const payload: any = {
      Code: data.code.toUpperCase(),
      DiscountType: data.discountType,
      DiscountValue: Number(data.discountValue),
      Quantity: Number(data.quantity),
      ExpiryDate: new Date(data.expiryDate).toISOString() // Chuyển về ISO chuẩn cho .NET
    };

    try {
      if (editingVoucher) {
        const id = getValue(editingVoucher, 'id');
        payload.Id = id; // Gửi kèm Id trong body cho hàm Update

        await axios.put(`${API_BASE_URL}/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Cập nhật thành công!", { id: loadId });
      } else {
        await axios.post(API_BASE_URL, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Đã lưu mã mới vào hệ thống!", { id: loadId });
      }
      
      fetchVouchers();
      setIsModalOpen(false);
      setEditingVoucher(null);
      reset();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Lỗi: Dữ liệu không hợp lệ!";
      toast.error(errorMsg, { id: loadId });
    }
  };

  // --- HÀM XÓA ---
  const handleDeleteVoucher = async (v: any) => {
    const id = getValue(v, 'id');
    if (!window.confirm("Xóa vĩnh viễn mã này khỏi Database?")) return;

    const loadId = toast.loading("Đang xóa...");
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Đã xóa mã thành công", { id: loadId });
      fetchVouchers(); 
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Không thể xóa mã này!";
      toast.error(errorMsg, { id: loadId });
    }
  };

  const handleOpenEdit = (v: any) => {
    setEditingVoucher(v);
    reset({
      code: getValue(v, 'code'),
      discountType: getValue(v, 'discountType'),
      discountValue: getValue(v, 'discountValue'),
      quantity: getValue(v, 'quantity'),
      expiryDate: getValue(v, 'expiryDate')?.split('T')[0] // Format YYYY-MM-DD cho input date
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-full px-6 py-6 font-sans min-h-screen bg-[#020617]">
      {/* HEADER & STATISTICS */}
      <Grid numItemsMd={2} numItemsLg={3} className="gap-4">
        <Card className="bg-[#0f172a] border-slate-800 p-6 rounded-2xl lg:col-span-2">
          <Flex justifyContent="between">
            <div>
              <Title className="text-white font-black uppercase flex items-center gap-2 tracking-tighter">
                Hệ thống Voucher <ShieldCheck size={20} className="text-indigo-500" />
              </Title>
              <Text className="text-[11px] text-slate-500 italic mt-1">Quản trị viên: Cập nhật và điều chỉnh mã giảm giá</Text>
            </div>
            <button 
              onClick={() => { setEditingVoucher(null); reset({}); setIsModalOpen(true); }} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase transition-all shadow-lg flex items-center gap-2"
            >
              <Plus size={16}/> Tạo mới
            </button>
          </Flex>
          <div className="mt-6 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Tìm nhanh mã giảm giá..." 
              className="w-full bg-[#1e293b] border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-200 focus:border-indigo-500 outline-none transition-all" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </Card>

        <Card className="bg-[#0f172a] border-slate-800 p-6 rounded-2xl flex flex-col justify-center">
          <Text className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Tổng số mã</Text>
          <Metric className="text-white font-black text-3xl mt-2">{vouchers.length} <span className="text-sm font-normal text-slate-500">Mã</span></Metric>
          <ProgressBar value={100} color="indigo" className="mt-4 h-1.5" />
        </Card>
      </Grid>

      {/* DATA TABLE */}
      <Card className="bg-[#0f172a] border-slate-800 rounded-2xl p-0 overflow-hidden shadow-2xl mt-6">
        <Table>
          <TableHead className="bg-slate-900/50">
            <TableRow>
              <TableHeaderCell className="text-[11px] font-black uppercase text-slate-500 px-6 py-4">Mã định danh</TableHeaderCell>
              <TableHeaderCell className="text-[11px] font-black uppercase text-slate-500">Trạng thái</TableHeaderCell>
              <TableHeaderCell className="text-[11px] font-black uppercase text-slate-500">Ưu đãi</TableHeaderCell>
              <TableHeaderCell className="text-[11px] font-black uppercase text-slate-500">Số lượng</TableHeaderCell>
              <TableHeaderCell className="text-[11px] font-black uppercase text-slate-500 text-right">Thao tác</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vouchers.filter(v => getValue(v, 'code')?.toLowerCase().includes(searchTerm.toLowerCase())).map((v, index) => {
              const code = getValue(v, 'code');
              const type = getValue(v, 'discountType');
              const val = getValue(v, 'discountValue');
              const qty = getValue(v, 'quantity');
              const expiry = getValue(v, 'expiryDate');
              const id = getValue(v, 'id');

              const isExpired = new Date(expiry) < new Date();
              const isOutOfStock = qty <= 0;

              return (
                <TableRow key={id || index} className={`hover:bg-slate-800/30 transition-colors border-b border-slate-800/50 group ${isExpired || isOutOfStock ? 'opacity-60' : ''}`}>
                  <TableCell className="px-6 py-4">
                    <Flex justifyContent="start" className="gap-3">
                      <div className={`size-10 rounded-xl flex items-center justify-center border shadow-inner ${isExpired || isOutOfStock ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'}`}>
                        <Ticket size={20} />
                      </div>
                      <Flex justifyContent="start" className="gap-2">
                         <Text className="font-black text-slate-100 uppercase text-sm tracking-tight">{code}</Text>
                         <button onClick={() => { navigator.clipboard.writeText(code); toast.success("Đã Copy!"); }} className="text-slate-600 hover:text-indigo-400">
                            <Copy size={12} />
                         </button>
                      </Flex>
                    </Flex>
                  </TableCell>

                  <TableCell>
                    {isExpired ? (
                      <span className="bg-rose-500/10 text-rose-500 text-[9px] px-2 py-1 rounded font-black uppercase border border-rose-500/20">Hết hạn</span>
                    ) : isOutOfStock ? (
                      <span className="bg-orange-500/10 text-orange-500 text-[9px] px-2 py-1 rounded font-black uppercase border border-orange-500/20">Hết lượt</span>
                    ) : (
                      <span className="bg-emerald-500/10 text-emerald-500 text-[9px] px-2 py-1 rounded font-black uppercase border border-emerald-500/20">Hoạt động</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Text className="font-black text-emerald-400 text-sm italic">
                      {type?.toLowerCase().includes('percent') ? `${val}%` : `${val?.toLocaleString()}₫`}
                    </Text>
                  </TableCell>
                  <TableCell>
                      <Text className={`font-bold text-xs ${isOutOfStock ? 'text-rose-400' : 'text-slate-300'}`}>{qty} lượt</Text>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <Flex justifyContent="end" className="gap-2">
                      <button onClick={() => handleOpenEdit(v)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"><Pencil size={18}/></button>
                      <button 
                        onClick={() => handleDeleteVoucher(v)} 
                        className="p-2 text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </Flex>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <Card className="bg-[#0f172a] border-slate-800 w-full max-w-lg p-0 rounded-[2rem] overflow-hidden shadow-3xl">
            <div className="bg-slate-900/50 px-8 py-6 border-b border-slate-800 flex justify-between items-center">
              <Text className="text-white font-black uppercase text-xs tracking-widest">{editingVoucher ? "Hiệu chỉnh" : "Tạo mới"} Voucher</Text>
              <button onClick={() => { setIsModalOpen(false); setEditingVoucher(null); }} className="text-slate-500 hover:text-rose-500 transition-colors p-2"><X size={24}/></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Mã Voucher *</label>
                  <input {...register('code')} className="w-full bg-[#1e293b] border border-slate-800 rounded-xl py-3 px-4 text-sm font-black text-indigo-400 uppercase outline-none focus:border-indigo-500" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Hết hạn *</label>
                  <input {...register('expiryDate')} type="date" className="w-full bg-[#1e293b] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-indigo-500" required />
                </div>
              </div>

              <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800 grid grid-cols-2 gap-x-6 gap-y-5 shadow-inner">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Loại giảm</label>
                  <select {...register('discountType')} className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-3 text-sm text-white outline-none">
                    <option value="Percentage">Phần trăm (%)</option>
                    <option value="FixedAmount">Tiền mặt (₫)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Giá trị</label>
                  <input {...register('discountValue')} type="number" className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-sm text-orange-500 font-black outline-none" required />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Số lượng tối đa</label>
                  <input {...register('quantity')} type="number" className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-indigo-500" required />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl mt-4">
                {editingVoucher ? "Cập nhật thay đổi" : "Lưu vào hệ thống"}
              </button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminVouchers;