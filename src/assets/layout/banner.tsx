import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // cần nếu bạn dùng React Router
import banner_child_one from "@/assets/images/images-home/lapxuong.jpg";
import banner_child_two from "@/assets/images/images-home/cudo.png";
import banner_child_three from "@/assets/images/images-home/banh-duc-la-dua.jpg";

import banner_child_four from "@/assets/images/images-home/com.jpg";
import banner_child_five from "@/assets/images/images-home/nem.jpg";
import banner_child_six from "@/assets/images/images-home/keo.png";
import banner_child_seven from "@/assets/images/images-home/bacthang.webp";
import banner_child_eight from "@/assets/images/images-home/huê.jpg";
import banner_child_nine from "@/assets/images/images-home/benthanh.jpg";

import banner_child_ten from "@/assets/images/images-home/HANOI.jpg";
import banner_child_hi from "@/assets/images/images-home/Du-lich-mien-Nam-thang-1-2.jpg";
import banner_child_ha from "@/assets/images/images-home/thuyen.jpg";

// Kiểu dữ liệu cho banner
interface BannerType {
  id: number;
  bg: string;
  bgBlur: string;
  link: string; // đường dẫn đến trang sản phẩm
  title: string; // tên sản phẩm/đặc sản
}

export default function Banner() {
  const navigate = useNavigate();

  const banners: BannerType[] = [
    { id: 1, bg: banner_child_one, bgBlur: banner_child_seven, link: "/products", title: "Lạp Xưởng" },
    { id: 2, bg: banner_child_two, bgBlur: banner_child_eight, link: "/products", title: "Cù Đơ" },
    { id: 3, bg: banner_child_three, bgBlur: banner_child_nine, link: "/products", title: "Bánh Đúc Lá Dứa" },
    { id: 4, bg: banner_child_four, bgBlur: banner_child_ten, link: "/products", title: "Cốm Hà Nội" },
    { id: 5, bg: banner_child_five, bgBlur: banner_child_hi, link: "/products", title: "Nem Chua" },
    { id: 6, bg: banner_child_six, bgBlur: banner_child_ha, link: "/products", title: "Kẹo Dừa" },
  ];

  const [active, setActive] = useState<BannerType>(banners[0]);
  const [fade, setFade] = useState(true);

  // Xử lý khi click thumbnail
  const handleChangeBanner = (banner: BannerType) => {
    if (banner.id === active.id) return;
    setFade(false);
    setTimeout(() => {
      setActive(banner);
      setFade(true);
    }, 300);
  };

  // 🕒 Tự động chuyển banner sau 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setActive((prev) => {
          const nextIndex = (banners.findIndex((b) => b.id === prev.id) + 1) % banners.length;
          return banners[nextIndex];
        });
        setFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 👉 Khi click banner chính => sang trang sản phẩm
  const handleClickBanner = () => {
    navigate(active.link);
  };

  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center justify-center py-5 px-4 mt-20">
      {/* Nền mờ */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <img
          src={active.bgBlur}
          alt="background blur"
          className="w-full h-auto opacity-90 blur-sm scale-105 transition-all duration-700 object-cover"
        />
      </div>

      {/* Banner chính */}
      <div
        onClick={handleClickBanner}
        className={`relative z-10 aspect-video bg-cover bg-center rounded-2xl shadow-2xl border-4 border-white/20 cursor-pointer transition-opacity duration-500 ${
          fade ? "opacity-100" : "opacity-0"
        } hover:scale-[1.02] transform transition-transform`}
        style={{
          backgroundImage: `url(${active.bg})`,
          width: "clamp(220px, 55%, 800px)",
        }}
      >
        {/* Text quảng cáo */}
        <div className="absolute inset-0 bg-black/25 rounded-2xl flex items-center justify-center">
          <p className="text-white text-lg md:text-2xl font-semibold drop-shadow-lg">
            Khám phá đặc sản {active.title}
          </p>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-6 w-full flex justify-center flex-wrap gap-3 px-2 z-20">
        {banners.map((banner) => (
          <img
            key={banner.id}
            src={banner.bg}
            alt={`banner thumbnail ${banner.id}`}
            className={`object-cover rounded-lg cursor-pointer border transition-all duration-300 ${
              active.id === banner.id
                ? "border-2 border-orange-500 scale-110"
                : "border-transparent hover:scale-105"
            }`}
            style={{
              width: "clamp(40px, 8vw, 80px)",
              height: "clamp(28px, 5vw, 60px)",
            }}
            onClick={() => handleChangeBanner(banner)}
          />
        ))}
      </div>
    </div>
  );
}
