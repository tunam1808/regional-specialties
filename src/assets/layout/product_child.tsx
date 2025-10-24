import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Banhdauxanh from "@/assets/images/img-produce/Banh-dau-xanh.jpg"
import Comchay from "@/assets/images/img-produce/com_chay.png"
import Banhsua from "@/assets/images/img-produce/banh-sua-non-moc-chau.jpg"
import Cakho from "@/assets/images/img-produce/ca_kho.png"
import Che from "@/assets/images/img-produce/che.png"
import Comlam from "@/assets/images/img-produce/Comlam.webp"
import Chamuc from "@/assets/images/img-produce/cha_muc.png"
import Mangtruc from "@/assets/images/img-produce/Mang-truc.jpg"
import Banhda from "@/assets/images/img-produce/banhda-kienkhe.png"
import Banhdacua from "@/assets/images/img-produce/banhdacua.png"
import Banhmicay from "@/assets/images/img-produce/banhmicay.jpg"
import buncarodong from "@/assets/images/img-produce/bunca-rodong.png"
import Buncha from "@/assets/images/img-produce/buncha.png"
import Gadoi from "@/assets/images/img-produce/ga-doi.png"
import Hatde from "@/assets/images/img-produce/hatde.jpeg"
import Khaunhuc from "@/assets/images/img-produce/khau-nhuc.png"
import Phohanoi from "@/assets/images/img-produce/pho.png"
import Ruoucan from "@/assets/images/img-produce/ruoucancan.jpg"
import Thittrau from "@/assets/images/img-produce/thit_trau.jpeg"
import Xoisacmau from "@/assets/images/img-produce/xoi-sac-mau.jpg"
import Comhanoi from "@/assets/images/img-produce/com_hanoi.jpeg"
import Lonquay from "@/assets/images/img-produce/heo-quay.jpg"
import Banhphuthe from "@/assets/images/img-produce/banhxuxue.jpg"
import Hongtreogio from "@/assets/images/img-produce/hongtreogio.jpg"
import Longnhan from "@/assets/images/img-produce/long-nhan-hung-yen.png"
import Mackhen from "@/assets/images/img-produce/mac-khen.jpg"
import Muckho from "@/assets/images/img-produce/muc-kho-ha-long.jpg"
import Omaiman from "@/assets/images/img-produce/o-mai-man-ha-noi.png"
import Banhcay from "@/assets/images/img-produce/banh-cay.jpg"
import Canhsan from "@/assets/images/img-produce/Canhrausan.webp"
import Chaolong from "@/assets/images/img-produce/chaolong.jpg"
import Thitchua from "@/assets/images/img-produce/thit-chua-phu-tho.jpg"


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

  const regions = [
    { name: "Bắc", sub: ["Tại chỗ", "khô"] },
    { name: "Trung", sub: ["Tại chỗ", "khô"] },
    { name: "Nam", sub: ["Tại chỗ", "khô"] },
  ];

  const products: Product[] = [
    { id: 1, name: "Lợn quay ", image:Lonquay , region: "Bắc", type: "Tại chỗ", price: "155.000đ/đĩa" },
    { id: 2, name: "Bánh Đậu Xanh", image: Banhdauxanh , region: "Bắc", type:" khô" , price:" 40.000đ/hộp" },
    { id: 3, name: "Bánh sữa Mộc Châu", image:Banhsua ,region:"Bắc", type:"khô", price: "30.000đ/hộp" },
    { id: 4, name: "Cơm cháy Ninh Bình", image:Comchay , region: "Bắc", type: "khô", price: "35.000đ/hộp" },
    { id: 5, name: "Chè Thái Nguyên", image:Che , region: "Bắc", type: "khô", price: "35.000đ/hộp" },
    { id: 6, name: "Chả mực Hạ Long", image:Chamuc, region: "Bắc", type: "Tại chỗ", price: "60.000đ/đĩa"},
    { id: 7, name: "Cốm Hà Nội", image:Comhanoi, region: "Bắc", type: "Khô", price: "30.000đ/hộp"},
    { id: 8, name: "Bánh mì cay Hải Phòng", image:Banhmicay, region: "Bắc", type: "Tại chỗ", price: "5.000đ/cái"},
    { id: 9, name: "Cơm Lam", image:Comlam, region: "Bắc", type: "Tại chỗ", price: "60.000đ/bó"},
    { id: 10, name: "Cá kho", image:Cakho, region: "Bắc", type: "Tại chỗ", price: "60.000đ/đĩa"},
    { id: 11, name: "Thịt trâu gác bếp", image:Thittrau, region: "Bắc", type: "khô", price: "600.000đ/hộp"},
    { id: 12, name: "Hạt dẻ", image:Hatde, region: "Bắc", type: "khô", price: "80.000đ/hộp"},
    { id: 13, name: "Xôi sắc màu", image:Xoisacmau, region: "Bắc", type: "Tại chỗ", price: "60.000đ/đĩa"},
    { id: 14, name: "Rượu cần", image:Ruoucan, region: "Bắc", type: "khô", price: "120.000đ/bình"},
    { id: 15, name: "Gà đồi", image:Gadoi, region: "Bắc", type: "Tại chỗ", price: "150.000đ/đĩa"},
    { id: 16, name: "Khâu nhục Lạng sơn", image:Khaunhuc, region: "Bắc", type: "Tại chỗ", price: "200.000đ/tô"},
    { id: 17, name: "Bún chả Hà Nội", image:Buncha, region: "Bắc", type: "Tại chỗ", price: "60.000đ/tô"},
    { id: 18, name: "Phở Hà Nội", image: Phohanoi, region: "Bắc", type: "Tại chỗ", price: "40.000đ/tô" },
    { id: 19, name: "Bún cá rô đồng", image: buncarodong, region: "Bắc", type: "Tại chỗ", price: "60.000đ/tô" },
    { id: 20, name: "Bánh Đa", image: Banhda, region: "Bắc", type: "Khô", price: "20.000đ/cái" },
    { id: 21, name: "Măng trúc", image: Mangtruc, region: "Bắc", type: "khô", price: "50.000đ/hộp" },
    { id: 22, name: "Bánh đa cua Hải Phòng", image: Banhdacua, region: "Bắc", type: "Tại chỗ", price: "50.000đ/tô" },
    { id: 23, name: "Mực khô Hải Phòng", image: Muckho, region: "Bắc", type: "khô", price: "400.000đ/kg" },
    { id: 24, name: "Hồng treo gió", image: Hongtreogio, region: "Bắc", type: "khô", price: "160.000đ/kg" },
    { id: 25, name: "Bánh phu thê Bắc Ninh", image: Banhphuthe, region: "Bắc", type: "Khô", price: "8.000đ/cái" },
    { id: 26, name: "Long nhãn Hưng Yên", image: Longnhan, region: "Bắc", type: "khô", price: "50.000đ/hộp" },
    { id: 27, name: "Bánh cáy Thái Bình", image: Banhcay, region: "Bắc", type: "khô", price: "40.000đ/hộp" },
    { id: 28, name: "Mắc khén Tây Bắc", image: Mackhen, region: "Bắc", type: "khô", price: "40.000đ/kg" },
    { id: 29, name: "Mận sấy", image: Omaiman, region: "Bắc", type: "khô", price: "60.000đ/hộp" },
    { id: 30, name: "Cháo lòng", image: Chaolong, region: "Bắc", type: "Tại chỗ", price: "30.000đ/tô" },
    { id: 31, name: "Canh rau sắn muối chua", image: Canhsan, region: "Bắc", type: "Tại chỗ", price: "50.000đ/tô" },
    { id: 32, name: "Thịt chua Phú Thọ", image: Thitchua, region: "Bắc", type: "Tại chỗ", price: "50.000đ/đĩa" },
    { id: 33, name: "Phở Hà Nội", image: Phohanoi, region: "Bắc", type: "Tại chỗ", price: "40.000đ/tô" },
    { id: 34, name: "Bún cá rô đồng", image: buncarodong, region: "Bắc", type: "Tại chỗ", price: "60.000đ/tô" },
    { id: 35, name: "Bánh Đa", image: Banhda, region: "Bắc", type: "Khô", price: "20.000đ/cái" },
    { id: 36, name: "Măng trúc", image: Mangtruc, region: "Bắc", type: "khô", price: "50.000đ/hộp" },
    { id: 37, name: "Bánh đa cua Hải Phòng", image: Banhdacua, region: "Bắc", type: "Tại chỗ", price: "50.000đ/tô" },
    { id: 38, name: "Phở Hà Nội", image: Phohanoi, region: "Bắc", type: "Tại chỗ", price: "40.000đ/tô" },
    { id: 39, name: "Bún cá rô đồng", image: buncarodong, region: "Bắc", type: "Tại chỗ", price: "60.000đ/tô" },
    { id: 40, name: "Bánh Đa", image: Banhda, region: "Bắc", type: "Khô", price: "20.000đ/cái" },
    { id: 41, name: "Măng trúc", image: Mangtruc, region: "Bắc", type: "khô", price: "50.000đ/hộp" },
    { id: 42, name: "Bánh đa cua Hải Phòng", image: Banhdacua, region: "Bắc", type: "Tại chỗ", price: "50.000đ/tô" },
    { id: 43, name: "Phở Hà Nội", image: Phohanoi, region: "Bắc", type: "Tại chỗ", price: "40.000đ/tô" },
    { id: 44, name: "Bún cá rô đồng", image: buncarodong, region: "Bắc", type: "Tại chỗ", price: "60.000đ/tô" },
    { id: 45, name: "Bánh Đa", image: Banhda, region: "Bắc", type: "Khô", price: "20.000đ/cái" },
    { id: 46, name: "Măng trúc", image: Mangtruc, region: "Bắc", type: "khô", price: "50.000đ/hộp" },
    { id: 47, name: "Bánh đa cua Hải Phòng", image: Banhdacua, region: "Bắc", type: "Tại chỗ", price: "50.000đ/tô" },
    { id: 48, name: "Mì Quảng", image: "https://picsum.photos/200/200?3", region: "Trung", type: "Tại chỗ", price: "40.000đ/tô" },
    { id: 49, name: "Tré Bà Đệ", image: "https://picsum.photos/200/200?4", region: "Trung", type: "khô", price: "60.000đ/cặp" },
    { id: 50, name: "Bánh Canh Cua", image: "https://picsum.photos/200/200?5", region: "Nam", type: "Tại chỗ", price: "50.000đ/tô" },
    { id: 51, name: "Kẹo Dừa Bến Tre", image: "https://picsum.photos/200/200?6", region: "Nam", type: "khô", price: "50.000đ/hộp" },
  ];

  let filteredProducts = products;
  if (selectedRegion !== "Tất cả") {
    filteredProducts = products.filter((p) => p.region === selectedRegion);
    if (subCategory) filteredProducts = filteredProducts.filter((p) => p.type === subCategory);
  }

  return (
    <div className="min-h-screen flex bg-gray-50 mt-20">
      {/* Sidebar */}
      <div className="w-1/4 h-screen bg-white p-5 shadow-md fixed top-0 left-0 overflow-y-auto mt-20">
        <h2 className="text-xl font-semibold mb-4">Danh mục sản phẩm</h2>

        {/* Tất cả */}
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

        {/* Các miền */}
        {regions.map((r) => (
          <div key={r.name} className="mb-2">
            <button
              onClick={() => {
                setSelectedRegion(r.name);
                setSubCategory(null);
                setOpenRegion(openRegion === r.name ? null : r.name);
              }}
              className={`flex justify-between items-center w-full text-left px-4 py-2 rounded-md transition ${
                selectedRegion === r.name
                  ? "bg-slate-700 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>Đặc sản miền {r.name}</span>
              {/* Hiệu ứng xoay mũi tên */}
              <FaChevronDown
                size={14}
                className={`transform transition-transform duration-300 ${
                  openRegion === r.name ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {/* Danh mục con */}
            {openRegion === r.name && (
              <div className="ml-6 mt-1">
                {r.sub.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSubCategory(type)}
                    className={`block w-full text-left px-3 py-1 rounded-md mb-1 transition ${
                      subCategory === type
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

      {/* Danh sách sản phẩm */}
      <div className="flex-1 p-6 ml-[25%]">
        <h2 className="text-2xl font-semibold mb-6">
          {selectedRegion === "Tất cả"
            ? "Tất cả sản phẩm"
            : subCategory
            ? `Đặc sản miền ${selectedRegion} - ${subCategory}`
            : `Đặc sản miền ${selectedRegion}`}
        </h2>

        <div className="grid grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-slate-700 mb-2">{product.price}</p>
                <button className="mt-2 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800">
                  Mua ngay
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-gray-500 mt-8">Không có sản phẩm nào phù hợp.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
