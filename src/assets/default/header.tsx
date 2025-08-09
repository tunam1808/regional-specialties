import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import search from "@/assets/icons/search.svg";
import { Input } from "@/components/input";
import { Button } from "@/components/button";

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false); // Cuộn xuống -> ẩn header
      } else {
        setShowHeader(true); // Cuộn lên -> hiện header
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-white shadow-sm transform transition-transform duration-500 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="w-[80px] h-[80px] object-contain cursor-pointer"
          />
        </Link>

        <nav className="flex items-center gap-15 text-xl">
          <Link to="/" className="text-gray-700 hover:text-blue-500 transition">
            Trang chủ
          </Link>
          <Link
            to="/products"
            className="text-gray-700 hover:text-blue-500 transition"
          >
            Sản phẩm
          </Link>
          <Link
            to="/product"
            className="text-gray-700 hover:text-blue-500 transition"
          >
            Tin tức
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-blue-500 transition"
          >
            Về chúng tôi
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative w-[200px] md:w-[240px] lg:w-[300px]">
            <img
              src={search}
              alt="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70"
            />
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button
            variant="default"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </Button>
        </div>
      </div>
    </header>
  );
}
