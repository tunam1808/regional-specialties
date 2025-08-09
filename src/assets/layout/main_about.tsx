// Đây là phần nội dung chính của trang Về chúng tôi

import { useEffect, useRef } from "react";
import { Button } from "@/components/button";
import Pho from "@/assets/images/images-about/phohanoi.jpg";
import Banh from "@/assets/images/images-about/banhbotloc.jpg";
import BanhXeo from "@/assets/images/images-about/banhxeo.webp";

interface Region {
  name: string;
  description: string;
  image: string;
  reverse?: boolean; // đảo vị trí ảnh & chữ
}

const regions: Region[] = [
  {
    name: "Miền Bắc",
    description:
      "Ẩm thực miền Bắc mang đậm nét thanh đạm, ít dùng gia vị cay nồng hay ngọt gắt, thay vào đó chú trọng sự hài hòa và giữ nguyên hương vị tự nhiên của nguyên liệu. Nổi tiếng phải kể đến phở Hà Nội với nước dùng trong, ngọt thanh, bún chả nướng thơm lừng ăn kèm rau sống, bánh cuốn mỏng mềm chấm nước mắm pha vừa miệng, cốm Làng Vòng xanh mướt, dẻo thơm – món quà mùa thu đặc trưng của Hà Nội, bánh đậu xanh Hải Dương bùi ngọt tan ngay đầu lưỡi, chả mực Hạ Long vàng giòn, thơm nức hay thắng cố vùng Tây Bắc mang hương vị núi rừng độc đáo.",
    image: Pho,
  },
  {
    name: "Miền Trung",
    description:
      "Ẩm thực miền Trung mang hương vị mạnh mẽ, nổi bật với độ cay, mặn và màu sắc rực rỡ. Người dân nơi đây ưa chuộng các món ăn vừa đẹp mắt vừa đậm vị, như mì Quảng vàng óng chan ít nước dùng đậm đà, bún bò Huế thơm nồng sả ớt, bánh bèo chén nhỏ xinh rắc tôm chấy, và nem lụi nướng trên than hồng ăn kèm bánh tráng, rau sống, chấm mắm nêm. Mỗi món ăn đều thể hiện sự khéo léo và tinh tế của con người miền Trung.",
    image: Banh,
    reverse: true,
  },
  {
    name: "Miền Nam",
    description:
      "Ẩm thực miền Nam phản ánh sự trù phú của đồng bằng sông Cửu Long, với nguồn nguyên liệu phong phú và cách chế biến phóng khoáng. Vị ngọt thường hiện diện rõ rệt trong các món ăn, cùng sự kết hợp đa dạng của rau, củ, quả. Đặc sản miền Nam nổi bật với hủ tiếu Nam Vang thanh ngọt, bánh xèo vàng giòn nhân tôm thịt, gỏi cuốn tươi mát chấm mắm nêm hoặc tương đậu phộng, cùng hàng loạt món chè thơm ngon như chè đậu xanh, chè bắp, chè ba màu.",
    image: BanhXeo,
  },
];

export default function Specialties() {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-16 p-6 mt-5">
      {regions.map((region, idx) => (
        <div
          key={idx}
          ref={(el) => {
            sectionsRef.current[idx] = el;
          }}
          className={`flex flex-col md:flex-row items-center md:items-start gap-6 transform transition-all duration-700 ease-out opacity-0 translate-y-10 ${
            region.reverse ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* Ảnh */}
          <div className="w-full md:w-1/2">
            <img
              src={region.image}
              alt={region.name}
              className="w-full h-auto rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Nội dung */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2
              className="text-4xl font-bold mb-4 text-green-700"
              style={{ fontFamily: "'Exo 2', sans-serif" }}
            >
              {region.name}
            </h2>
            <p className="text-gray-700 leading-relaxed text-xl text-justify">
              {region.description}
            </p>
            <div className="w-10 mt-4">
              <Button variant="default" className="p-3">
                Khám phá ngay
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
