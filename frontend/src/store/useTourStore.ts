import { create } from 'zustand';
import axios from 'axios';

// Định nghĩa interface rõ ràng để code gợi ý tốt hơn
interface Category {
  id: number;
  name: string;
}

interface TourStore {
  tours: any[];
  categories: Category[]; // Lưu danh sách danh mục
  loading: boolean;
  fetchTours: () => Promise<void>;
  fetchCategories: () => Promise<void>; // Hàm lấy danh mục
  deleteTour: (id: number) => Promise<void>;
}

export const useTourStore = create<TourStore>((set) => ({
  tours: [],
  categories: [],
  loading: false,

  // Lấy danh sách Tour
  fetchTours: async () => {
    set({ loading: true });
    try {
      const res = await axios.get('http://localhost:5091/api/Tours');
      set({ tours: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  // Lấy danh sách Danh mục (Sửa lỗi dữ liệu cứng)
  fetchCategories: async () => {
    try {
      // Thay đổi URL này cho đúng với Endpoint API Category của bạn
      const res = await axios.get('http://localhost:5091/api/Categories');
      set({ categories: res.data });
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
    }
  },

  // Xóa Tour
  deleteTour: async (id: number) => {
    try {
      await axios.delete(`http://localhost:5091/api/Tours/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      set((state) => ({ tours: state.tours.filter(t => t.id !== id) }));
    } catch (error) {
      console.error("Lỗi xóa tour:", error);
      throw error; // Quăng lỗi để component bắt được và hiện toast error
    }
  }
}));