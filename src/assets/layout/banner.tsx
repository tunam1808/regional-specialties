import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // cần nếu bạn dùng React Router
import banner_child_one from "@/assets/images/images-home/lapxuong.jpg";
import banner_child_two from "@/assets/images/images-home/cudo.png";
import banner_child_three from "@/assets/images/images-home/banh-duc-la-dua.jpg";

// Kiểu dữ liệu cho banner
interface BannerType {
  id: number;
  bg: string;
  link: string; // đường dẫn đến trang sản phẩm
}

export default function Banner() {
  const navigate = useNavigate();

  const banners: BannerType[] = [
    {
      id: 1,
      bg: banner_child_one,
      link: "/products ", // ví dụ đường dẫn đến sản phẩm
    },
    {
      id: 2,
      bg: banner_child_two,
      link: "/products",
    },
    {
      id: 3,
      bg: banner_child_three,
      link: "/products",
    },
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
      const nextIndex =
        (banners.findIndex((b) => b.id === active.id) + 1) % banners.length;
      setFade(false);
      setTimeout(() => {
        setActive(banners[nextIndex]);
        setFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [active]);

  // 👉 Khi click banner chính => sang trang sản phẩm
  const handleClickBanner = () => {
    navigate(active.link);
  };

  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center justify-center py-5 px-4 mt-20">
      {/* Nền mờ */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <img
          src={active.bg}
          alt="background blur"
          className="w-full h-auto opacity-70 blur-md scale-105 transition-all duration-700 object-cover"
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
        {/* Có thể thêm text quảng cáo nếu muốn */}
        <div className="absolute inset-0 bg-black/25 rounded-2xl flex items-center justify-center">
          <p className="text-white text-lg md:text-2xl font-semibold drop-shadow-lg">
            Khám phá đặc sản {active.id === 1 ? "Lạp Xưởng" : active.id === 2 ? "Cù Đơ" : "Bánh Đúc Lá Dứa"}
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
