import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { FaChevronDown, FaShoppingCart } from "react-icons/fa";
import { Button } from "@/components/button";
import { getAllSanPham } from "@/api/product";
import type { SanPham, Product } from "@/types/product.type";

const Products = () => {
  const [selectedRegion, setSelectedRegion] = useState("Tất cả");
  const [openRegion, setOpenRegion] = useState<string | null>(null);
  const [subCategory, setSubCategory] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [isSticky, setIsSticky] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30); // Mặc định là desktop
  const navigate = useNavigate();

  const regions = [
    { name: "Bắc", sub: ["Tại chỗ", "Đồ khô"], apiValue: "bac" },
    { name: "Trung", sub: ["Tại chỗ", "Đồ khô"], apiValue: "trung" },
    { name: "Nam", sub: ["Tại chỗ", "Đồ khô"], apiValue: "nam" },
  ];

  // Hàm format giá
  const formatPrice = (price: number, type: string): string => {
    const formattedPrice = price.toLocaleString("vi-VN");
    const unit = type === "Tại chỗ" ? "/đĩa" : "/hộp";
    return `${formattedPrice}đ${unit}`;
  };

  // Chuyển đổi đường dẫn ảnh
  const getImageUrl = (hinhAnh: string | undefined) => {
    if (!hinhAnh) return "/img-produce/default.jpg";
    // Thử ảnh tĩnh trước (localhost:5000/img-produce/)
    const staticImageUrl = hinhAnh; // /img-produce/ten-anh.jpg
    // Nếu ảnh tĩnh không tồn tại, dùng ảnh động (localhost:4000/uploads/)
    const dynamicImageUrl = hinhAnh.replace(
      "/img-produce/",
      "http://localhost:4000/uploads/"
    );
    return staticImageUrl; // Mặc định trả về static, kiểm tra lỗi trong <img>
  };

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const regionApiValue =
          selectedRegion === "Tất cả"
            ? undefined
            : regions.find((r) => r.name === selectedRegion)?.apiValue;
        const subCategoryApiValue =
          subCategory === "Tại chỗ"
            ? "Tại chỗ"
            : subCategory === "Đồ khô"
            ? "Đồ khô"
            : undefined;
        const data = await getAllSanPham(regionApiValue, subCategoryApiValue);
        const formattedProducts: Product[] = data.map((item: SanPham) => ({
          id: item.MaSP || 0,
          name: item.TenSP,
          image: item.HinhAnh || "/img-produce/default.jpg",
          region: item.VungMien || "bac",
          type: item.LoaiDoAn || "Đồ khô",
          price: formatPrice(item.GiaBan, item.LoaiDoAn || "Đồ khô"),
        }));
        setProducts(formattedProducts);
      } catch (err) {
        setError("Không thể tải sản phẩm, xin thử lại sau! (⁠╥⁠﹏⁠╥⁠) :33333");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedRegion, subCategory]);

  // Kiểm tra kích thước màn hình để đặt itemsPerPage
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(20); // Mobile
      } else {
        setItemsPerPage(30); // Desktop
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cập nhật vị trí dropdown khi scroll hoặc resize
  useEffect(() => {
    const updatePosition = () => {
      if (mobileOpen && buttonRefs.current[mobileOpen]) {
        const button = buttonRefs.current[mobileOpen];
        const rect = button.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: Math.min(rect.left, window.innerWidth - 160),
        });
      }
    };

    const handleScroll = () => {
      if (mobileOpen) setMobileOpen(null);
    };

    window.addEventListener("scroll", updatePosition);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updatePosition);

    updatePosition();

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updatePosition);
    };
  }, [mobileOpen]);

  // Xử lý sticky sidebar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tính toán phân trang
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  // Reset về trang 1 khi thay đổi vùng hoặc danh mục con
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRegion, subCategory]);

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 relative" ref={dropdownRef}>
      {/* Trạng thái loading */}
      {loading && (
        <p className="text-center text-gray-500 mt-8">
          Đang tải sản phẩm... (⁠*⁠´⁠ω⁠｀⁠*⁠) :33333
        </p>
      )}
      {/* Trạng thái lỗi */}
      {error && <p className="text-center text-red-500 mt-8">{error}</p>}
      {/* SIDEBAR - desktop */}
      <div
        className={`hidden md:block w-1/4 h-[calc(100vh-5rem)] p-5 fixed left-0 overflow-y-auto transition-all duration-300 ${
          isSticky ? "top-8" : "top-20"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">Danh mục sản phẩm</h2>

        <button
          onClick={() => {
            setSelectedRegion("Tất cả");
            setSubCategory(null);
            setOpenRegion(null);
          }}
          className={`block w-full text-left px-4 py-2 mb-2 rounded-md transition ${
            selectedRegion === "Tất cả"
              ? "bg-slate-700 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Tất cả sản phẩm
        </button>

        {regions.map((r) => (
          <div key={r.name} className="mb-2">
            <button
              onClick={() =>
                setOpenRegion(openRegion === r.name ? null : r.name)
              }
              className={`flex justify-between items-center w-full text-left px-4 py-2 rounded-md transition ${
                selectedRegion === r.name
                  ? "bg-slate-700 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>Đặc sản miền {r.name}</span>
              <FaChevronDown
                size={14}
                className={`transform transition-transform duration-300 ${
                  openRegion === r.name ? "rotate-180" : ""
                }`}
              />
            </button>

            {openRegion === r.name && (
              <div className="ml-6 mt-1">
                {r.sub.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedRegion(r.name);
                      setSubCategory(type);
                    }}
                    className={`block w-full text-left px-3 py-1 rounded-md mb-1 transition ${
                      subCategory === type && selectedRegion === r.name
                        ? "bg-slate-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {type === "Tại chỗ"
                      ? "Sản phẩm sử dụng tại chỗ"
                      : "Sản phẩm khô (mang đi xa)"}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* NAVBAR - mobile */}
      <div className="flex md:hidden absolute top-20 left-0 right-0 bg-white shadow-sm px-3 py-3 justify-center gap-8 z-20 overflow-x-auto">
        <button
          onClick={() => {
            setSelectedRegion("Tất cả");
            setSubCategory(null);
            setMobileOpen(null);
          }}
          className={`font-medium ${
            selectedRegion === "Tất cả"
              ? "text-orange-600"
              : "hover:text-orange-600"
          }`}
        >
          Tất cả
        </button>

        {regions.map((r) => (
          <div key={r.name} className="flex-shrink-0">
            <button
              ref={(el) => {
                buttonRefs.current[r.name] = el;
              }}
              onClick={() => {
                setMobileOpen(mobileOpen === r.name ? null : r.name);
              }}
              className={`flex items-center gap-1 font-medium ${
                selectedRegion === r.name
                  ? "text-orange-600"
                  : "hover:text-orange-600"
              }`}
            >
              {r.name}
              <FaChevronDown
                size={12}
                className={`transform transition-transform duration-300 ${
                  mobileOpen === r.name ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Dropdown con - mobile */}
      {mobileOpen &&
        createPortal(
          <div
            className="md:hidden absolute w-40 max-h-60 overflow-y-auto bg-white rounded-lg shadow-md z-20"
            style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
            ref={dropdownRef}
          >
            {regions
              .find((r) => r.name === mobileOpen)
              ?.sub.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedRegion(mobileOpen);
                    setSubCategory(type);
                    setMobileOpen(null);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {type === "Tại chỗ" ? "Sản phẩm tại chỗ" : "Sản phẩm khô"}
                </button>
              ))}
          </div>,
          document.body
        )}

      {/* MAIN */}
      <div className="flex-1 px-2 md:px-4 py-6 md:ml-[25%] mt-8 md:-mt-2">
        <h2 className="text-2xl font-semibold mb-6">
          {selectedRegion === "Tất cả"
            ? "Tất cả sản phẩm"
            : subCategory
            ? `Đặc sản miền ${selectedRegion} - ${subCategory}`
            : `Đặc sản miền ${selectedRegion}`}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-40 md:h-48 object-cover"
                onError={(e) => {
                  // Nếu ảnh tĩnh lỗi, thử ảnh động
                  e.currentTarget.src = product.image
                    ? product.image.replace(
                        "/img-produce/",
                        "http://localhost:4000/uploads/"
                      )
                    : "/img-produce/default.jpg";
                }}
              />
              <div className="p-3 md:p-4">
                <h3 className="font-semibold text-sm md:text-lg mb-1 md:mb-2">
                  {product.name}
                </h3>
                <p className="text-slate-700 text-sm mb-2">{product.price}</p>
                <div className="flex items-center gap-2">
                  <button className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg hover:bg-slate-800 text-sm">
                    Mua ngay
                  </button>

                  <Button
                    className="bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition"
                    onClick={() => navigate("/cart")}
                  >
                    <FaShoppingCart size={18} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {currentProducts.length === 0 && !loading && (
          <p className="text-gray-500 mt-8 text-center">
            Không có sản phẩm nào phù hợp. (⁠ꏿ⁠﹏⁠ꏿ⁠;⁠) :33333
          </p>
        )}

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-slate-700 text-white hover:bg-slate-800"
              }`}
            >
              Trước
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? "bg-slate-700 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-slate-700 text-white hover:bg-slate-800"
              }`}
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
