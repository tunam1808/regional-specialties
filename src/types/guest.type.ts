// src/types/guest.type.ts
export interface User {
  id: number;
  fullname: string;
  username: string;
  email?: string;
  role?: "user" | "admin";
  avatar?: string | null;
  created_at?: string;
  updated_at?: string;

  // Các field bổ sung từ BE
  MaKH?: number;
  HoTen?: string;
  SoDienThoai?: string;
  NgayDangKy?: string;
  TinhThanh?: string;
  QuanHuyen?: string;
  PhuongXa?: string;
  DiaChiChiTiet?: string;
  DiaChiDayDu?: string;
}
