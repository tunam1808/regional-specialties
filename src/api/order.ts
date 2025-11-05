// 📁 src/api/order.ts
import axiosInstance from "./axiosInstance";

export interface CheckoutData {
  PhuongThucThanhToan: string;
  GhiChu?: string;
  DiaChiGiaoHang: string;
}

// Thanh toán – KHÔNG truyền user_id
export const checkoutCart = async (data: CheckoutData) => {
  try {
    const res = await axiosInstance.post("/api/orders/checkout", data);
    return res.data;
  } catch (error: any) {
    console.error("Lỗi thanh toán:", error.response?.data || error);
    throw error;
  }
};

// Lấy tất cả đơn của mình
export const getAllOrders = async () => {
  try {
    const res = await axiosInstance.get("/api/orders");
    return res.data;
  } catch (error: any) {
    console.error("Lỗi lấy đơn hàng:", error.response?.data || error);
    throw error;
  }
};

// Lấy chi tiết đơn
export const getOrderById = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/api/orders/${id}`);
    return res.data;
  } catch (error: any) {
    console.error("Lỗi lấy chi tiết đơn:", error.response?.data || error);
    throw error;
  }
};

// Xóa đơn (chỉ chủ đơn)
export const deleteOrder = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`/api/orders/${id}`);
    return res.data;
  } catch (error: any) {
    console.error("Lỗi xóa đơn:", error.response?.data || error);
    throw error;
  }
};

// Cập nhật trạng thái (chỉ chủ đơn)
export const updateOrderStatus = async (id: string, TrangThai: string) => {
  try {
    const res = await axiosInstance.put(`/api/orders/${id}/status`, {
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
    const res = await axiosInstance.get("/api/orders/cart");
    return res.data;
  } catch (error: any) {
    console.error("Lỗi lấy giỏ:", error.response?.data || error);
    throw error;
  }
};
