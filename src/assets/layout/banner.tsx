// Đây là section các ảnh banner nằm trong trang chủ
import { useState } from "react";
import banner_child_one from "@/assets/images/images-home/lapxuong.jpg";
import banner_child_two from "@/assets/images/images-home/cudo.png";
import banner_child_three from "@/assets/images/images-home/banh-duc-la-dua.jpg";

// Định nghĩa kiểu cho banner
interface BannerType {
  id: number;
  bg: string;
}

export default function Banner() {
  const banners: BannerType[] = [
    { id: 1, bg: banner_child_one },
    { id: 2, bg: banner_child_two },
    { id: 3, bg: banner_child_three },
  ];

  const [active, setActive] = useState<BannerType>(banners[0]);
  const [fade, setFade] = useState(true);

  const handleChangeBanner = (banner: BannerType) => {
    if (banner.id === active.id) return;
    setFade(false); // Bắt đầu ẩn
    setTimeout(() => {
      setActive(banner);
      setFade(true); // Hiện lại
    }, 300); // 300ms trùng với thời gian transition
  };

  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center justify-center py-5 px-4 mt-20">
      {/* Background mờ nhạt */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <img
          src={active.bg}
          alt="background blur"
          className="w-full h-auto opacity-70 blur-md scale-105 transition-all duration-700 object-cover"
        />
      </div>

      {/* Banner chính */}
      <div
        className={`relative z-10 aspect-video bg-cover bg-center rounded-2xl shadow-2xl border-4 border-white/20 transition-opacity duration-500 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: `url(${active.bg})`,
          width: "clamp(220px, 55%, 800px)",
        }}
      ></div>

      {/* Thumbnails */}
      <div className="mt-6 w-full flex justify-center flex-wrap gap-3 px-2 z-20">
        {banners.map((banner) => (
          <img
            key={banner.id}
            src={banner.bg}
            alt="banner thumbnail"
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
