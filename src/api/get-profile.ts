// File này để gọi API lấy thông tin người dùng từ BE
import api from "./axiosInstance"; // <-- dùng lại axios instance chung

const API_URL = import.meta.env.VITE_API_URL;
const API_PROFILE = import.meta.env.VITE_API_PROFILE;

// Lấy thông tin tài khoản
export async function getProfile() {
  console.log("👉 API_URL:", API_URL);
  console.log("👉 API_PROFILE:", API_PROFILE);
  console.log("👉 Full URL gọi lên:", `${API_URL}${API_PROFILE}`);

  const res = await api.get(`${API_URL}${API_PROFILE}`);
  return res.data;
}
