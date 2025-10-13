// src/api/userApi.ts
import api from "./axiosInstance";
import type { User, CreateUserInput } from "../types/update-user.type";

const BASE_URL = import.meta.env.VITE_API_URL;
const ADMIN_USERS = import.meta.env.VITE_API_ADMIN_USERS;
const API_URL = `${BASE_URL}${ADMIN_USERS}`;

export const userApi = {
  // ✅ Lấy danh sách tất cả người dùng
  getAll: async (): Promise<User[]> => {
    const res = await api.get<User[]>(API_URL);
    return res.data;
  },

  // ✅ Tạo tài khoản mới (dùng CreateUserInput, không phải User)
  create: async (
    data: CreateUserInput
  ): Promise<{ message: string; userId: number }> => {
    const res = await api.post<{ message: string; userId: number }>(
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
    const res = await api.put<{ message: string }>(`${API_URL}/${id}`, data);
    return res.data;
  },

  // ✅ Xóa tài khoản
  remove: async (id: number): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(`${API_URL}/${id}`);
    return res.data;
  },
};
