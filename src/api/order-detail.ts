// 📁 src/api/order-detail.ts
import axiosInstance from "./axiosInstance"; // ← SỬA: import đúng

// Thêm vào giỏ – KHÔNG truyền user_id
export const addProductToCart = async (data: {
  MaSP: number;
  SoLuong: number;
  GiaBanTaiThoiDiem: number;
  GhiChu?: string;
}) => {
  try {
    const res = await axiosInstance.post("/order-detail/add", data); // ← DÙNG axiosInstance
    return res.data;
  } catch (error: any) {
    console.error("Lỗi thêm vào giỏ:", error.response?.data || error);
    throw error;
  }
};

// Lấy giỏ – dùng /me
export const getCartByUser = async () => {
  try {
    const res = await axiosInstance.get("/order-detail/me"); // ← DÙNG axiosInstance
    return res.data;
  } catch (error: any) {
    console.error("Lỗi lấy giỏ:", error.response?.data || error);
    throw error;
  }
};

// Xóa sản phẩm – dùng /product/:MaSP
export const deleteProductFromCart = async (MaSP: number) => {
  try {
    const res = await axiosInstance.delete(`/order-detail/product/${MaSP}`); // ← DÙNG axiosInstance
    return res.data;
  } catch (error: any) {
    console.error("Lỗi xóa sản phẩm:", error.response?.data || error);
    throw error;
  }
};
