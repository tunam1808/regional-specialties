import axios from "axios";
import type { User, CreateUserInput } from "../types/update-user.type";

const BASE_URL = import.meta.env.VITE_API_URL;
const ADMIN_USERS = import.meta.env.VITE_API_ADMIN_USERS;

const API_URL = `${BASE_URL}${ADMIN_USERS}`;

// ✅ Tạo instance axios có header Authorization
const token = localStorage.getItem("token");

const axiosInstance = axios.create({
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export const userApi = {
  // ✅ Lấy danh sách tất cả người dùng
  getAll: async (): Promise<User[]> => {
    const res = await axiosInstance.get<User[]>(API_URL);
    return res.data;
  },

  // ✅ Tạo tài khoản mới (dùng CreateUserInput, không phải User)
  create: async (
    data: CreateUserInput
  ): Promise<{ message: string; userId: number }> => {
    const res = await axiosInstance.post<{ message: string; userId: number }>(
      API_URL,
      data
    );
    return res.data;
  },

  // ✅ Cập nhật tài khoản (cho phép truyền Partial<User>)
  update: async (
    id: number,
    data: Partial<User>
  ): Promise<{ message: string }> => {
    const res = await axiosInstance.put<{ message: string }>(
      `${API_URL}/${id}`,
      data
    );
    return res.data;
  },

  // ✅ Xóa tài khoản
  remove: async (id: number): Promise<{ message: string }> => {
    const res = await axiosInstance.delete<{ message: string }>(
      `${API_URL}/${id}`
    );
    return res.data;
  },
};
