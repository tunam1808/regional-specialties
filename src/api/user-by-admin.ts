import axios from "axios";
import type { User } from "../types/update-user.type";

const BASE_URL = import.meta.env.VITE_API_URL;
const ADMIN_USERS = import.meta.env.VITE_API_ADMIN_USERS;

const API_URL = `${BASE_URL}${ADMIN_USERS}`;

// Tạo 1 instance axios có sẵn header Authorization
const token = localStorage.getItem("token");

const axiosInstance = axios.create({
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export const userApi = {
  getAll: async (): Promise<User[]> => {
    const res = await axiosInstance.get<User[]>(API_URL);
    return res.data;
  },

  create: async (data: User): Promise<{ message: string; userId: number }> => {
    const res = await axiosInstance.post<{ message: string; userId: number }>(
      API_URL,
      data
    );
    return res.data;
  },

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

  remove: async (id: number): Promise<{ message: string }> => {
    const res = await axiosInstance.delete<{ message: string }>(
      `${API_URL}/${id}`
    );

    return res.data;
  },
};
