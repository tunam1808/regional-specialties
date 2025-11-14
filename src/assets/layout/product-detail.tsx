import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/button";
import { getSanPhamById } from "@/api/product";
import { getProfile } from "@/api/get-profile";
import { addProductToCart } from "@/api/order-detail";
import { showSuccess, showError } from "@/common/toast";
import type { SanPham } from "@/types/product.type";
import { FaShoppingCart } from "react-icons/fa";
import Header from "../default/header";
import Footer from "../default/footer";
import avt from "@/assets/images/default.jpg";
import type { ProductReview } from "@/api/product-review"; // dùng `import type`
import {
  getReviewsByProduct,
  getAverageRating,
  createReview,
} from "@/api/product-review";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<SanPham | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState<{
    avatar: any;
    id: number;
  } | null>(null); // THÊM: kiểm tra đăng nhập
  const navigate = useNavigate();
  const [averageRating, setAverageRating] = useState<{
    average_rating: number;
    total_reviews: number;
  }>({ average_rating: 0, total_reviews: 0 });
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newRating, setNewRating] = useState(5); // điểm sao mặc định 5
  const [newComment, setNewComment] = useState(""); // bình luận mới
  const [submitting, setSubmitting] = useState(false); // trạng thái gửi

  // LẤY USER (đăng nhập chưa?)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getProfile();
        setUser({
          id: profile.id,
          avatar: profile.avatar || avt, // fallback nếu chưa có
        });
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

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      try {
        setReviewsLoading(true);
        const avg = await getAverageRating(Number(id));
        const list = await getReviewsByProduct(Number(id));
        setAverageRating(avg);
        setReviews(list);
      } catch (error) {
        console.error("Lỗi khi lấy đánh giá:", error);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
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
      showError("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      navigate("/login");
      return;
    }

    if (!product?.MaSP) {
      showError("Sản phẩm không hợp lệ!");
      return;
    }

    if ((product.SoLuongTon ?? 0) <= 0) {
      showError("Sản phẩm đã hết hàng!");
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

  const handleSubmitReview = async () => {
    if (!user?.id) {
      showError("Vui lòng đăng nhập để đánh giá!");
      navigate("/login");
      return;
    }

    if (!product?.MaSP) return;

    try {
      setSubmitting(true);
      await createReview({
        MaSP: product.MaSP,
        user_id: user.id,
        rating: newRating,
        comment: newComment,
      });

      showSuccess("Đánh giá đã được gửi!");

      // Lấy lại danh sách review và điểm trung bình
      const avg = await getAverageRating(product.MaSP);
      const list = await getReviewsByProduct(product.MaSP);
      setAverageRating(avg);
      setReviews(list);

      // reset form
      setNewRating(5);
      setNewComment("");
    } catch (error: unknown) {
      console.error(error);
      showError("Gửi đánh giá thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Đang tải...</p>;
  if (!product)
    return (
      <p className="text-center mt-10 text-red-500">Không tìm thấy sản phẩm.</p>
    );

  return (
    <div>
      <div className="mb-18">
        <Header />
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="col-span-full -mb-4">
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            ← Quay lại
          </Button>
        </div>

        <div>
          {/* Ảnh sản phẩm */}
          <img
            src={getImageUrl(product.HinhAnh)}
            alt={product.TenSP}
            className="w-full h-auto rounded-lg shadow-md object-cover"
            onError={(e) => (e.currentTarget.src = "/no-image.png")}
          />

          {/* ===== Phần đánh giá nằm dưới ảnh ===== */}
          <div className="mt-6 border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">Đánh giá sản phẩm</h2>

            {reviewsLoading ? (
              <p>Đang tải đánh giá...</p>
            ) : (
              <>
                <p className="mb-2">
                  ⭐ Điểm trung bình:{" "}
                  {(Number(averageRating.average_rating) || 0).toFixed(1)} / 5 (
                  {averageRating.total_reviews} đánh giá)
                </p>

                {reviews.length === 0 ? (
                  <p>Chưa có đánh giá nào.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {reviews.map((r) => (
                      <div
                        key={r.id}
                        className="border p-3 rounded-lg bg-gray-50"
                      >
                        {/* Username + Avatar */}
                        <div className="flex items-center gap-3 mb-1">
                          <img
                            src={
                              user?.avatar
                                ? `${import.meta.env.VITE_BASE_SERVER}${
                                    user.avatar
                                  }`
                                : avt
                            }
                            alt={r.username}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="font-medium">{r.username}</span>
                        </div>

                        {/* Rating dạng sao */}
                        <div className="flex items-center gap-1 mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < r.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>

                        {/* Comment */}
                        <p className="text-gray-700">
                          {r.comment || "Không có nhận xét"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Form đánh giá mới */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">
              Viết đánh giá của bạn
            </h3>
            <div className="flex items-center mb-2">
              <span className="mr-2">Đánh giá:</span>
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`cursor-pointer text-xl ${
                    i < newRating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setNewRating(i + 1)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              className="w-full border rounded p-2 mb-2"
              placeholder="Viết nhận xét..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleSubmitReview}
              disabled={submitting}
            >
              Gửi đánh giá
            </Button>
          </div>
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
                {Number(product.GiaBan).toLocaleString("vi-VN", {
                  maximumFractionDigits: 0,
                })}{" "}
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
                  showError("Vui lòng đăng nhập để mua ngay!");
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
      <Footer />
    </div>
  );
}
