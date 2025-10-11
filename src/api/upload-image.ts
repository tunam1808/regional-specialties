// src/api/upload-image.ts
import axios from "axios";

const BASE_SERVER = import.meta.env.VITE_BASE_SERVER;

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

  const res = await axios.post(`${BASE_SERVER}/api/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("✅ BE trả về URL:", res.data.url);

  // ⚙️ BE đã trả về URL đầy đủ, dùng luôn
  return res.data.url;
};
