// src/utils/geocode.ts

/**
 * Geocode địa chỉ bằng Nominatim (OpenStreetMap) - MIỄN PHÍ, KHÔNG CẦN KEY
 * @param address Địa chỉ đầy đủ: "123 Nguyễn Trãi, Phường Cửa Nam, Thành phố Hà Nội, Việt Nam"
 * @returns { lat, lng } hoặc null nếu lỗi
 */
export const geocodeAddress = async (
  address: string
): Promise<{ lat: number; lng: number } | null> => {
  // Kiểm tra đầu vào
  if (!address?.trim()) return null;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&countrycodes=vn&limit=1&addressdetails=1`,
      {
        headers: {
          // BẮT BUỘC: Nominatim yêu cầu User-Agent
          "User-Agent": "CheckoutApp/1.0 (your-email@example.com)",
        },
      }
    );

    if (!response.ok) {
      console.warn("Nominatim trả lỗi:", response.status);
      return null;
    }

    const data = await response.json();

    if (data && data[0]) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }

    return null;
  } catch (err) {
    console.error("Lỗi gọi Nominatim:", err);
    return null;
  }
};
