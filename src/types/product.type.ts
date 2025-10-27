// src/types/sanpham.types.ts
export interface SanPham {
  MaSP?: number;
  TenSP: string;
  HinhAnh?: string;
  GiaNhap?: number;
  GiaBan: number;
  GiaSauGiam?: number;
  SoLuongTon?: number;
  DaBan?: number;
  DanhGiaTrungBinh?: number;
  TongLuotDanhGia?: number;
  HanSuDung?: string;
  XuatXu?: string;
  MoTa?: string;
  Voucher?: string;
  user_id: number;
  VungMien?: string;
  LoaiDoAn?: string;
  NguoiDang?: string; // fullname người đăng
  SoDienThoai?: string; // từ KhachHang
  DiaChiDayDu?: string; // từ KhachHang
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  voucher: any;
  id: number;
  name: string;
  image: string;
  region: string;
  type: string;
  price: number;
}
