import React, { useState } from "react";
import { Card, CardContent } from "@/components/card";
import { Button } from "@/components/button";
import { Trash2, Plus, Minus } from "lucide-react";


interface CartItemType {
  id: number;
  name: string;
  region: string;
  price: number;
  quantity: number;
  image: string;
  checked: boolean;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([
    {
      id: 1,
      name: "Chè Thái Nguyên",
      region: "Miền Bắc",
      price: 120000,
      quantity: 1,
      image: "/",
      checked: true,
    },
    {
      id: 2,
      name: "Mực khô Phan Thiết",
      region: "Miền Trung",
      price: 250000,
      quantity: 1,
      image: "/images/",
      checked: true,
    },
    {
      id: 3,
      name: "Bánh Pía Sóc Trăng",
      region: "Miền Nam",
      price: 80000,
      quantity: 2,
      image: "/images/banh-pia.jpg",
      checked: false,
    },
  ]);

  const toggleCheck = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleIncrease = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemove = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSelectAll = () => {
    const allChecked = cartItems.every((i) => i.checked);
    setCartItems((prev) => prev.map((i) => ({ ...i, checked: !allChecked })));
  };

  const totalPrice = cartItems
    .filter((item) => item.checked)
    .reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-green-700">
        🧺 Giỏ hàng đặc sản của bạn
      </h1>

      {/* Danh sách sản phẩm */}
      <div className="flex flex-col gap-4 mb-32">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">
            Giỏ hàng đang trống. Hãy chọn những món đặc sản yêu thích nhé!
          </p>
        ) : (
          cartItems.map((item) => (
            <Card
              key={item.id}
              className="flex items-center justify-between p-4 hover:shadow-md transition"
            >
              <CardContent className="flex items-center gap-4 flex-1">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleCheck(item.id)}
                  className="w-5 h-5 accent-green-600"
                />
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md border"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.region}</p>
                  <p className="text-green-700 font-semibold">
                    {item.price.toLocaleString()}₫
                  </p>
                </div>
              </CardContent>

              <div className="flex items-center gap-3 pr-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDecrease(item.id)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleIncrease(item.id)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemove(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Thanh tổng tiền */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={cartItems.every((i) => i.checked)}
            onChange={handleSelectAll}
            className="w-5 h-5 accent-green-600"
          />
          <span className="font-medium">Chọn tất cả</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold text-green-700">
            Tổng cộng: {totalPrice.toLocaleString()}₫
          </span>
          <Button className="bg-green-600 hover:bg-green-700 px-6 py-2 text-white">
            Đặt hàng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
