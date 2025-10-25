import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaChevronDown } from "react-icons/fa";
import Banhdauxanh from "@/assets/images/img-produce/Banh-dau-xanh.jpg";
import Comchay from "@/assets/images/img-produce/com_chay.png";
import Banhsua from "@/assets/images/img-produce/banh-sua-non-moc-chau.jpg";
import Cakho from "@/assets/images/img-produce/ca_kho.png";
import Che from "@/assets/images/img-produce/che.png";
import Comlam from "@/assets/images/img-produce/Comlam.webp";
import Chamuc from "@/assets/images/img-produce/cha_muc.png";
import Mangtruc from "@/assets/images/img-produce/Mang-truc.jpg";
import Banhda from "@/assets/images/img-produce/banhda-kienkhe.png";
import Banhdacua from "@/assets/images/img-produce/banhdacua.png";
import Banhmicay from "@/assets/images/img-produce/banhmicay.jpg";
import buncarodong from "@/assets/images/img-produce/bunca-rodong.png";
import Buncha from "@/assets/images/img-produce/buncha.png";
import Gadoi from "@/assets/images/img-produce/ga-doi.png";
import Hatde from "@/assets/images/img-produce/hatde.jpeg";
import Khaunhuc from "@/assets/images/img-produce/khau-nhuc.png";
import Phohanoi from "@/assets/images/img-produce/pho.png";
import Ruoucan from "@/assets/images/img-produce/ruoucancan.jpg";
import Thittrau from "@/assets/images/img-produce/thit_trau.jpeg";
import Xoisacmau from "@/assets/images/img-produce/xoi-sac-mau.jpg";
import Comhanoi from "@/assets/images/img-produce/com_hanoi.jpeg";
import Lonquay from "@/assets/images/img-produce/heo-quay.jpg";
import Banhphuthe from "@/assets/images/img-produce/banhxuxue.jpg";
import Hongtreogio from "@/assets/images/img-produce/hongtreogio.jpg";
import Longnhan from "@/assets/images/img-produce/long-nhan-hung-yen.png";
import Mackhen from "@/assets/images/img-produce/mac-khen.jpg";
import Muckho from "@/assets/images/img-produce/muc-kho-ha-long.jpg";
import Omaiman from "@/assets/images/img-produce/o-mai-man-ha-noi.png";
import Banhcay from "@/assets/images/img-produce/banh-cay.jpg";
import Canhsan from "@/assets/images/img-produce/Canhrausan.webp";
import Chaolong from "@/assets/images/img-produce/chaolong.jpg";
import Thitchua from "@/assets/images/img-produce/thit-chua-phu-tho.jpg";

interface Product {
  id: number;
  name: string;
  image: string;
  region: string;
  type: string;
  price: string;
}

const Products = () => {
  const [selectedRegion, setSelectedRegion] = useState("Tất cả");
  const [openRegion, setOpenRegion] = useState<string | null>(null);
  const [subCategory, setSubCategory] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [isSticky, setIsSticky] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30); // Mặc định là desktop

  const regions = [
    { name: "Bắc", sub: ["Tại chỗ", "khô"] },
    { name: "Trung", sub: ["Tại chỗ", "khô"] },
    { name: "Nam", sub: ["Tại chỗ", "khô"] },
  ];

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

  const products: Product[] = [
    // Danh sách sản phẩm giữ nguyên, không thay đổi
    {
      id: 1,
      name: "Lợn quay ",
      image: Lonquay,
      region: "Bắc",
      type: "Tại chỗ",
      price: "155.000đ/đĩa",
    },
    {
      id: 2,
      name: "Bánh Đậu Xanh",
      image: Banhdauxanh,
      region: "Bắc",
      type: "khô",
      price: "40.000đ/hộp",
    },
    {
      id: 3,
      name: "Bánh sữa Mộc Châu",
      image: Banhsua,
      region: "Bắc",
      type: "khô",
      price: "30.000đ/hộp",
    },
    {
      id: 4,
      name: "Cơm cháy Ninh Bình",
      image: Comchay,
      region: "Bắc",
      type: "khô",
      price: "35.000đ/hộp",
    },
    {
      id: 5,
      name: "Chè Thái Nguyên",
      image: Che,
      region: "Bắc",
      type: "khô",
      price: "35.000đ/hộp",
    },
    {
      id: 6,
      name: "Chả mực Hạ Long",
      image: Chamuc,
      region: "Bắc",
      type: "Tại chỗ",
      price: "60.000đ/đĩa",
    },
    {
      id: 7,
      name: "Cốm Hà Nội",
      image: Comhanoi,
      region: "Bắc",
      type: "khô",
      price: "30.000đ/hộp",
    },
    {
      id: 8,
      name: "Bánh mì cay Hải Phòng",
      image: Banhmicay,
      region: "Bắc",
      type: "Tại chỗ",
      price: "5.000đ/cái",
    },
    {
      id: 9,
      name: "Cơm Lam",
      image: Comlam,
      region: "Bắc",
      type: "Tại chỗ",
      price: "60.000đ/bó",
    },
    {
      id: 10,
      name: "Cá kho",
      image: Cakho,
      region: "Bắc",
      type: "Tại chỗ",
      price: "60.000đ/đĩa",
    },
    {
      id: 11,
      name: "Thịt trâu gác bếp",
      image: Thittrau,
      region: "Bắc",
      type: "khô",
      price: "600.000đ/hộp",
    },
    {
      id: 12,
      name: "Hạt dẻ",
      image: Hatde,
      region: "Bắc",
      type: "khô",
      price: "80.000đ/hộp",
    },
    {
      id: 13,
      name: "Xôi sắc màu",
      image: Xoisacmau,
      region: "Bắc",
      type: "Tại chỗ",
      price: "60.000đ/đĩa",
    },
    {
      id: 14,
      name: "Rượu cần",
      image: Ruoucan,
      region: "Bắc",
      type: "khô",
      price: "120.000đ/bình",
    },
    {
      id: 15,
      name: "Gà đồi",
      image: Gadoi,
      region: "Bắc",
      type: "Tại chỗ",
      price: "150.000đ/đĩa",
    },
    {
      id: 16,
      name: "Khâu nhục Lạng sơn",
      image: Khaunhuc,
      region: "Bắc",
      type: "Tại chỗ",
      price: "200.000đ/tô",
    },
    {
      id: 17,
      name: "Bún chả Hà Nội",
      image: Buncha,
      region: "Bắc",
      type: "Tại chỗ",
      price: "60.000đ/tô",
    },
    {
      id: 18,
      name: "Phở Hà Nội",
      image: Phohanoi,
      region: "Bắc",
      type: "Tại chỗ",
      price: "40.000đ/tô",
    },
    {
      id: 19,
      name: "Bún cá rô đồng",
      image: buncarodong,
      region: "Bắc",
      type: "Tại chỗ",
      price: "60.000đ/tô",
    },
    {
      id: 20,
      name: "Bánh Đa",
      image: Banhda,
      region: "Bắc",
      type: "khô",
      price: "20.000đ/cái",
    },
    {
      id: 21,
      name: "Măng trúc",
      image: Mangtruc,
      region: "Bắc",
      type: "khô",
      price: "50.000đ/hộp",
    },
    {
      id: 22,
      name: "Bánh đa cua Hải Phòng",
      image: Banhdacua,
      region: "Bắc",
      type: "Tại chỗ",
      price: "50.000đ/tô",
    },
    {
      id: 23,
      name: "Mực khô Hải Phòng",
      image: Muckho,
      region: "Bắc",
      type: "khô",
      price: "400.000đ/kg",
    },
    {
      id: 24,
      name: "Hồng treo gió",
      image: Hongtreogio,
      region: "Bắc",
      type: "khô",
      price: "160.000đ/kg",
    },
    {
      id: 25,
      name: "Bánh phu thê Bắc Ninh",
      image: Banhphuthe,
      region: "Bắc",
      type: "khô",
      price: "8.000đ/cái",
    },
    {
      id: 26,
      name: "Long nhãn Hưng Yên",
      image: Longnhan,
      region: "Bắc",
      type: "khô",
      price: "50.000đ/hộp",
    },
    {
      id: 27,
      name: "Bánh cáy Thái Bình",
      image: Banhcay,
      region: "Bắc",
      type: "khô",
      price: "40.000đ/hộp",
    },
    {
      id: 28,
      name: "Mắc khén Tây Bắc",
      image: Mackhen,
      region: "Bắc",
      type: "khô",
      price: "40.000đ/kg",
    },
    {
      id: 29,
      name: "Mận sấy",
      image: Omaiman,
      region: "Bắc",
      type: "khô",
      price: "60.000đ/hộp",
    },
    {
      id: 30,
      name: "Cháo lòng",
      image: Chaolong,
      region: "Bắc",
      type: "Tại chỗ",
      price: "30.000đ/tô",
    },
    {
      id: 31,
      name: "Canh rau sắn muối chua",
      image: Canhsan,
      region: "Bắc",
      type: "Tại chỗ",
      price: "50.000đ/tô",
    },
    {
      id: 32,
      name: "Thịt chua Phú Thọ",
      image: Thitchua,
      region: "Bắc",
      type: "Tại chỗ",
      price: "50.000đ/đĩa",
    },
    {
      id: 33,
      name: "Phở Hà Nội",
      image: Phohanoi,
      region: "Bắc",
      type: "Tại chỗ",
      price: "40.000đ/tô",
    },
    {
      id: 34,
      name: "Bún cá rô đồng",
      image: buncarodong,
      region: "Bắc",
      type: "Tại chỗ",
      price: "60.000đ/tô",
    },
    {
      id: 35,
      name: "Bánh Đa",
      image: Banhda,
      region: "Bắc",
      type: "khô",
      price: "20.000đ/cái",
    },
    {
      id: 36,
      name: "Măng trúc",
      image: Mangtruc,
      region: "Bắc",
      type: "khô",
      price: "50.000đ/hộp",
    },
    {
      id: 37,
      name: "Bánh đa cua Hải Phòng",
      image: Banhdacua,
      region: "Bắc",
      type: "Tại chỗ",
      price: "50.000đ/tô",
    },
    {
      id: 38,
      name: "Phở Hà Nội",
      image: Phohanoi,
      region: "Bắc",
      type: "Tại chỗ",
      price: "40.000đ/tô",
    },
    {
      id: 39,
      name: "Bún cá rô đồng",
      image: buncarodong,
      region: "Bắc",
      type: "Tại chỗ",
      price: "60.000đ/tô",
    },
    {
      id: 40,
      name: "Bánh Đa",
      image: Banhda,
      region: "Bắc",
      type: "khô",
      price: "20.000đ/cái",
    },
    {
      id: 41,
      name: "Măng trúc",
      image: Mangtruc,
      region: "Bắc",
      type: "khô",
      price: "50.000đ/hộp",
    },
    {
      id: 42,
      name: "Bánh đa cua Hải Phòng",
      image: Banhdacua,
      region: "Bắc",
      type: "Tại chỗ",
      price: "50.000đ/tô",
    },
    {
      id: 43,
      name: "Phở Hà Nội",
      image: Phohanoi,
      region: "Bắc",
      type: "Tại chỗ",
      price: "40.000đ/tô",
    },
    {
      id: 44,
      name: "Bún cá rô đồng",
      image: buncarodong,
      region: "Bắc",
      type: "Tại chỗ",
      price: "60.000đ/tô",
    },
    {
      id: 45,
      name: "Bánh Đa",
      image: Banhda,
      region: "Bắc",
      type: "khô",
      price: "20.000đ/cái",
    },
    {
      id: 46,
      name: "Măng trúc",
      image: Mangtruc,
      region: "Bắc",
      type: "khô",
      price: "50.000đ/hộp",
    },
    {
      id: 47,
      name: "Bánh đa cua Hải Phòng",
      image: Banhdacua,
      region: "Bắc",
      type: "Tại chỗ",
      price: "50.000đ/tô",
    },
    {
      id: 48,
      name: "Mì Quảng",
      image: "https://picsum.photos/200/200?3",
      region: "Trung",
      type: "Tại chỗ",
      price: "40.000đ/tô",
    },
    {
      id: 49,
      name: "Tré Bà Đệ",
      image: "https://picsum.photos/200/200?4",
      region: "Trung",
      type: "khô",
      price: "60.000đ/cặp",
    },
    {
      id: 50,
      name: "Bánh Canh Cua",
      image: "https://picsum.photos/200/200?5",
      region: "Nam",
      type: "Tại chỗ",
      price: "50.000đ/tô",
    },
    {
      id: 51,
      name: "Kẹo Dừa Bến Tre",
      image: "https://picsum.photos/200/200?6",
      region: "Nam",
      type: "khô",
      price: "50.000đ/hộp",
    },
  ];

  // Lọc sản phẩm
  let filteredProducts = products;
  if (selectedRegion !== "Tất cả") {
    filteredProducts = products.filter((p) => p.region === selectedRegion);
    if (subCategory)
      filteredProducts = filteredProducts.filter((p) => p.type === subCategory);
  }

  // Tính toán phân trang
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset về trang 1 khi thay đổi vùng hoặc danh mục con
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRegion, subCategory]);

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn lên đầu trang
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 relative" ref={dropdownRef}>
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
      <div className="flex md:hidden absolute top-20 left-0 right-0 bg-white shadow-sm px-3 py-3 justify-start gap-5 z-20 overflow-x-auto">
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
              Miền {r.name}
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
                src={product.image}
                alt={product.name}
                className="w-full h-40 md:h-48 object-cover"
              />
              <div className="p-3 md:p-4">
                <h3 className="font-semibold text-sm md:text-lg mb-1 md:mb-2">
                  {product.name}
                </h3>
                <p className="text-slate-700 text-sm mb-2">{product.price}</p>
                <button className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg hover:bg-slate-800 text-sm">
                  Mua ngay
                </button>
              </div>
            </div>
          ))}
        </div>

        {currentProducts.length === 0 && (
          <p className="text-gray-500 mt-8 text-center">
            Không có sản phẩm nào phù hợp.
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
