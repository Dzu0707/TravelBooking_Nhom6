import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Plus,
  Pencil,
  Trash2,
  Clock,
  X,
  Loader2,
  Users,
  Baby,
  Check,
  CalendarDays,
  Hash,
  Info,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface AdminSchedulesProps {
  tourId?: number;
}

const AdminSchedules: React.FC<AdminSchedulesProps> = ({ tourId }) => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [tours, setTours] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const initialForm = {
    tourId: tourId || 0,
    departureDate: '',
    returnDate: '',
    adultPrice: 0,
    childPrice: 0,
    quota: 20,
    status: 'Available',
  };

  const [formData, setFormData] = useState(initialForm);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const url = tourId
        ? `http://localhost:5091/api/TourSchedules/by-tour/${tourId}`
        : 'http://localhost:5091/api/TourSchedules';

      const [resSchedules, resTours] = await Promise.all([
        axios.get(url, { headers }),
        !tourId
          ? axios.get('http://localhost:5091/api/Tours', { headers })
          : Promise.resolve({ data: [] }),
      ]);

      setSchedules(resSchedules.data);
      if (!tourId) setTours(resTours.data);

      if (!editingId) {
        setFormData((prev) => ({
          ...prev,
          tourId: tourId || resTours.data[0]?.id || 0,
        }));
      }
    } catch {
      toast.error('Không thể tải dữ liệu lịch trình');
    } finally {
      setLoading(false);
    }
  }, [tourId, editingId, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      ...initialForm,
      tourId: tourId || tours[0]?.id || 0,
    });
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      ...initialForm,
      tourId: tourId || tours[0]?.id || 0,
    });
    setIsModalOpen(true);
  };

  const handleNumberChange = (field: string, value: string) => {
    const rawValue = value.replace(/\D/g, '');
    const num = rawValue === '' ? 0 : Number(rawValue.slice(0, 10));
    setFormData((prev) => ({ ...prev, [field]: num }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadId = toast.loading(editingId ? 'Đang cập nhật lịch trình...' : 'Đang tạo lịch trình...');
    setSubmitting(true);

    try {
      const isEdit = !!editingId;
      const url = isEdit
        ? `http://localhost:5091/api/TourSchedules/${editingId}`
        : 'http://localhost:5091/api/TourSchedules';

      const payload = {
        ...formData,
        id: editingId || 0,
        adultPrice: Number(formData.adultPrice),
        childPrice: Number(formData.childPrice),
        quota: Number(formData.quota),
      };

      await axios({
        method: isEdit ? 'put' : 'post',
        url,
        data: payload,
        headers,
      });

      toast.success(isEdit ? 'Cập nhật thành công' : 'Thêm lịch mới thành công', {
        id: loadId,
      });
      closeModal();
      fetchData();
    } catch {
      toast.error('Dữ liệu không hợp lệ hoặc lỗi server', { id: loadId });
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id: number) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 p-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-200">
            Xác nhận xóa lịch này?
          </p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await axios.delete(`http://localhost:5091/api/TourSchedules/${id}`, { headers });
                  fetchData();
                  toast.success('Đã xóa lịch trình');
                } catch {
                  toast.error('Lỗi khi xóa');
                }
              }}
              className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-rose-300"
            >
              Xóa
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300"
            >
              Hủy
            </button>
          </div>
        </div>
      ),
      {
        style: {
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '14px',
        },
      }
    );
  };

  const filtered = schedules.filter((schedule) => {
    const searchLower = searchTerm.toLowerCase();
    const tourNameMatch = schedule.tourName?.toLowerCase().includes(searchLower);
    const dateStr = format(new Date(schedule.departureDate), 'dd/MM/yyyy');
    const dateMatch = dateStr.includes(searchTerm);

    return tourNameMatch || dateMatch;
  });

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-800 bg-slate-900/95 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(2,6,23,0.45)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <Clock size={20} />
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                Schedule Management
              </div>
              <h3 className="mt-2 text-lg font-black uppercase tracking-tight text-slate-100">
                Lịch khởi hành
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                {schedules.length} đợt khởi hành đang được quản lý
              </p>
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300 transition-all hover:bg-emerald-500/15"
          >
            <Plus size={16} />
            Thêm đợt mới
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Tìm theo tên tour hoặc ngày (dd/mm/yyyy)..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-10 pr-10 text-sm text-slate-200 outline-none transition-all focus:border-emerald-500/40"
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

        {!loading && (
          <span className="text-[11px] font-medium text-slate-500">
            Hiển thị {filtered.length} / {schedules.length} lịch trình
          </span>
        )}
      </section>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <table className="w-full text-left">
          <thead className="bg-slate-950/60">
            <tr className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              {!tourId && <th className="p-5">Tên Tour</th>}
              <th className="p-5">Ngày khởi hành</th>
              <th className="p-5 text-center">Chỗ trống</th>
              <th className="p-5 text-right">Giá Người Lớn</th>
              <th className="p-5 text-right">Giá Trẻ Em</th>
              <th className="p-5 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/50">
            {loading ? (
              <tr>
                <td colSpan={tourId ? 5 : 6} className="p-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-emerald-400" size={28} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Đang truy xuất lịch trình...
                    </span>
                  </div>
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((schedule) => (
                <tr
                  key={schedule.id}
                  className="border-b border-slate-800/40 transition-colors hover:bg-slate-800/30"
                >
                  {!tourId && (
                    <td className="p-5">
                      <div className="max-w-52 truncate text-sm font-bold uppercase tracking-tight text-cyan-300">
                        {schedule.tourName || 'N/A'}
                      </div>
                    </td>
                  )}

                  <td className="p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                      <CalendarDays size={15} className="text-emerald-500/70" />
                      {format(new Date(schedule.departureDate), 'dd/MM/yyyy')}
                    </div>
                  </td>

                  <td className="p-5 text-center">
                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-bold text-blue-300">
                      {schedule.availableSeats} / {schedule.quota}
                    </span>
                  </td>

                  <td className="p-5 text-right text-sm font-bold italic text-orange-400">
                    {schedule.adultPrice.toLocaleString()}₫
                  </td>

                  <td className="p-5 text-right text-sm font-bold italic text-amber-400">
                    {schedule.childPrice.toLocaleString()}₫
                  </td>

                  <td className="p-5">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditingId(schedule.id);
                          setFormData({
                            ...schedule,
                            departureDate: schedule.departureDate.split('T')[0],
                            returnDate: schedule.returnDate.split('T')[0],
                          });
                          setIsModalOpen(true);
                        }}
                        className="rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-slate-400 transition-colors hover:text-amber-400"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => confirmDelete(schedule.id)}
                        className="rounded-lg border border-rose-500/15 bg-rose-500/5 p-2.5 text-rose-300 transition-colors hover:bg-rose-500/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tourId ? 5 : 6} className="p-20 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-4 rounded-full border border-slate-800 bg-slate-950 p-4">
                      <Info size={30} className="text-slate-700" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      {searchTerm
                        ? 'Không tìm thấy lịch trình phù hợp'
                        : 'Chưa có lịch trình nào được tạo'}
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-5">
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-100">
                  {editingId ? 'Cập nhật lịch trình' : 'Khởi tạo đợt tour'}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Cấu hình ngày đi, giá và số lượng chỗ.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:text-rose-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 bg-slate-900/70 p-6">
              {!tourId && !editingId && (
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Chọn Tour áp dụng
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm font-semibold text-slate-200 outline-none focus:border-cyan-500/40"
                    value={formData.tourId}
                    onChange={(e) =>
                      setFormData({ ...formData, tourId: Number(e.target.value) })
                    }
                  >
                    {tours.map((tour) => (
                      <option key={tour.id} value={tour.id}>
                        {tour.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Ngày khởi hành
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm font-semibold text-slate-200 outline-none focus:border-emerald-500/40"
                    value={formData.departureDate}
                    onChange={(e) =>
                      setFormData({ ...formData, departureDate: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm font-semibold text-slate-200 outline-none focus:border-emerald-500/40"
                    value={formData.returnDate}
                    onChange={(e) =>
                      setFormData({ ...formData, returnDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <label className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    <Users size={12} className="text-orange-400" />
                    Giá người lớn
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent text-sm font-bold italic text-orange-400 outline-none"
                    value={formData.adultPrice.toLocaleString()}
                    onChange={(e) => handleNumberChange('adultPrice', e.target.value)}
                  />
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <label className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    <Baby size={12} className="text-amber-400" />
                    Giá trẻ em
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent text-sm font-bold italic text-amber-400 outline-none"
                    value={formData.childPrice.toLocaleString()}
                    onChange={(e) => handleNumberChange('childPrice', e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <label className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  <Hash size={12} className="text-blue-400" />
                  Số lượng khách tối đa
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent text-sm font-bold text-blue-300 outline-none"
                  value={formData.quota.toLocaleString()}
                  onChange={(e) => handleNumberChange('quota', e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-900 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-300 transition-colors hover:bg-slate-800"
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300 transition-all hover:bg-emerald-500/15 disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={15} />}
                  {editingId ? 'Lưu cập nhật' : 'Tạo lịch trình'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminSchedules;
