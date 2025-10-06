import { useState } from "react";

export default function ProductDetail() {
  const [size, setSize] = useState("85gr");
  const [type, setType] = useState("Lạc trắng (nâu)");
  const [quantity, setQuantity] = useState(1);

  const product = {
    name: "Lạc rang húng lìu mặn ngọt hiệu Quê Hương - đặc sản phố Bà Triệu Hà Nội",
    rating: 4.8,
    reviews: 167,
    price: { min: 17000, max: 80000 },
    sizes: ["85gr", "250gr", "500gr"],
    types: ["Lạc trắng (nâu)", "Lạc đỏ", "Lạc đỏ nhỏ (hạt kê)"],
    image: "https://via.placeholder.com/400x400?text=Ảnh+Sản+Phẩm",
    detail: {
      expiry: "6 tháng kể từ ngày sản xuất",
      origin: "Hà Nội, Việt Nam",
      shippedFrom: "Quận Hoàn Kiếm, Hà Nội",
    },
    description:
      "Lạc rang húng lìu mặn ngọt được chế biến theo công thức truyền thống, hương vị thơm ngon, giòn bùi, thích hợp làm món ăn vặt hay biếu tặng.",
    comments: [
      {
        user: "Nguyễn Văn A",
        rating: 5,
        text: "Sản phẩm ngon, đóng gói chắc chắn.",
      },
      { user: "Trần Thị B", rating: 4, text: "Ăn vừa miệng, sẽ mua lại." },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Phần trên (ảnh + thông tin) */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* Hình ảnh sản phẩm */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto rounded border"
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div>
          <h1 className="text-2xl font-semibold mb-3">{product.name}</h1>

          {/* Rating + Reviews */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-500">★ {product.rating}</span>
            <span className="text-gray-500">{product.reviews} đánh giá</span>
          </div>

          {/* Giá */}
          <div className="text-red-600 text-2xl font-bold mb-4">
            {product.price.min.toLocaleString("vi-VN")}đ -{" "}
            {product.price.max.toLocaleString("vi-VN")}đ
          </div>

          {/* Kích cỡ */}
          <div className="mb-4">
            <p className="font-medium mb-2">Kích cỡ:</p>
            <div className="flex gap-3">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 border rounded ${
                    size === s
                      ? "border-red-500 text-red-500"
                      : "border-gray-300"
                  }`}
                >
                  Gói {s}
                </button>
              ))}
            </div>
          </div>

          {/* Loại hạt */}
          <div className="mb-4">
            <p className="font-medium mb-2">Loại hạt:</p>
            <div className="flex gap-3 flex-wrap">
              {product.types.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-4 py-2 border rounded ${
                    type === t
                      ? "border-red-500 text-red-500"
                      : "border-gray-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Số lượng */}
          <div className="mb-6">
            <p className="font-medium mb-2">Số lượng:</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                className="px-3 py-1 border rounded"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border rounded"
              >
                +
              </button>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex gap-4">
            <button className="px-6 py-3 border border-red-500 text-red-500 rounded hover:bg-red-50">
              Thêm Vào Giỏ Hàng
            </button>
            <button className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600">
              Mua Ngay
            </button>
          </div>
        </div>
      </div>

      {/* Chi tiết sản phẩm */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3 bg-gray-100 p-2 rounded">
          Chi tiết sản phẩm
        </h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            <span className="font-medium">Hạn sử dụng:</span>{" "}
            {product.detail.expiry}
          </li>
          <li>
            <span className="font-medium">Xuất xứ:</span>{" "}
            {product.detail.origin}
          </li>
          <li>
            <span className="font-medium">Gửi từ:</span>{" "}
            {product.detail.shippedFrom}
          </li>
        </ul>
      </div>

      {/* Mô tả sản phẩm */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3 bg-gray-100 p-2 rounded">
          Mô tả sản phẩm
        </h2>
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
      </div>

      {/* Đánh giá sản phẩm */}
      <div>
        <h2 className="text-xl font-semibold mb-3 bg-gray-100 p-2 rounded">
          Đánh giá sản phẩm
        </h2>
        <div className="space-y-4">
          {product.comments.map((c, i) => (
            <div key={i} className="border-b pb-3">
              <p className="font-medium">{c.user}</p>
              <p className="text-yellow-500">★ {c.rating}</p>
              <p className="text-gray-700">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
