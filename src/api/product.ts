// src/api/products.api.ts
import api from "./axiosInstance"; // file api interceptor bạn đã có
import type { SanPham } from "@/types/product.type";

// 🔹 Lấy danh sách sản phẩm (có filter vùng miền + loại đồ ăn)
export const getAllSanPham = async (vungmien?: string, loaidan?: string) => {
  try {
    const res = await api.get("/sanpham", {
      params: { vungmien, loaidan },
    });
    return res.data as SanPham[];
  } catch (error: any) {
    console.error(
      "Lỗi lấy danh sách sản phẩm:",
      error.response?.data || error.message
    );
    return [];
  }
};

// 🔹 Lấy chi tiết 1 sản phẩm theo MaSP
export const getSanPhamById = async (MaSP: number) => {
  try {
    const res = await api.get(`/sanpham/${MaSP}`);
    return res.data as SanPham;
  } catch (error: any) {
    console.error("Lỗi lấy sản phẩm:", error.response?.data || error.message);
    return null;
  }
};

// 🔹 Thêm sản phẩm (admin)
export const addSanPham = async (product: SanPham) => {
  try {
    const res = await api.post("/sanpham", product);
    console.log("Thêm sản phẩm thành công:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Lỗi thêm sản phẩm:", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Cập nhật sản phẩm (admin)
export const updateSanPham = async (MaSP: number, product: SanPham) => {
  try {
    const res = await api.put(`/sanpham/${MaSP}`, product);
    console.log("Cập nhật sản phẩm thành công:", res.data);
    return res.data;
  } catch (error: any) {
    console.error(
      "Lỗi cập nhật sản phẩm:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🔹 Xóa sản phẩm (admin)
export const deleteSanPham = async (MaSP: number) => {
  try {
    const res = await api.delete(`/sanpham/${MaSP}`);
    console.log("Xóa sản phẩm thành công:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Lỗi xóa sản phẩm:", error.response?.data || error.message);
    throw error;
  }
};
