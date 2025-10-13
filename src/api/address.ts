// File này gọi API tỉnh thành cả nước
import axios from "axios";

const BASE_URL = "https://provinces.open-api.vn/api";

/** Lấy danh sách tỉnh/thành */
export const getProvinces = async () => {
  const res = await axios.get(`${BASE_URL}/?depth=1`);
  return res.data;
};

/** Lấy danh sách quận/huyện theo mã tỉnh */
export const getDistricts = async (provinceCode: string) => {
  const res = await axios.get(`${BASE_URL}/p/${provinceCode}?depth=2`);
  return res.data.districts || [];
};

/** Lấy danh sách phường/xã theo mã quận/huyện */
export const getWards = async (districtCode: string) => {
  const res = await axios.get(`${BASE_URL}/d/${districtCode}?depth=2`);
  return res.data.wards || [];
};
