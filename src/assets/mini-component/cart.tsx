import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  // 🟢 Lấy giỏ hàng từ localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // 🔵 Hàm lưu giỏ hàng vào localStorage
  const saveCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // 🟠 Xoá sản phẩm
  const handleRemove = (id: number) => {
    const updated = cart.filter((item) => item.id !== id);
    saveCart(updated);
  };

  // 🟣 Thay đổi số lượng
  const handleQuantityChange = (id: number, qty: number) => {
    if (qty <= 0) return;
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity: qty } : item
    );
    saveCart(updated);
  };

  // 🧮 Tính tổng tiền
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">🛒 Giỏ hàng của bạn</h1>

      {cart.length === 0 ? (
        <div className="text-center py-10 text-gray-600">
          <p>Giỏ hàng trống.</p>
          <Button
            className="mt-4 bg-green-500 text-white hover:bg-green-600"
            onClick={() => navigate("/products")}
          >
            Tiếp tục mua sắm
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg overflow-hidden border">
            <table className="w-full">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">Sản phẩm</th>
                  <th className="py-3 px-4 text-center">Giá</th>
                  <th className="py-3 px-4 text-center">Số lượng</th>
                  <th className="py-3 px-4 text-center">Tổng</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                      <span className="font-medium">{item.name}</span>
                    </td>
                    <td className="text-center text-gray-700">
                      {item.price.toLocaleString("vi-VN")}₫
                    </td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.id,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-16 border rounded-md text-center"
                      />
                    </td>
                    <td className="text-center text-green-600 font-semibold">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tổng cộng */}
          <div className="mt-6 flex flex-col items-end">
            <div className="text-xl font-semibold text-gray-800 mb-3">
              Tổng cộng:{" "}
              <span className="text-green-600">
                {total.toLocaleString("vi-VN")}₫
              </span>
            </div>
            <Button
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
              onClick={() => navigate("/checkout")}
            >
              Tiến hành thanh toán
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
