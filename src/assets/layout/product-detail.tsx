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
          avatar: avt, // fallback nếu chưa có
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
      // GỌI API THÊM GIỎ (chỉ để backend biết)
      await addProductToCart({
        MaSP: product.MaSP,
        SoLuong: quantity,
        GiaBanTaiThoiDiem: product.GiaSauGiam || product.GiaBan,
        GhiChu: "",
      });

      showSuccess(`Đã thêm "${product.TenSP}" vào giỏ hàng!`);

      // === BẮT ĐẦU LƯU VÀO localStorage (QUAN TRỌNG NHẤT) ===
      const existingCart = JSON.parse(
        localStorage.getItem("cart_checkout") || "[]"
      );

      // Tìm sản phẩm đã có trong giỏ (không tính buyNow)
      const existingItemIndex = existingCart.findIndex(
        (item: any) => item.MaSP === product.MaSP && item.buyNow !== true
      );

      const cartItem = {
        MaSP: product.MaSP,
        id: product.MaSP,
        name: product.TenSP,
        price: product.GiaSauGiam || product.GiaBan,
        GiaBan: product.GiaBan,
        hinhAnh: product.HinhAnh,
        quantity: quantity,
        checked: true,
        buyNow: false,
        LoaiDoAn: product.LoaiDoAn, // ← BẮT BUỘC C&Oacute;
      };

      if (existingItemIndex >= 0) {
        // Nếu đã có → tăng số lượng
        existingCart[existingItemIndex].quantity += quantity;
        // Cập nhật lại LoaiDoAn (đề phòng thay đổi)
        existingCart[existingItemIndex].LoaiDoAn = product.LoaiDoAn || "Đồ khô";
      } else {
        // Nếu chưa có → thêm mới
        existingCart.push(cartItem);
      }

      // LƯU LẠI VÀO localStorage
      localStorage.setItem("cart_checkout", JSON.stringify(existingCart));
      // === KẾT THÚC ===
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Nút quay lại */}
        <div className="mb-6">
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            ← Quay lại
          </Button>
        </div>

        {/* Grid chính */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CỘT 1: ẢNH + ĐÁNH GIÁ + FORM (desktop: form co theo ảnh) */}
          <div className="flex flex-col gap-6 order-1 md:order-1">
            {/* Ảnh sản phẩm */}
            <img
              src={getImageUrl(product.HinhAnh)}
              alt={product.TenSP}
              className="w-full h-auto rounded-lg shadow-md object-cover"
              onError={(e) => (e.currentTarget.src = "/no-image.png")}
            />

            {/* ĐÁNH GIÁ (desktop) */}
            <div className="hidden md:block border-t pt-6">
              <h2 className="text-xl font-semibold mb-3">Đánh giá sản phẩm</h2>
              {reviewsLoading ? (
                <p>Đang tải đánh giá...</p>
              ) : (
                <>
                  <p className="mb-3 text-lg">
                    Điểm trung bình:{" "}
                    <span className="font-bold">
                      {(Number(averageRating.average_rating) || 0).toFixed(1)}
                    </span>{" "}
                    / 5 ({averageRating.total_reviews} đánh giá)
                  </p>

                  {reviews.length === 0 ? (
                    <p className="text-gray-500">Chưa có đánh giá nào.</p>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((r) => (
                        <div
                          key={r.id}
                          className="border p-4 rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <img
                              src={avt}
                              alt={r.username}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                            <span className="font-medium">{r.username}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`text-lg ${
                                  i < r.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <p className="text-gray-700">
                            {r.comment || "Không có nhận xét"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* FORM ĐÁNH GIÁ TRÊN DESKTOP – CO THEO CHIỀU RỘNG ẢNH */}
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold mb-3">
                  Viết đánh giá của bạn
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">Đánh giá:</span>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`cursor-pointer text-2xl ${
                        i < newRating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      onClick={() => setNewRating(i + 1)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  className="w-full border rounded-lg p-3 mb-3 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Viết nhận xét của bạn..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                  onClick={handleSubmitReview}
                  disabled={submitting}
                >
                  {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                </Button>
              </div>
            </div>
          </div>

          {/* CỘT 2: THÔNG TIN + MÔ TẢ */}
          <div className="flex flex-col gap-6 order-3 md:order-2">
            {/* ... giữ nguyên phần thông tin, giá, nút mua ... */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.TenSP}</h1>
              <div className="space-y-2 text-gray-600 mb-4">
                <p>Xuất xứ: {product.XuatXu || "Không rõ"}</p>
                <p>Vùng miền: {product.VungMien}</p>
                <p>Loại: {product.LoaiDoAn}</p>
                <p>Hạn sử dụng: {product.HanSuDung || "Không có"}</p>
              </div>

              <div className="mb-6">
                {product.Voucher && product.GiaSauGiam ? (
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl text-red-600 font-bold">
                        {Number(product.GiaSauGiam).toLocaleString("vi-VN")}₫
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        {Number(product.GiaBan).toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                    <p className="text-sm text-green-600 font-medium mt-1">
                      Tiết kiệm:{" "}
                      {Number(
                        product.GiaBan - product.GiaSauGiam
                      ).toLocaleString("vi-VN")}
                      ₫
                    </p>
                  </div>
                ) : (
                  <span className="text-3xl text-green-700 font-bold">
                    {Number(product.GiaBan).toLocaleString("vi-VN")}₫
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 min-w-20">
                    Số lượng:
                  </label>
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-bold disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      –
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="w-16 text-center py-2 border-x text-lg font-medium focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <Button
                  className="w-full bg-green-600 text-white hover:bg-green-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-transform active:scale-95"
                  onClick={handleAddToCart}
                  disabled={product.SoLuongTon === 0}
                >
                  <FaShoppingCart className="text-lg" />
                  Thêm vào giỏ hàng
                </Button>

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
                    localStorage.removeItem("cart_checkout");
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
                        buyNow: true,
                        LoaiDoAn: product.LoaiDoAn || "Đồ khô",
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
            </div>

            {/* MÔ TẢ */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Mô tả sản phẩm</h2>
              <div
                className="text-gray-700 leading-relaxed text-justify prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: product.MoTa || "Chưa có mô tả cho sản phẩm này.",
                }}
              />
            </div>
          </div>
        </div>

        {/* PHẦN ĐÁNH GIÁ + FORM TRÊN MOBILE (full width) */}
        <div className="md:hidden mt-10 border-t pt-6">
          <h2 className="text-xl font-semibold mb-3">Đánh giá sản phẩm</h2>
          {reviewsLoading ? (
            <p>Đang tải đánh giá...</p>
          ) : (
            <>
              <p className="mb-3 text-lg">
                Điểm trung bình:{" "}
                <span className="font-bold">
                  {(Number(averageRating.average_rating) || 0).toFixed(1)}
                </span>{" "}
                / 5 ({averageRating.total_reviews} đánh giá)
              </p>

              {reviews.length === 0 ? (
                <p className="text-gray-500">Chưa có đánh giá nào.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div
                      key={r.id}
                      className="border p-4 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={avt}
                          alt={r.username}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <span className="font-medium">{r.username}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < r.rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-700">
                        {r.comment || "Không có nhận xét"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Form trên mobile */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">
              Viết đánh giá của bạn
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">Đánh giá:</span>
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`cursor-pointer text-2xl ${
                    i < newRating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setNewRating(i + 1)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              className="w-full border rounded-lg p-3 mb-3 text-sm resize-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Viết nhận xét..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
              onClick={handleSubmitReview}
              disabled={submitting}
            >
              {submitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
