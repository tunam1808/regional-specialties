// File này để xử lý token vì token dùng để đăng nhập, chỉ có tác dụng trong 1 khoảng tgian
// Token hết hạn sẽ tự đăng xuất

import axios from "axios";
import { showError } from "@/common/toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

// ✅ Tự động thêm token vào header mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Xử lý khi token hết hạn hoặc không hợp lệ
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.error;
    if (msg === "jwt expired") {
      showError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } else if (msg === "invalid token" || msg === "Token không hợp lệ") {
      showError("Token không hợp lệ. Vui lòng đăng nhập lại!");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
