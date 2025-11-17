import api from "./axiosInstance";

interface ApiResponse {
  success: boolean;
  message: string;
}

// Gọi API đặt lại mật khẩu
export const resetPassword = async (
  email: string,
  tempPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<ApiResponse> => {
  try {
    const res = await api.post("/auth/reset-password", {
      email,
      tempPassword,
      newPassword,
      confirmPassword,
    });
    return res.data;
  } catch (err: any) {
    throw err.response?.data || { message: "Có lỗi xảy ra!" };
  }
};
