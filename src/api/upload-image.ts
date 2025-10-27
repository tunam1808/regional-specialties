// src/api/upload-image.ts
import api from "./axiosInstance";

/**
 * Upload avatar của người dùng
 * @param file File ảnh (từ input type="file")
 * @param userId ID người dùng (tùy chọn – BE có thể tự lấy từ token)
 * @returns string - Đường dẫn URL ảnh đã upload
 */
export const uploadAvatar = async (
  file: File,
  userId?: number
): Promise<string> => {
  if (!file) throw new Error("Không có file để upload!");

  const formData = new FormData();
  formData.append("avatar", file);
  if (userId) formData.append("userId", userId.toString());

  console.log("📤 Upload avatar:", file.name);

  try {
    const res = await api.post("/upload/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // ✅ Kiểm tra phản hồi từ server
    if (!res.data?.url) {
      throw new Error(res.data?.message || "Upload thất bại!");
    }

    console.log("✅ Ảnh upload thành công:", res.data.url);
    return res.data.url; // Ví dụ: "/avatars/user_1730055555.jpg"
  } catch (err: any) {
    console.error("❌ Lỗi upload avatar:", err);

    // 👉 Token hết hạn đã được axiosInstance xử lý, chỉ ném lỗi khác
    if (err.response?.status === 400) {
      throw new Error(err.response.data?.message || "File không hợp lệ!");
    }

    throw new Error("Lỗi khi upload ảnh, vui lòng thử lại!");
  }
};
