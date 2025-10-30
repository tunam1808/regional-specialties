import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import banner_child_one from "@/assets/images/images-home/lapxuong.jpg";
import banner_child_two from "@/assets/images/images-home/cudo.png";
import banner_child_three from "@/assets/images/images-home/banh-duc-la-dua.jpg";
import banner_child_four from "@/assets/images/images-home/com.jpg";
import banner_child_five from "@/assets/images/images-home/nem.jpg";
import banner_child_six from "@/assets/images/images-home/keo.png";

// Kiểu dữ liệu cho banner
interface BannerType {
  id: number;
  bg: string;
  bgBlur: string;
  link: string;
  title: string;
}

export default function Banner() {
  const navigate = useNavigate();

  const banners: BannerType[] = [
    {
      id: 1,
      bg: banner_child_one,
      bgBlur: banner_child_one,
      link: "/products",
      title: "Lạp Xưởng",
    },
    {
      id: 2,
      bg: banner_child_two,
      bgBlur: banner_child_two,
      link: "/products",
      title: "Cù Đơ",
    },
    {
      id: 3,
      bg: banner_child_three,
      bgBlur: banner_child_three,
      link: "/products",
      title: "Bánh Đúc Lá Dứa",
    },
    {
      id: 4,
      bg: banner_child_four,
      bgBlur: banner_child_four,
      link: "/products",
      title: "Cốm Hà Nội",
    },
    {
      id: 5,
      bg: banner_child_five,
      bgBlur: banner_child_five,
      link: "/products",
      title: "Nem Chua",
    },
    {
      id: 6,
      bg: banner_child_six,
      bgBlur: banner_child_six,
      link: "/products",
      title: "Kẹo Dừa",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  // Chuyển banner tự động
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleClickBanner = () => {
    navigate(banners[activeIndex].link);
  };

  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center justify-center py-5 px-4 mt-20">
      {/* Nền mờ */}
      <div className="absolute inset-0 -z-10">
        <img
          src={banners[activeIndex].bgBlur}
          alt="background blur"
          className="w-full h-full object-cover filter blur-[2px] opacity-80 transition-all duration-1000"
        />
      </div>

      {/* Banner chính */}
      <div
        onClick={handleClickBanner}
        className="relative z-10 aspect-video rounded-2xl shadow-2xl border-4 border-white/20 cursor-pointer overflow-hidden w-full max-w-3xl transition-all duration-1000 transform hover:scale-105"
      >
        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 transform ${
              idx === activeIndex
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-95 -z-10"
            }`}
            style={{ backgroundImage: `url(${banner.bg})` }}
          >
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
              <p className="text-white text-lg md:text-2xl font-semibold drop-shadow-lg text-center px-4">
                Khám phá đặc sản {banner.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Thumbnails */}
      <div className="mt-6 w-full flex justify-center flex-wrap gap-3 px-2 z-20">
        {banners.map((banner, idx) => (
          <img
            key={banner.id}
            src={banner.bg}
            alt={`banner thumbnail ${banner.id}`}
            className={`object-cover rounded-lg cursor-pointer transition-all duration-300 ${
              idx === activeIndex
                ? "border-2 border-orange-500 scale-110"
                : "border-transparent hover:scale-105"
            }`}
            style={{
              width: "clamp(40px, 8vw, 80px)",
              height: "clamp(28px, 5vw, 60px)",
            }}
            onClick={() => setActiveIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
}
