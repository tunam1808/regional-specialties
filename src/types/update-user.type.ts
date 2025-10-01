// File này để định nghĩa kiểu cho cập nhật thông tin người dùng

export interface User {
  id: string;
  fullname: string;
  username: string;
  email: string;
  role: "user" | "admin";
  avatar: string;
  SoDienThoai?: string;
  DiaChi?: string;
}

export interface UpdateUserRequest {
  SoDienThoai?: string;
  DiaChi?: string;
}

export interface UpdateUserResponse {
  message: string;
  data?: User;
}
