import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      // Nếu không có orderId → quay về trang chính
      navigate("/");
    }
  }, [orderId, navigate]);

  return (
    <div className="max-w-xl mx-auto text-center py-20">
      <h1 className="text-4xl font-bold text-green-600 mb-6">
        Thanh toán thành công!
      </h1>
      <p className="text-lg">
        Mã đơn hàng của bạn: <strong>{orderId}</strong>
      </p>
      <button
        onClick={() => navigate("/orders")}
        className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Xem đơn hàng
      </button>
    </div>
  );
}
