// Định nghĩa kiểu dữ liệu người dùng (User)
export interface User {
  id: number;
  fullname: string;
  username: string;
  email: string;
  role: "user" | "admin";
  avatar: string;
  created_at: string | number | Date;

  // Các thông tin khách hàng mở rộng
  MaKH?: number;
  HoTen?: string;
  SoDienThoai?: string;

  // Thông tin địa chỉ chi tiết
  TinhThanh?: string;
  QuanHuyen?: string;
  PhuongXa?: string;
  DiaChiChiTiet?: string; // địa chỉ cụ thể (số nhà, ngõ, thôn...)
  DiaChiDayDu?: string; // địa chỉ gộp tự động (từ DB)
}

export type CreateUserInput = Omit<User, "id" | "created_at"> & {
  password: string;
};

// Dữ liệu gửi khi cập nhật thông tin người dùng
export interface UpdateUserRequest {
  SoDienThoai?: string;
  TinhThanh?: string;
  QuanHuyen?: string;
  PhuongXa?: string;
  DiaChiChiTiet?: string;
}

// Dữ liệu trả về sau khi cập nhật
export interface UpdateUserResponse {
  message: string;
  data?: Partial<User>;
}
