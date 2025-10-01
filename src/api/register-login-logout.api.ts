// Gọi API đăng ký, đăng nhập, đăng xuất

import axios from "axios";
import type {
  AuthResponse,
  RegisterRequest,
  LoginRequest,
} from "@/types/register-login-logout.type";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const res = await axios.post<AuthResponse>(`${API_URL}/register`, data);
  return res.data;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await axios.post<AuthResponse>(`${API_URL}/login`, data);
  return res.data;
}

export async function logout(): Promise<AuthResponse> {
  const res = await axios.post<AuthResponse>(`${API_URL}/logout`);
  return res.data;
}
