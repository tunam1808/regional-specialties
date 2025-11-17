import api from "./axiosInstance";

interface ApiResponse {
  success: boolean;
  message: string;
}

// Gửi email quên mật khẩu
export const forgotPassword = async (email: string): Promise<ApiResponse> => {
  try {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  } catch (err: any) {
    throw err.response?.data || { message: "Có lỗi xảy ra!" };
  }
};

// Đặt lại mật khẩu
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<ApiResponse> => {
  try {
    const res = await api.post("/reset-password", { token, newPassword });
    return res.data;
  } catch (err: any) {
    throw err.response?.data || { message: "Có lỗi xảy ra!" };
  }
};
