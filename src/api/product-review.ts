import api from "./axiosInstance"; // import axiosInstance của bạn

export interface AverageRating {
  average_rating: number;
  total_reviews: number;
}

export interface ProductReview {
  username?: string;
  avatar?: string;
  id?: number;
  MaSP: number;
  user_id: number;
  rating: number;
  comment?: string;
  images?: string[]; // mảng ảnh
  created_at?: string;
  updated_at?: string;
}

// ============================
// 1. Lấy danh sách review theo sản phẩm
// ============================
export const getReviewsByProduct = async (MaSP: number) => {
  const res = await api.get<ProductReview[]>(`/reviews/${MaSP}`);
  return res.data;
};

// ============================
// 2. Thêm review
// ============================
export const createReview = async (review: ProductReview) => {
  const res = await api.post(`/reviews`, review);
  return res.data;
};

// ============================
// 3. Cập nhật review
// ============================
export const updateReview = async (
  reviewId: number,
  review: Partial<ProductReview>
) => {
  const res = await api.put(`/reviews/${reviewId}`, review);
  return res.data;
};

// ============================
// 4. Xóa review
// ============================
export const deleteReview = async (reviewId: number) => {
  const res = await api.delete(`/reviews/${reviewId}`);
  return res.data;
};

// ============================
// 5. Lấy điểm trung bình và tổng lượt đánh giá
// ============================
export const getAverageRating = async (
  MaSP: number
): Promise<AverageRating> => {
  const res = await api.get<AverageRating>(`/reviews/average/${MaSP}`);
  return res.data;
};
