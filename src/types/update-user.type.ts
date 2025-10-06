// File này để định nghĩa kiểu cho cập nhật thông tin người dùng

export interface User {
  created_at: string | number | Date;
  id: number;
  fullname: string;
  username: string;
  email: string;
  role: "user" | "admin";
  avatar: string;
  SoDienThoai?: string;
  DiaChi?: string;
  MaKH?: number;
  HoTen?: string;
}

export interface UpdateUserRequest {
  SoDienThoai?: string;
  DiaChi?: string;
}

export interface UpdateUserResponse {
  message: string;
  data?: Partial<User>;
}
