// File này dùng để xử lý token và tự động logout khi token hết hạn
// Sử dụng react-hot-toast để hiển thị thông báo ở góc dưới màn hình

import axios from "axios";
import toast from "react-hot-toast"; // ⚡ Dùng react-hot-toast

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  headers: { "Content-Type": "application/json" },
});

// ✅ Thêm token vào header trước mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Xử lý token hết hạn hoặc không hợp lệ
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const data = error.response?.data || {};
    const msg = (data.error || data.message || "").toLowerCase();

    console.log("🔥 Token interceptor:", status, msg);

    // 👉 Token hết hạn
    if (
      status === 401 &&
      (msg.includes("expired") || msg.includes("hết hạn"))
    ) {
      toast.dismiss(); // Xóa các thông báo cũ
      toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#f44336",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "14px",
        },
      });

      // Xóa token và user
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Đợi 2 giây cho người dùng đọc thông báo
      await new Promise((resolve) => setTimeout(resolve, 2000));
      window.location.href = "/login";
    }

    // 👉 Token không hợp lệ
    else if (
      status === 403 ||
      msg.includes("invalid") ||
      msg.includes("token không hợp lệ")
    ) {
      toast.dismiss();
      toast.error("🚫 Token không hợp lệ, vui lòng đăng nhập lại!", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#f44336",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "14px",
        },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      await new Promise((resolve) => setTimeout(resolve, 2000));
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
