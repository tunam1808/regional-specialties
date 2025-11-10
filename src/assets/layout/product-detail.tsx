import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/button";
import { getSanPhamById } from "@/api/product";
import { getProfile } from "@/api/get-profile"; // THÊM
import { addProductToCart } from "@/api/order-detail"; // THÊM
import { showSuccess, showError } from "@/common/toast"; // THÊM
import type { SanPham } from "@/types/product.type";
import { FaShoppingCart } from "react-icons/fa";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<SanPham | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState<{ id: number } | null>(null); // THÊM: kiểm tra đăng nhập
  const navigate = useNavigate();

  // LẤY USER (đăng nhập chưa?)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getProfile();
        setUser({ id: profile.id });
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // LẤY CHI TIẾT SẢN PHẨM
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
    if (!path) return "/no-image.png";
    if (path.startsWith("/uploads")) {
      return `${import.meta.env.VITE_BASE_SERVER}${path}`;
    }
    return path;
  };

  // THÊM VÀO GIỎ HÀNG THẬT – GIỐNG HỆT TRANG PRODUCTS
  const handleAddToCart = async () => {
    if (!user?.id) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      navigate("/login");
      return;
    }

    if (!product?.MaSP) {
      showError("Sản phẩm không hợp lệ!");
      return;
    }

    if ((product.SoLuongTon ?? 0) <= 0) {
      alert("Sản phẩm đã hết hàng!");
      return;
    }

    try {
      await addProductToCart({
        MaSP: product.MaSP, // ← giờ TS biết chắc chắn là number
        SoLuong: quantity,
        GiaBanTaiThoiDiem: product.GiaSauGiam || product.GiaBan,
        GhiChu: "",
      });

      showSuccess(`Đã thêm "${product.TenSP}" vào giỏ hàng!`);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Không thể thêm vào giỏ!";
      showError(msg);
    }
  };

  if (loading) return <p className="text-center mt-10">Đang tải...</p>;
  if (!product)
    return (
      <p className="text-center mt-10 text-red-500">Không tìm thấy sản phẩm.</p>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="col-span-full -mb-4">
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          ← Quay lại
        </Button>
      </div>

      {/* Ảnh sản phẩm */}
      <div>
        <img
          src={getImageUrl(product.HinhAnh)}
          alt={product.TenSP}
          className="w-full h-auto rounded-lg shadow-md object-cover"
          onError={(e) => (e.currentTarget.src = "/no-image.png")}
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
                  {Number(product.GiaSauGiam).toLocaleString("vi-VN", {
                    maximumFractionDigits: 0,
                  })}
                  ₫
                </span>
                <span className="text-gray-500 line-through">
                  {Number(product.GiaBan).toLocaleString("vi-VN", {
                    maximumFractionDigits: 0,
                  })}
                  ₫
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Tiết kiệm:{" "}
                <span className="text-green-600 font-semibold">
                  {Number(product.GiaBan - product.GiaSauGiam).toLocaleString(
                    "vi-VN"
                  )}
                  ₫
                </span>
              </p>
            </div>
          ) : (
            <span className="text-2xl text-green-700 font-bold">
              {product.GiaBan.toLocaleString("vi-VN", {
                maximumFractionDigits: 0,
              })}
              ₫
            </span>
          )}
        </div>

        {/* Số lượng + Nút thêm vào giỏ + Mua ngay */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Số lượng */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700">Số lượng:</label>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-bold"
                disabled={quantity <= 1}
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

          {/* Thêm vào giỏ hàng – DÙNG API THẬT */}
          <Button
            className="w-full bg-green-600 text-white hover:bg-green-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-transform active:scale-95"
            onClick={handleAddToCart}
            disabled={product.SoLuongTon === 0}
          >
            <FaShoppingCart className="text-lg" />
            Thêm vào giỏ hàng
          </Button>

          {/* MUA NGAY – KHÔNG THÊM VÀO GIỎ HÀNG THẬT */}
          <Button
            className="w-full bg-orange-600 text-white hover:bg-orange-700 py-3 rounded-lg font-semibold transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-2"
            onClick={() => {
              if (!product) return;

              if (!user?.id) {
                alert("Vui lòng đăng nhập để mua ngay!");
                navigate("/login");
                return;
              }

              if (product.SoLuongTon === 0) {
                showError("Sản phẩm đã hết hàng!");
                return;
              }

              // 🧹 Xóa hoàn toàn dữ liệu cũ
              localStorage.removeItem("cart_checkout");

              // 🕒 Đảm bảo xóa xong rồi mới ghi (đồng bộ)
              setTimeout(() => {
                const buyNowItem = {
                  MaSP: product.MaSP,
                  id: product.MaSP,
                  name: product.TenSP,
                  price: product.GiaSauGiam || product.GiaBan,
                  GiaBan: product.GiaBan,
                  hinhAnh: product.HinhAnh,
                  quantity: quantity,
                  checked: true,
                  buyNow: true, // ✅ cờ quan trọng
                };

                localStorage.setItem(
                  "cart_checkout",
                  JSON.stringify([buyNowItem])
                );

                showSuccess("Đang chuyển đến thanh toán...");
                navigate("/checkout");
              }, 50);
            }}
            disabled={product.SoLuongTon === 0}
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
          />
        </div>
      </div>
    </div>
  );
}
