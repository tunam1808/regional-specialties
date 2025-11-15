// src/api/email.api.ts
import api from "./axiosInstance"; // dùng axios instance có interceptor

interface SendEmailPayload {
  to: string;
  subject: string;
  message: string;
  userEmail: string;
}

/**
 * Gọi API backend để gửi email
 * Backend: POST /api/send-email
 */
export const sendEmailAPI = async (payload: SendEmailPayload) => {
  try {
    const response = await api.post("/send-email", payload);
    return response.data; // { success: true, messageId: ... } hoặc { success: false, error: ... }
  } catch (error: any) {
    console.error("❌ Lỗi gửi email:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};
