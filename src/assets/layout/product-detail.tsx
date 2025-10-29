import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/button";
import { getSanPhamById } from "@/api/product";
import type { SanPham } from "@/types/product.type";
import { FaShoppingCart } from "react-icons/fa";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<SanPham | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  // 🟢 Gọi API lấy chi tiết sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const data = await getSanPhamById(Number(id));
        setProduct(data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const getImageUrl = (path?: string) => {
    if (!path) return "/no-image.png"; // ảnh mặc định nếu trống

    // Nếu là ảnh upload từ backend
    if (path.startsWith("/uploads")) {
      return `${import.meta.env.VITE_BASE_SERVER}${path}`;
    }

    // Nếu là ảnh tĩnh trong public (FE)
    return path;
  };

  // 🛒 Thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (!product) return;

    const savedCart = localStorage.getItem("cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];

    const existing = cart.find((item: any) => item.id === product.MaSP);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.MaSP,
        name: product.TenSP,
        price: product.GiaSauGiam || product.GiaBan,
        image: `${import.meta.env.VITE_BASE_SERVER}${product.HinhAnh}`,
        quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("✅ Đã thêm vào giỏ hàng!");
  };

  if (loading) return <p className="text-center mt-10">Đang tải...</p>;
  if (!product)
    return (
      <p className="text-center mt-10 text-red-500">Không tìm thấy sản phẩm.</p>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Ảnh sản phẩm */}
      <div>
        <img
          src={getImageUrl(product.HinhAnh)}
          alt={product.TenSP}
          className="w-full h-auto rounded-lg shadow-md object-cover"
        />
      </div>

      {/* Thông tin sản phẩm */}
      <div>
        <h1 className="text-3xl font-semibold mb-4">{product.TenSP}</h1>

        <p className="text-gray-600 mb-3">
          Xuất xứ: {product.XuatXu || "Không rõ"}
        </p>
        <p className="text-gray-600 mb-3">Vùng miền: {product.VungMien}</p>
        <p className="text-gray-600 mb-3">Loại: {product.LoaiDoAn}</p>
        <p className="text-gray-600 mb-3">
          Hạn sử dụng: {product.HanSuDung || "Không có"}
        </p>

        <div className="mt-4 mb-6">
          {product.Voucher && product.GiaSauGiam ? (
            <div>
              <div>
                <span className="text-2xl text-red-600 font-bold mr-3">
                  {product.GiaSauGiam.toLocaleString("vi-VN")}₫
                </span>
                <span className="text-gray-500 line-through">
                  {product.GiaBan.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Tiết kiệm:{" "}
                <span className="text-green-600 font-semibold">
                  {(product.GiaBan - product.GiaSauGiam).toLocaleString(
                    "vi-VN"
                  )}
                  ₫
                </span>
              </p>
            </div>
          ) : (
            <span className="text-2xl text-green-700 font-bold">
              {product.GiaBan.toLocaleString("vi-VN")}₫
            </span>
          )}
        </div>

        {/* Số lượng + Nút thêm vào giỏ + Mua ngay */}
        <div className="flex flex-col gap-4 mb-6">
          {/* 🧮 Số lượng */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700">Số lượng:</label>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-bold"
              >
                –
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-14 text-center py-2 border-x text-lg font-medium appearance-none focus:outline-none"
              />

              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Nút thêm vào giỏ */}
          <Button
            className="w-full bg-green-600 text-white hover:bg-green-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-transform active:scale-95"
            onClick={handleAddToCart}
          >
            <FaShoppingCart className="text-lg" />
            Thêm vào giỏ hàng
          </Button>

          {/* Nút mua ngay */}
          <Button
            className="w-full bg-slate-700 text-white hover:bg-slate-800 py-3 rounded-lg font-semibold transition-transform active:scale-95"
            onClick={() => {
              if (!product) return;
              navigate("/checkout", {
                state: {
                  items: [
                    {
                      id: product.MaSP,
                      name: product.TenSP,
                      price: product.GiaSauGiam || product.GiaBan,
                      image: product.HinhAnh,
                      quantity,
                    },
                  ],
                },
              });
            }}
          >
            Mua ngay
          </Button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Mô tả sản phẩm:</h2>
          <div
            className="text-gray-700 leading-relaxed text-justify"
            dangerouslySetInnerHTML={{
              __html: product.MoTa || "Chưa có mô tả cho sản phẩm này.",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
