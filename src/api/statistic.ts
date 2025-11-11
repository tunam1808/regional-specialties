// src/api/statistic.ts
import api from "./axiosInstance";

const API_BASE = "/statistic";

export interface RevenueItem {
  label: string;
  TongDoanhThu: string;
  SoDon: number;
}

/**
 * Lấy thống kê doanh thu
 * @param type "day" | "month" | "year"
 * @param options { startDate?, endDate?, all? }
 */
export const getRevenue = async (
  type: "day" | "month" | "year" = "day",
  options: { startDate?: string; endDate?: string; all?: boolean } = {}
): Promise<RevenueItem[]> => {
  const { startDate, endDate, all = false } = options;

  const params: any = { type, all };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  console.log("API getRevenue params:", params); // DEBUG

  const res = await api.get(`${API_BASE}/revenue`, {
    params,
    withCredentials: true,
  });

  return res.data;
};
