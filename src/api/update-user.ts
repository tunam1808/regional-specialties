// Gọi API cập nhật, thêm SĐT, địa chỉ khách hàng

import axios from "axios";
import type {
  UpdateUserRequest,
  UpdateUserResponse,
} from "@/types/update-user.type";

const API_URL = import.meta.env.VITE_API_URL;
const UPDATE_ENDPOINT = `${API_URL}/auth/users`;

export const updateUser = async (
  userId: string,
  data: UpdateUserRequest
): Promise<UpdateUserResponse> => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) {
    throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
  }

  try {
    const response = await axios.put<UpdateUserResponse>(
      `${UPDATE_ENDPOINT}/${userId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data?.message || "Cập nhật thất bại");
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      throw new Error("Token không hợp lệ. Vui lòng đăng nhập lại.");
    }
    throw new Error(error.response?.data?.message || error.message);
  }
};

export default updateUser;
