// File này để định nghĩa kiểu cho đăng ký, đăng nhập, đăng xuất, trong csdl dùng kiểu nào thì ở đây phải dùng y như thế

export interface User {
  id: string;
  fullname: string;
  username: string;
  email: string;
  role: "user" | "admin";
  avatar: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: User;
}

export interface RegisterRequest {
  fullname: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export type LogoutRequest = void;
