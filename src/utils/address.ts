// src/utils/address.ts

export interface Province {
  idProvince: string;
  name: string;
}

export interface Commune {
  idProvince: string;
  idCommune: string;
  name: string;
}

/**
 * Ghép địa chỉ đầy đủ từ các phần (dùng để lưu đơn hàng)
 * @param diaChiChiTiet Số nhà, đường
 * @param phuongXa Tên phường/xã
 * @param provinces Danh sách tỉnh/thành
 * @param communes Danh sách phường/xã
 * @returns Chuỗi địa chỉ đầy đủ
 */
export const buildFullAddress = (
  diaChiChiTiet: string,
  phuongXa: string,
  provinces: Province[],
  communes: Commune[]
): string => {
  const cleanDetail = diaChiChiTiet.trim();
  const cleanWard = phuongXa.trim();

  if (!cleanWard || provinces.length === 0 || communes.length === 0) {
    return cleanDetail ? `${cleanDetail}, Việt Nam` : "Việt Nam";
  }

  const ward = communes.find(
    (c) =>
      c.name.toLowerCase().includes(cleanWard.toLowerCase()) ||
      cleanWard.toLowerCase().includes(c.name.toLowerCase())
  );

  if (!ward) {
    return cleanDetail ? `${cleanDetail}, ${cleanWard}, Việt Nam` : "Việt Nam";
  }

  const province = provinces.find((p) => p.idProvince === ward.idProvince);
  if (!province) {
    return cleanDetail ? `${cleanDetail}, ${ward.name}, Việt Nam` : "Việt Nam";
  }

  const parts = [cleanDetail, ward.name, province.name, "Việt Nam"].filter(
    Boolean
  );
  return parts.join(", ");
};

/**
 * Ghép địa chỉ CHỈ PHƯỜNG + TỈNH → dùng để geocoding TRUNG TÂM PHƯỜNG/XÃ
 * @param phuongXa Tên phường/xã
 * @param provinces Danh sách tỉnh/thành
 * @param communes Danh sách phường/xã
 * @returns Chuỗi địa chỉ để lấy tọa độ trung tâm
 */
export const buildFullAddressForCenter = (
  phuongXa: string,
  provinces: Province[],
  communes: Commune[]
): string => {
  if (!phuongXa || provinces.length === 0 || communes.length === 0) return "";

  const cleanWard = phuongXa.trim();

  const ward = communes.find(
    (c) =>
      c.name.toLowerCase().includes(cleanWard.toLowerCase()) ||
      cleanWard.toLowerCase().includes(c.name.toLowerCase())
  );

  if (!ward) return "";

  const province = provinces.find((p) => p.idProvince === ward.idProvince);
  if (!province) return "";

  return `${ward.name}, ${province.name}, Việt Nam`;
};
