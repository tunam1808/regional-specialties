// Đây là phần header

import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "@/assets/images/img-head-foot/logo.png";
import search from "@/assets/icons/search.svg";

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-white shadow-sm transform transition-transform duration-500 overflow-x-hidden ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="w-full max-w-[1280px] mx-auto px-4 flex items-center justify-between h-20 overflow-x-hidden">
        {/* Logo */}
        <NavLink to="/">
          <img
            src={logo}
            alt="Logo"
            className="h-20 object-contain cursor-pointer"
          />
        </NavLink>

        {/* Nav links - ẩn trên mobile */}
        <nav className="hidden md:flex items-center gap-4 text-base">
          {[
            { to: "/", label: "Trang chủ" },
            { to: "/products", label: "Sản phẩm" },
            { to: "/news", label: "Tin tức" },
            { to: "/about", label: "Về chúng tôi" },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-1 rounded-3xl transition ${
                  isActive
                    ? "bg-slate-700 text-white border"
                    : "text-gray-500 hover:text-black"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Search + Login - ẩn trên mobile */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative w-full max-w-[300px]">
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

        {/* Hamburger button - chỉ hiện trên mobile */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <nav className="flex flex-col p-4 space-y-3">
            {[
              { to: "/", label: "Trang chủ" },
              { to: "/products", label: "Sản phẩm" },
              { to: "/news", label: "Tin tức" },
              { to: "/about", label: "Về chúng tôi" },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md transition ${
                    isActive
                      ? "bg-slate-700 text-white border"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Search và Login trong mobile menu */}
            <div className="mt-4">
              <div className="relative w-full">
                <img
                  src={search}
                  alt="search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70"
                />
                <Input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-full mb-3 pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button
                variant="default"
                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition cursor-pointer"
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
              >
                Đăng nhập
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
