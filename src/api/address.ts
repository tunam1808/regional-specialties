// src/api/address.ts
import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_URL}/location`;

export const getProvinces = async (): Promise<any[]> => {
  console.log("🌐 [API] Gọi GET /api/location/provinces");
  try {
    const res = await axios.get(`${API_BASE}/provinces`);
    let data = res.data;

    // ✅ THÊM DÒNG NÀY: NẾU LÀ CHUỖI → PARSE
    if (typeof data === "string") {
      console.log("🔄 [API] Dữ liệu là chuỗi → parse JSON");
      data = JSON.parse(data);
    }

    if (Array.isArray(data)) {
      console.log("✅ [API] Thành công:", data.length, "tỉnh");
      return data;
    }

    if (data && Array.isArray(data.province)) {
      return data.province;
    }

    console.warn("⚠️ [API] Dữ liệu không hợp lệ");
    return [];
  } catch (err: any) {
    console.error("❌ [API] Lỗi:", err.message);
    return [];
  }
};

export const getWards = async (provinceId: string): Promise<any[]> => {
  try {
    const res = await axios.get(`${API_BASE}/wards/${provinceId}`);
    let data = res.data;
    if (typeof data === "string") data = JSON.parse(data);
    return Array.isArray(data) ? data : [];
  } catch (err: any) {
    console.error("❌ [API] Lỗi getWards:", err.message);
    return [];
  }
};
