import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { showSuccess, showError } from "@/common/toast";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      showError("Không tìm thấy mã đơn hàng!");
      navigate("/cart", { replace: true });
      return;
    }

    showSuccess(`Thanh toán PayPal thành công! Mã đơn: ${orderId}`);
    navigate(`/orders/success/${orderId}`, { replace: true });
  }, [orderId, navigate]);

  return null; // Không render gì
}
