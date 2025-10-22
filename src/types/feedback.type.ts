// Định nghĩa kiểu dữ liệu Feedback dùng chung trong toàn project

export interface Feedback {
  id: number;
  fullname: string;
  avatar?: string;
  comment: string;
  rating: number;
  TinhThanh?: string;
}
