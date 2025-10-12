// Gọi API đăng ký, đăng nhập, đăng xuất
import type {
  AuthResponse,
  RegisterRequest,
  LoginRequest,
} from "@/types/register-login-logout.type";
import api from "./axiosInstance"; // ✅ instance có interceptor

const API_URL = "/auth"; // không cần VITE_API_URL vì đã có baseURL trong axiosInstance.ts

// 🟢 Đăng ký
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>(`${API_URL}/register`, data);
  return res.data;
}

// 🟢 Đăng nhập
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>(`${API_URL}/login`, data);
  return res.data;
}

// 🔴 Đăng xuất
export async function logout(): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>(`${API_URL}/logout`);
  return res.data;
}
