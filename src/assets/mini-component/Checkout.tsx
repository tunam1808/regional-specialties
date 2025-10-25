import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Customer {
  name: string;
  phone: string;
  address: string;
}

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    phone: "",
    address: "",
  });
  const navigate = useNavigate();

  // 🟢 Lấy giỏ hàng từ localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 🟠 Xử lý thanh toán
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.name || !customer.phone || !customer.address) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // 🟣 Giả lập thanh toán thành công
    alert(
      `🎉 Thanh toán thành công!\n\nCảm ơn ${customer.name} đã mua hàng.\nTổng thanh toán: ${total.toLocaleString(
        "vi-VN"
      )}₫`
    );

    localStorage.removeItem("cart"); // Xoá giỏ hàng
    navigate("/"); // Quay về trang chủ
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">💳 Thanh toán</h1>

      {cart.length === 0 ? (
        <div className="text-center py-10 text-gray-600">
          <p>Giỏ hàng trống, vui lòng quay lại mua sắm.</p>
          <Button
            className="mt-4 bg-green-500 text-white hover:bg-green-600"
            onClick={() => navigate("/products")}
          >
            Quay lại cửa hàng
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form thông tin khách hàng */}
          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Họ và tên</label>
              <input
                type="text"
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Nhập họ và tên"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Số điện thoại</label>
              <input
                type="text"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({ ...customer, phone: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Địa chỉ</label>
              <textarea
                value={customer.address}
                onChange={(e) =>
                  setCustomer({ ...customer, address: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Nhập địa chỉ nhận hàng"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-yellow-500 text-white py-3 rounded-md hover:bg-yellow-600"
            >
              Xác nhận thanh toán
            </Button>
          </form>

          {/* Danh sách sản phẩm */}
          <div className="bg-white shadow rounded-lg p-4 border">
            <h2 className="text-xl font-semibold mb-4">Đơn hàng của bạn</h2>
            <ul className="space-y-3">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                  </div>
                  <span className="text-green-600 font-medium">
                    {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 text-lg font-semibold flex justify-between">
              <span>Tổng cộng:</span>
              <span className="text-yellow-600">
                {total.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
