// src/utils/distance.ts

export const SHOP_LOCATION = {
  latitude: 21.1086,
  longitude: 105.446862,
  name: "MTN Shop - Đặc sản ba miền",
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// HÀM MỚI - TÍNH PHÍ SHIP THEO KHOẢNG CÁCH
export const calculateShippingFee = (
  customerLat: number,
  customerLon: number
): number => {
  const distance = calculateDistance(
    SHOP_LOCATION.latitude,
    SHOP_LOCATION.longitude,
    customerLat,
    customerLon
  );

  if (distance <= 30) return 0;
  if (distance <= 200) return 20000;
  if (distance <= 500) return 30000;
  if (distance <= 1000) return 40000;
  return 50000;
};
