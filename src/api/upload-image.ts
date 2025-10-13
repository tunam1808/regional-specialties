// src/api/upload-image.ts
import api from "./axiosInstance";

/**
 * Upload avatar file + cập nhật DB
 * @param file File ảnh từ input
 * @param userId ID người dùng
 * @returns string - URL đầy đủ của ảnh đã upload
 */
export const uploadAvatar = async (
  file: File,
  userId: number
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId.toString());

  console.log("📤 Bắt đầu upload:", file.name);

  try {
    const res = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Nếu server không trả url → ném lỗi
    if (!res.data?.url) {
      throw new Error(res.data?.message || "Upload thất bại!");
    }

    console.log("✅ BE trả về URL:", res.data.url);
    return res.data.url;
  } catch (err: any) {
    // Nếu token hết hạn hoặc lỗi 401 → ném lỗi để frontend bắt
    if (err.response?.status === 401) {
      throw new Error("Unauthorized: Phiên đăng nhập hết hạn");
    }
    throw err;
  }
};
