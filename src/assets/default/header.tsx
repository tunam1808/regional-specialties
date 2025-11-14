// components/Header.tsx
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { FaBars, FaTimes } from "react-icons/fa";
import type { User } from "@/types/register-login-logout.type";
import type { SanPham } from "@/types/product.type";
import { getAllSanPham } from "@/api/product";
import logo from "@/assets/images/img-head-foot/logo.png";
import search from "@/assets/icons/search.svg";
import avt from "@/assets/images/default.jpg";

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SanPham[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // Lấy user
  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Scroll ẩn header
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScrollY && current > 100) {
        setShowHeader(false);
        setDropdownOpen(false);
        setShowResults(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Đăng xuất
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    navigate("/login");
  };

  // Tìm kiếm
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getAllSanPham();
      const filtered = data
        .filter((p) => p.TenSP.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
      setSearchResults(filtered);
      setShowResults(true);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce
  let searchTimeout: NodeJS.Timeout;
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => performSearch(value), 300);
  };

  // Click ngoài → đóng
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-white shadow-sm transition-transform duration-500 ${
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

        {/* Nav + Search Desktop */}
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
                      ? "bg-slate-700 text-white"
                      : "text-gray-500 hover:text-black"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Search Desktop */}
          <div className="relative flex-1 max-w-md ml-4" ref={searchRef}>
            <img
              src={search}
              alt="tìm kiếm"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60"
            />
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery && setShowResults(true)}
              className="w-full pl-12 pr-5 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
            />

            {/* Loading */}
            {loading && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg p-3 border">
                <p className="text-center text-sm text-gray-500">Đang tìm...</p>
              </div>
            )}

            {/* Kết quả - CHỈ HIỂN THỊ TÊN */}
            {showResults && !loading && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <>
                    {searchResults.map((item) => (
                      <div
                        key={item.MaSP}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b flex items-center"
                        onClick={() => {
                          navigate(`/product/${item.MaSP}`);
                          setSearchQuery("");
                          setShowResults(false);
                        }}
                      >
                        <span className="font-medium text-sm truncate flex-1">
                          {item.TenSP}
                        </span>
                      </div>
                    ))}
                    <div
                      className="p-3 text-center text-sm font-medium text-green-600 hover:bg-gray-50 cursor-pointer border-t"
                      onClick={() => {
                        navigate(
                          `/products?search=${encodeURIComponent(searchQuery)}`
                        );
                        setShowResults(false);
                      }}
                    >
                      Xem tất cả kết quả
                    </div>
                  </>
                ) : searchQuery ? (
                  <p className="p-4 text-center text-gray-500 text-sm">
                    Không tìm thấy sản phẩm
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* User/Login Desktop */}
        <div className="hidden md:flex items-center gap-4 ml-6">
          {user ? (
            <div className="relative">
              <button
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={
                    user?.avatar
                      ? `${import.meta.env.VITE_BASE_SERVER}${user.avatar}`
                      : "/default-avatar.jpg"
                  }
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
                      navigate("/cart-page");
                      setDropdownOpen(false);
                    }}
                  >
                    Giỏ hàng
                  </button>
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
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </Button>
          )}
        </div>

        {/* Hamburger Mobile */}
        <button
          className="md:hidden p-2 ml-auto"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
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
                      ? "bg-slate-700 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Search Mobile */}
            <div className="relative w-full px-4" ref={searchRef}>
              <img
                src={search}
                alt="tìm kiếm"
                className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60"
              />
              <Input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowResults(true)}
                className="w-full pl-12 pr-5 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              />

              {showResults && !loading && (
                <div className="mt-2 bg-white rounded-lg shadow-lg border max-h-80 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <div
                        key={item.MaSP}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b"
                        onClick={() => {
                          navigate(`/product/${item.MaSP}`);
                          setSearchQuery("");
                          setShowResults(false);
                          setMenuOpen(false);
                        }}
                      >
                        <p className="font-medium truncate">{item.TenSP}</p>
                      </div>
                    ))
                  ) : searchQuery ? (
                    <p className="p-3 text-center text-gray-500">
                      Không tìm thấy
                    </p>
                  ) : null}
                </div>
              )}
            </div>

            {/* User/Login Mobile */}
            <div className="px-4">
              {user ? (
                <div className="relative">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <img
                      src={
                        user?.avatar
                          ? `${import.meta.env.VITE_BASE_SERVER}${user.avatar}`
                          : avt
                      }
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="max-w-[240px] truncate">
                      {user.fullname}
                    </span>
                  </div>
                  {dropdownOpen && (
                    <div className="mt-2 bg-white shadow-lg rounded-md border">
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          navigate("/account-infor");
                          setDropdownOpen(false);
                          setMenuOpen(false);
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
                            setMenuOpen(false);
                          }}
                        >
                          Trang quản lý
                        </button>
                      )}
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          navigate("/cart-page");
                          setDropdownOpen(false);
                          setMenuOpen(false);
                        }}
                      >
                        Giỏ hàng
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          navigate("/orders");
                          setDropdownOpen(false);
                          setMenuOpen(false);
                        }}
                      >
                        Đơn hàng của bạn
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                        onClick={() => {
                          handleLogout();
                          setMenuOpen(false);
                        }}
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="default"
                  className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
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
