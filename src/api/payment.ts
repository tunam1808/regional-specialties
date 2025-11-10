// services/payment.ts
import axios from "./axiosInstance";

const API_URL = import.meta.env.VITE_API_URL; // ví dụ: http://localhost:4000/api

export interface PayPalPaymentResponse {
  success: boolean;
  MaDonHang: string; // Backend tự sinh
  paypalOrderID: string;
  approveLink: string;
  status: string;
}

/**
 * Tạo thanh toán PayPal
 * @param amountVNĐ Số tiền VNĐ
 * @param orderInfo Thông tin đơn hàng, ví dụ: "Thanh toán đơn hàng #1234"
 */
export const createPayPalPayment = async (
  amountVNĐ: number,
  orderInfo: string
): Promise<PayPalPaymentResponse> => {
  try {
    // Convert VNĐ → USD (giả sử 1 USD = 24,000 VND)
    const usdAmount = (amountVNĐ / 24000).toFixed(2);

    const response = await axios.post(
      `${API_URL}/paypal/create`,
      {
        amount: usdAmount, // Gửi USD sang backend
        currency: "USD", // Currency chuẩn PayPal
        orderInfo,
      },
      { withCredentials: true }
    );

    // Kiểm tra xem backend trả đủ dữ liệu không
    if (!response.data || !response.data.approveLink) {
      throw new Error("Backend không trả approveLink từ PayPal");
    }

    return response.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Lỗi tạo PayPal payment";
    console.error("[PayPal] Lỗi tạo payment:", message);
    throw new Error(message);
  }
};

/**
 * Redirect sang PayPal
 * @param approveLink Link PayPal để redirect
 */
export const redirectToPayPal = (approveLink: string) => {
  if (!approveLink) {
    throw new Error("Không có approveLink để redirect");
  }
  window.location.href = approveLink;
};
