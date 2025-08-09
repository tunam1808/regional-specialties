import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import banner_child_one from "@/assets/images/lapxuong.jpg";
import banner_child_two from "@/assets/images/cudo.png";
import banner_child_three from "@/assets/images/banh-duc-la-dua.jpg";

const slides = [
  { id: 1, image: banner_child_one, alt: "Lạp xưởng" },
  { id: 2, image: banner_child_two, alt: "Bánh cu đơ" },
  { id: 3, image: banner_child_three, alt: "Bánh đúc lá dứa" },
];

export default function BannerSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle manual navigation
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full max-w-[1300px] mx-auto h-[500px] overflow-hidden group mt-15">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <img
            key={slide.id}
            src={slide.image}
            alt={slide.alt}
            className="w-full h-[500px] object-cover flex-shrink-0"
          />
        ))}
      </div>
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-600 bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition opacity-0 group-hover:opacity-100 cursor-pointer"
      >
        <ChevronLeft size={30} />
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-600 bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition opacity-0 group-hover:opacity-100 cursor-pointer"
      >
        <ChevronRight size={30} />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
