import { FaCheckCircle } from "react-icons/fa";
import { Button } from "@/components/button";
import { useNavigate, useParams } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy mã đơn hàng từ URL, ví dụ /orders/success/:id

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white px-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md w-full">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🎉 Đặt hàng thành công!
        </h1>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận với mã:
        </p>

        <div className="text-lg font-semibold text-green-700 mb-8">
          {id ? `#${id}` : "—"}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => navigate(`/orders/${id}`)}
          >
            Xem đơn hàng
          </Button>
          <Button
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800"
            onClick={() => navigate("/products")}
          >
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    </div>
  );
}
