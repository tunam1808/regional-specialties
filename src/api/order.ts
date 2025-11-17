// 📁 src/api/order.ts
import api from "./axiosInstance";

export interface CheckoutData {
  PhuongThucThanhToan: string;
  GhiChu?: string;
  DiaChiGiaoHang: string;
  SanPhamDaChon: number[];
  KhoangCach?: number | null; // THÊM
  PhiShip?: number; // THÊM
}

// Thanh toán – KHÔNG truyền user_id
export const checkoutCart = async (data: CheckoutData) => {
  try {
    const res = await api.post("/orders/checkout", data);
    return res.data;
  } catch (error: any) {
    console.error("Lỗi thanh toán:", error.response?.data || error);
    throw error;
  }
};

// THANH TOÁN TRỰC TIẾP – DÀNH RIÊNG CHO "MUA NGAY" (KHÔNG QUA GIỎ HÀNG)
export const checkoutDirectly = async (data: {
  PhuongThucThanhToan: string;
  DiaChiGiaoHang: string;
  GhiChu?: string;
  items: {
    MaSP: number;
    SoLuong: number;
    GiaBanTaiThoiDiem: number;
  }[];
  KhoangCach?: number | null; // ← THÊM
  PhiShip?: number;
}) => {
  try {
    const res = await api.post("/orders/direct", data);
    return res.data;
  } catch (error: any) {
    console.error(
      "Lỗi thanh toán trực tiếp (Mua ngay):",
      error.response?.data || error
    );
    throw error;
  }
};

// Lấy tất cả đơn của mình
export const getAllOrders = async () => {
  try {
    const res = await api.get("/orders");
    return res.data;
  } catch (error: any) {
    console.error("Lỗi lấy đơn hàng:", error.response?.data || error);
    throw error;
  }
};

// Lấy chi tiết đơn
export const getOrderById = async (id: string) => {
  try {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  } catch (error: any) {
    console.error("Lỗi lấy chi tiết đơn:", error.response?.data || error);
    throw error;
  }
};

// Xóa đơn (chỉ chủ đơn)
export const deleteOrder = async (id: string) => {
  try {
    const res = await api.delete(`/orders/${id}`);
    return res.data;
  } catch (error: any) {
    console.error("Lỗi xóa đơn:", error.response?.data || error);
    throw error;
  }
};

// Cập nhật trạng thái (chỉ admin)
export const updateOrderStatus = async (id: string, TrangThai: string) => {
  try {
    const res = await api.put(`/orders/${id}/status`, {
      TrangThai,
    }); // ← DÙNG axiosInstance
    return res.data;
  } catch (error: any) {
    console.error("Lỗi cập nhật trạng thái:", error.response?.data || error);
    throw error;
  }
};

// Lấy giỏ hàng (nếu cần riêng)
export const getCart = async () => {
  try {
    const res = await api.get("/api/orders/cart");
    return res.data;
  } catch (error: any) {
    console.error("Lỗi lấy giỏ:", error.response?.data || error);
    throw error;
  }
};
