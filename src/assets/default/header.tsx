// components/Header.tsx
import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { FaBars, FaTimes } from "react-icons/fa";
import type { User } from "@/types/register-login-logout.type"; // Định nghĩa kiểu cho fullname và avatar
import logo from "@/assets/images/img-head-foot/logo.png";
import search from "@/assets/icons/search.svg";
import avt from "@/assets/images/default.jpg";

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
        setDropdownOpen(false); // scroll xuống thì ẩn dropdown
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-white shadow-sm transform transition-transform duration-500 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="w-full max-w-[1380px] mx-auto px-4 flex items-center h-20">
        {/* Logo */}
        <NavLink to="/">
          <img
            src={logo}
            alt="Logo"
            className="h-20 object-contain cursor-pointer"
          />
        </NavLink>

        {/* Nav + Search */}
        <div className="hidden md:flex items-center gap-6 ml-64 flex-1">
          <nav className="flex items-center gap-4 text-base">
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

          {/* Search box */}
          <div className="relative w-full max-w-[280px] ml-4">
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
        </div>

        {/* User/Login */}
        <div className="hidden md:flex items-center gap-4 ml-6">
          {user ? (
            <div className="relative">
              <button
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={user.avatar || avt}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-medium max-w-[160px] truncate">
                  {user.fullname}
                </span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 border z-50">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      navigate("/account-infor");
                      setDropdownOpen(false);
                    }}
                  >
                    Thông tin tài khoản
                  </button>
                  {user?.role === "admin" && (
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-600"
                      onClick={() => {
                        navigate("/manage-page");
                        setDropdownOpen(false);
                      }}
                    >
                      Trang quản lý
                    </button>
                  )}
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      navigate("/orders");
                      setDropdownOpen(false);
                    }}
                  >
                    Đơn hàng của bạn
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="default"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </Button>
          )}
        </div>

        {/* Hamburger button - mobile */}
        <button
          className="md:hidden p-2 ml-auto"
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

            {/* Search và User/Login trong mobile */}
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
              {user ? (
                <div className="relative">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <img
                      src={user?.avatar || avt}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="max-w-[240px] truncate">
                      {user?.fullname}
                    </span>
                  </div>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 border z-50">
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          navigate("/account-infor");
                          setDropdownOpen(false);
                        }}
                      >
                        Thông tin tài khoản
                      </button>
                      {user?.role === "admin" && (
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-600"
                          onClick={() => {
                            navigate("/manage-page");
                            setDropdownOpen(false);
                          }}
                        >
                          Trang quản lý
                        </button>
                      )}
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          navigate("/orders");
                          setDropdownOpen(false);
                        }}
                      >
                        Đơn hàng của bạn
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                        onClick={handleLogout}
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="default"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
