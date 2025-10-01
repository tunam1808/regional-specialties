// File này để gọi API lấy thông tin người dùng từ BE

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_PROFILE = import.meta.env.VITE_API_PROFILE;

// Lấy thông tin tài khoản
export async function getProfile() {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  console.log("👉 Token gửi lên:", token);

  console.log("👉 API_URL:", API_URL);
  console.log("👉 API_PROFILE:", API_PROFILE);
  console.log("👉 Full URL gọi lên:", `${API_URL}${API_PROFILE}`);
  console.log("👉 Token gửi lên:", token);

  const res = await axios.get(`${API_URL}${API_PROFILE}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}
