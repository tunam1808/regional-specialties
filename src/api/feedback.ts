import api from "./axiosInstance";

// 📝 Gửi đánh giá mới cho shop
export const sendFeedback = async (rating: number, comment: string) => {
  const response = await api.post("/feedback", { rating, comment });
  return response.data;
};

// 📋 Lấy tất cả đánh giá
export const getAllFeedback = async () => {
  const response = await api.get("/feedback");
  return response.data;
};

// 👤 Lấy đánh giá theo người dùng
export const getFeedbackByUser = async (userId: number) => {
  const response = await api.get(`/feedback/user/${userId}`);
  return response.data;
};

// ❌ Xóa đánh giá (admin)
export const deleteFeedback = async (id: number) => {
  const response = await api.delete(`/feedback/${id}`);
  return response.data;
};
