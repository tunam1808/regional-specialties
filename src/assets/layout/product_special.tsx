import { Button } from "@/components/button";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { getAllSanPham } from "@/api/product";
import type { SanPham } from "@/types/product.type";
import { showError } from "@/common/toast";

export default function Product_special() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // LẤY 8 SẢN PHẨM BẤT KỲ TỪ CSDL
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const data: SanPham[] = await getAllSanPham();

        const formatted = data.map((item) => {
          const giaSauGiam = item.Voucher
            ? item.GiaBan * (1 - parseFloat(item.Voucher) / 100)
            : item.GiaBan;

          return {
            id: item.MaSP,
            name: item.TenSP,
            description: item.MoTa?.slice(0, 100) + "..." || "Đặc sản nổi bật.",
            price: Math.round(giaSauGiam),
            originalPrice: item.GiaBan,
            image: item.HinhAnh,
          };
        });

        const featured = formatted.slice(0, 8);
        setProducts(featured);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm nổi bật:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleBuyNow = (product: any) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token && !user) {
      showError("Vui lòng đăng nhập để mua hàng!");
      navigate("/login");
      return;
    }

    localStorage.removeItem("cart_checkout");

    setTimeout(() => {
      const buyNowItem = {
        MaSP: product.id,
        id: product.id,
        name: product.name,
        price: product.price,
        GiaBan: product.originalPrice,
        hinhAnh: product.image,
        quantity: 1,
        checked: true,
        buyNow: true,
      };

      localStorage.setItem("cart_checkout", JSON.stringify([buyNowItem]));
      navigate("/checkout");
    }, 50);
  };

  // === HOÀN TOÀN GIỐNG FILE Products.tsx ===
  const getImageUrl = (hinhAnh: string | undefined) => {
    if (!hinhAnh) return "/img-produce/default.jpg";
    if (hinhAnh.startsWith("http")) return hinhAnh;
    if (
      hinhAnh.startsWith("/img-produce") ||
      hinhAnh.startsWith("/img-introduce")
    )
      return hinhAnh;

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
    return `${baseUrl}${hinhAnh}`;
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-600">Đang tải sản phẩm nổi bật...</p>
      </div>
    );
  }

  return (
    <div
      className="bg-cover bg-center bg-no-repeat py-12"
      ref={ref}
      style={{
        backgroundImage:
          "url('https://primeluxe.monamedia.net/wp-content/uploads/2024/08/sec-bg.webp')",
        backgroundColor: "#ECFAFF",
      }}
    >
      {/* Tiêu đề */}
      <motion.span
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex justify-center text-yellow-500 text-2xl mt-2"
        style={{ fontFamily: "'Ga Maamli', sans-serif" }}
      >
        MTN Special
      </motion.span>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex justify-center text-4xl mb-6 mt-2 font-bold"
        style={{ fontFamily: "'Baloo 2', cursive" }}
      >
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div>SẢN PHẨM NỔI BẬT</div>
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
        </div>
      </motion.div>

      {/* Grid sản phẩm */}
      <div className="grid grid-cols-2 gap-4 px-3 md:flex md:justify-center md:gap-8 md:flex-wrap">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -100 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="w-full md:w-60 border rounded-xl shadow hover:shadow-lg hover:-translate-y-3 transition bg-white group"
          >
            {/* Ảnh và nút */}
            <div className="relative overflow-hidden rounded-t-md">
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-60 object-cover transform transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "/img-produce/default.jpg";
                }}
              />
              <Button
                variant="default"
                className="absolute bottom-15 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white font-semibold py-1 px-4 rounded-lg bg-slate-700 hover:bg-slate-800"
                onClick={() => handleBuyNow(product)}
              >
                Mua ngay
              </Button>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="relative bg-[#8d7c8224] h-28 overflow-hidden flex items-center justify-center">
              <div className="text-center transition-all duration-500 transform group-hover:-translate-y-4">
                <p className="font-semibold text-2xl">{product.name}</p>
              </div>
              <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-red-600 font-semibold opacity-0 group-hover:bottom-6 group-hover:opacity-100 transition-all duration-500">
                {product.price.toLocaleString("vi-VN")}₫
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Nút xem tất cả */}
      <div className="flex justify-center mt-7">
        <Link to="/products">
          <Button className="border border-transparent hover:border-amber-600 bg-amber-600 hover:bg-white hover:text-black mb-5">
            Xem tất cả
          </Button>
        </Link>
      </div>
    </div>
  );
}
