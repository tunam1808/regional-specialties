import { useState } from "react";
import BanhCom from "@/assets/images-news/banhcom.jpg";
import BanhChung from "@/assets/images-news/banhchung.jpg";
import ComLangVong from "@/assets/images-news/comlangvong.jpg";
import HoiCho from "@/assets/images-news/hoichotaybac.png";
import KhenMong from "@/assets/images-news/khenmong.jpg";
import SaPa from "@/assets/images-news/sapa.jpg";
import TamGiacMach from "@/assets/images-news/tamgiacmach.jpg";
import HoaPhuongDo from "@/assets/images-news/hoaphuongdo.jpeg";
import BanhIt from "@/assets/images-news/banhit.jpg";
import Vai from "@/assets/images-news/vaithieu.jpg";
import FeHue from "@/assets/images-news/fehue.jpg";
import HoaMan from "@/assets/images-news/hoaman.jpg";
import Hue from "@/assets/images-news/huecodo.jpg";
import MiQuang from "@/assets/images-news/miquang.jpg";
import PhoAmThuc from "@/assets/images-news/danang.jpg";
import FeBien from "@/assets/images-news/phuyen.jpg";
import TraiCay from "@/assets/images-news/traicaynambo.jpg";
import ChoNoi from "@/assets/images-news/chonoi.jpg";
import BanhDanGian from "@/assets/images-news/banhdangian.jpg";
import ChoBenThanh from "@/assets/images-news/chobenthanh.jpg";
import DuaBenTre from "@/assets/images-news/duabentre.jpg";
import ChauDoc from "@/assets/images-news/chaudoc.jpg";
import HoiChoHaNoi from "@/assets/images-news/hoichohanoi.webp";
import AmThucDaNang from "@/assets/images-news/phoamthucdanang.png";
import CaMau from "@/assets/images-news/camau.webp";

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("Tin tức");
  const [activeRegion, setActiveRegion] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ["Tin tức", "Bài viết"];
  const regions = ["Tất cả", "Miền Bắc", "Miền Trung", "Miền Nam"];

  // Dữ liệu tĩnh
  const articles = [
    // Tin tức
    {
      id: 1,
      category: "Tin tức",
      region: "Miền Bắc",
      title: "Hà Nội khai mạc lễ hội bánh cốm truyền thống",
      image: BanhCom,
      content:
        "Lễ hội bánh cốm Mễ Trì thu hút đông đảo du khách trong và ngoài nước đến tham quan và thưởng thức.",
    },
    {
      id: 2,
      category: "Tin tức",
      region: "Miền Bắc",
      title: "Làng nghề làm bánh chưng chuẩn bị cho Tết",
      image: BanhChung,
      content:
        "Người dân làng Tranh Khúc tất bật gói bánh chưng phục vụ thị trường Tết Nguyên Đán.",
    },
    {
      id: 3,
      category: "Tin tức",
      region: "Miền Bắc",
      title: "Hội chợ đặc sản Tây Bắc 2025",
      image: HoiCho,
      content:
        "Hội chợ mang đến nhiều loại đặc sản nổi tiếng như thịt trâu gác bếp, mật ong rừng, táo mèo.",
    },
    {
      id: 4,
      category: "Tin tức",
      region: "Miền Bắc",
      title: "Mùa cốm làng Vòng đã về",
      image: ComLangVong,
      content:
        "Cốm làng Vòng xanh mướt, thơm dịu đã bắt đầu xuất hiện trên khắp các phố phường Hà Nội.",
    },
    {
      id: 5,
      category: "Tin tức",
      region: "Miền Bắc",
      title: "Lễ hội khèn Mông ở Hà Giang",
      image: KhenMong,
      content:
        "Lễ hội khèn Mông thu hút hàng ngàn người dân và du khách đến thưởng thức âm nhạc và văn hóa vùng cao.",
    },
    {
      id: 6,
      category: "Tin tức",
      region: "Miền Bắc",
      title: "Sa Pa bước vào mùa săn mây",
      image: SaPa,
      content:
        "Thị trấn Sa Pa đông đúc khách du lịch đến chụp ảnh và ngắm cảnh mây vờn núi.",
    },
    {
      id: 7,
      category: "Tin tức",
      region: "Miền Bắc",
      title: "Lễ hội hoa Tam giác mạch Hà Giang",
      image: TamGiacMach,
      content:
        "Cánh đồng hoa Tam giác mạch nở rộ tạo nên khung cảnh thơ mộng tuyệt đẹp.",
    },
    {
      id: 8,
      category: "Tin tức",
      region: "Miền Bắc",
      title: "Hải Phòng tổ chức lễ hội Hoa phượng đỏ",
      image: HoaPhuongDo,
      content:
        "Hàng nghìn bông hoa phượng khoe sắc đỏ rực rỡ khắp các tuyến phố Hải Phòng.",
    },
    {
      id: 9,
      category: "Tin tức",
      region: "Miền Bắc",
      title: "Bắc Giang thu hoạch vải thiều",
      image: Vai,
      content:
        "Vải thiều Lục Ngạn vào vụ chín rộ, hương vị ngọt đậm lan tỏa khắp vùng.",
    },
    {
      id: 10,
      category: "Tin tức",
      region: "Miền Bắc",
      title: "Du lịch Mộc Châu mùa hoa mận",
      image: HoaMan,
      content:
        "Cả thung lũng Mộc Châu trắng xóa hoa mận, thu hút đông đảo nhiếp ảnh gia.",
    },
    {
      id: 11,
      category: "Tin tức",
      region: "Miền Trung",
      title: "Festival Huế 2025 khởi động",
      image: FeHue,
      content:
        "Festival Huế năm nay hứa hẹn mang lại nhiều hoạt động văn hóa đặc sắc và ẩm thực phong phú.",
    },
    {
      id: 12,
      category: "Tin tức",
      region: "Miền Trung",
      title: "Ngày hội bánh ít lá gai Quảng Nam",
      image: BanhIt,
      content:
        "Người dân và du khách được thưởng thức bánh ít lá gai thơm ngon chuẩn vị Quảng Nam.",
    },
    {
      id: 13,
      category: "Tin tức",
      region: "Miền Trung",
      title: "Huế tổ chức tuần lễ ẩm thực cố đô",
      image: Hue,
      content:
        "Tuần lễ ẩm thực cố đô Huế giới thiệu hơn 100 món ăn đặc sản như bún bò Huế, bánh bèo, bánh nậm...",
    },
    {
      id: 14,
      category: "Tin tức",
      region: "Miền Trung",
      title: "Quảng Nam khai mạc lễ hội mì Quảng",
      image: MiQuang,
      content:
        "Lễ hội mì Quảng được tổ chức tại Hội An nhằm tôn vinh món ăn truyền thống đặc trưng của miền Trung...",
    },
    {
      id: 15,
      category: "Tin tức",
      region: "Miền Trung",
      title: "Đà Nẵng ra mắt phố ẩm thực ven biển",
      image: PhoAmThuc,
      content:
        "Phố ẩm thực ven biển Mỹ Khê thu hút du khách với hải sản tươi sống và các món đặc sản miền Trung...",
    },
    {
      id: 16,
      category: "Tin tức",
      region: "Miền Trung",
      title: "Phú Yên giới thiệu ẩm thực tại Festival biển",
      image: FeBien,
      content:
        "Festival biển Phú Yên quy tụ nhiều đầu bếp nổi tiếng giới thiệu món cá ngừ đại dương và bánh hỏi lòng heo...",
    },
    {
      id: 17,
      category: "Tin tức",
      region: "Miền Nam",
      title: "Lễ hội trái cây Nam Bộ khai mạc",
      image: TraiCay,
      content:
        "Lễ hội trưng bày hàng trăm loại trái cây đặc sản từ khắp các tỉnh miền Nam.",
    },
    {
      id: 18,
      category: "Tin tức",
      region: "Miền Nam",
      title: "Chợ nổi Cái Răng đông vui mùa nước nổi",
      image: ChoNoi,
      content:
        "Du khách đổ về chợ nổi Cái Răng thưởng thức đặc sản miền sông nước.",
    },

    // Bài viết
    {
      id: 19,
      category: "Bài viết",
      region: "Miền Bắc",
      title: "Bí quyết nấu phở bò chuẩn vị Hà Nội",
      image: "https://source.unsplash.com/400x250/?pho,vietnam",
      content:
        "Phở bò Hà Nội nổi tiếng với hương vị thanh tao, nước dùng trong và thơm.",
    },
    {
      id: 20,
      category: "Bài viết",
      region: "Miền Bắc",
      title: "Cách làm bánh chưng ngày Tết",
      image: "https://source.unsplash.com/400x250/?banh-chung,vietnam",
      content:
        "Bánh chưng – món ăn truyền thống không thể thiếu trong dịp Tết cổ truyền.",
    },
    {
      id: 21,
      category: "Bài viết",
      region: "Miền Trung",
      title: "Mì Quảng – Tinh hoa ẩm thực xứ Quảng",
      image: "https://source.unsplash.com/400x250/?mi-quang,vietnam",
      content:
        "Mì Quảng với sợi mì vàng óng, nước dùng đậm đà và rau sống tươi ngon.",
    },
    {
      id: 22,
      category: "Bài viết",
      region: "Miền Trung",
      title: "Cao lầu Hội An – Món ăn của phố cổ",
      image: "https://source.unsplash.com/400x250/?hoi-an,food",
      content: "Cao lầu – món mì đặc trưng của Hội An với hương vị độc đáo.",
    },
    {
      id: 23,
      category: "Tin tức",
      region: "Miền Nam",
      title: "Cần Thơ khai mạc lễ hội bánh dân gian Nam Bộ",
      image: BanhDanGian,
      content:
        "Lễ hội giới thiệu hơn 200 loại bánh dân gian như bánh tét lá cẩm, bánh ít trần, bánh bò thốt nốt...",
    },
    {
      id: 24,
      category: "Tin tức",
      region: "Miền Nam",
      title: "Sài Gòn mở chợ ẩm thực đêm Bến Thành",
      image: ChoBenThanh,
      content:
        "Chợ đêm Bến Thành thu hút du khách với hàng trăm món ăn đường phố đặc trưng của Nam Bộ...",
    },
    {
      id: 25,
      category: "Tin tức",
      region: "Miền Nam",
      title: "Bến Tre tổ chức lễ hội dừa quốc tế",
      image: DuaBenTre,
      content:
        "Lễ hội dừa giới thiệu các món ăn chế biến từ dừa và sản phẩm thủ công mỹ nghệ đặc trưng miền Tây...",
    },
    {
      id: 26,
      category: "Tin tức",
      region: "Miền Nam",
      title: "An Giang ra mắt tour ẩm thực Châu Đốc",
      image: ChauDoc,
      content:
        "Tour ẩm thực Châu Đốc đưa du khách khám phá mắm Châu Đốc, lẩu mắm, bún cá và các món miền Tây...",
    },
    {
      id: 27,
      category: "Bài viết",
      region: "Miền Nam",
      title: "Cách làm bánh tét lá cẩm Cần Thơ",
      image: "https://source.unsplash.com/400x250/?banh-tet,vietnam",
      content: "Bánh tét lá cẩm – món ăn rực rỡ sắc màu và giàu hương vị.",
    },
    {
      id: 28,
      category: "Bài viết",
      region: "Miền Nam",
      title: "Hủ tiếu Mỹ Tho – Hương vị miền sông nước",
      image: "https://source.unsplash.com/400x250/?hu-tieu,vietnam",
      content:
        "Hủ tiếu Mỹ Tho nổi tiếng với nước lèo ngọt thanh và sợi hủ tiếu dai ngon.",
    },
    // thêm nhiều để có 3-4 trang
    {
      id: 29,
      category: "Tin tức",
      region: "Miền Bắc",
      title: "Hội chợ ẩm thực Hà Nội 2025",
      image: HoiChoHaNoi,
      content: "Sự kiện quy tụ hàng trăm món ăn từ khắp miền Bắc.",
    },
    {
      id: 30,
      category: "Tin tức",
      region: "Miền Trung",
      title: "Khai trương phố ẩm thực Đà Nẵng",
      image: AmThucDaNang,
      content: "Phố ẩm thực mới tại Đà Nẵng thu hút đông đảo thực khách.",
    },
    {
      id: 31,
      category: "Tin tức",
      region: "Miền Nam",
      title: "Tuần lễ du lịch Cà Mau",
      image: CaMau,
      content: "Giới thiệu đặc sản và điểm du lịch Cà Mau.",
    },
    {
      id: 32,
      category: "Bài viết",
      region: "Miền Bắc",
      title: "Chả cá Lã Vọng – Đặc sản Hà Thành",
      image: "https://source.unsplash.com/400x250/?cha-ca,vietnam",
      content:
        "Chả cá Lã Vọng được chế biến tinh tế, ăn kèm bún, rau thơm và mắm tôm.",
    },
    {
      id: 33,
      category: "Bài viết",
      region: "Miền Trung",
      title: "Bánh bèo Huế – Món ăn dân dã",
      image: "https://source.unsplash.com/400x250/?banh-beo,vietnam",
      content: "Bánh bèo Huế mềm mịn, thơm ngon, chan nước mắm đậm vị.",
    },
    {
      id: 34,
      category: "Bài viết",
      region: "Miền Nam",
      title: "Bánh xèo miền Tây giòn rụm",
      image: "https://source.unsplash.com/400x250/?banh-xeo,vietnam",
      content:
        "Bánh xèo miền Tây vàng ươm, ăn kèm rau sống và nước mắm chua ngọt.",
    },
    {
      id: 35,
      category: "Bài viết",
      region: "Miền Bắc",
      title: "Câu chuyện bánh cốm Hàng Than",
      image: "https://source.unsplash.com/400x250/?banh-com,hanoi",
      content:
        "Bánh cốm Hàng Than không chỉ là món quà Hà Nội mà còn là một phần ký ức của nhiều thế hệ...",
    },
    {
      id: 36,
      category: "Bài viết",
      region: "Miền Bắc",
      title: "Ẩm thực mùa thu Hà Nội",
      image: "https://source.unsplash.com/400x250/?hanoi,autumn-food",
      content:
        "Mùa thu Hà Nội nổi bật với cốm làng Vòng, sấu chín, bánh trung thu thập cẩm và nhiều món ấm áp...",
    },
    {
      id: 37,
      category: "Bài viết",
      region: "Miền Bắc",
      title: "Khám phá đặc sản vùng núi Tây Bắc",
      image: "https://source.unsplash.com/400x250/?tay-bac,food",
      content:
        "Tây Bắc quyến rũ với thắng cố, lợn cắp nách, rượu ngô men lá và phong vị đậm đà của núi rừng...",
    },
    {
      id: 38,
      category: "Bài viết",
      region: "Miền Trung",
      title: "Bánh bèo xứ Huế và bí quyết gia truyền",
      image: "https://source.unsplash.com/400x250/?banh-beo,hue",
      content:
        "Bánh bèo Huế nổi bật với phần nhân tôm chấy, mỡ hành thơm lừng và nước mắm ớt cay nhẹ...",
    },
    {
      id: 39,
      category: "Bài viết",
      region: "Miền Trung",
      title: "Cao lầu Hội An – Hương vị không thể quên",
      image: "https://source.unsplash.com/400x250/?cao-lau,hoi-an",
      content:
        "Cao lầu với sợi mì vàng óng, thịt xá xíu, rau sống Trà Quế đã tạo nên thương hiệu riêng cho Hội An...",
    },
    {
      id: 40,
      category: "Bài viết",
      region: "Miền Trung",
      title: "Khám phá chợ Đông Ba",
      image: "https://source.unsplash.com/400x250/?dong-ba-market,hue",
      content:
        "Chợ Đông Ba không chỉ là nơi mua sắm mà còn là thiên đường ẩm thực với nhiều món ăn truyền thống...",
    },
    {
      id: 41,
      category: "Bài viết",
      region: "Miền Nam",
      title: "Bí quyết làm bánh tét lá cẩm",
      image: "https://source.unsplash.com/400x250/?banh-tet,can-tho",
      content:
        "Bánh tét lá cẩm của Cần Thơ với màu tím tự nhiên, nhân đậu xanh thịt mỡ tạo nên hương vị đặc trưng...",
    },
    {
      id: 42,
      category: "Bài viết",
      region: "Miền Nam",
      title: "Khám phá ẩm thực miền Tây mùa nước nổi",
      image: "https://source.unsplash.com/400x250/?mien-tay,food",
      content:
        "Mùa nước nổi mang đến cá linh, bông điên điển, lẩu mắm và nhiều món ăn dân dã đặc trưng miền Tây...",
    },
    {
      id: 43,
      category: "Bài viết",
      region: "Miền Nam",
      title: "Sài Gòn và văn hóa cà phê vỉa hè",
      image: "https://source.unsplash.com/400x250/?saigon,coffee",
      content:
        "Cà phê vỉa hè Sài Gòn không chỉ là thức uống mà còn là nét sinh hoạt văn hóa đặc sắc của người dân...",
    },
  ];

  // Lọc theo danh mục và vùng miền
  const filteredArticles = articles.filter(
    (a) =>
      a.category === activeCategory &&
      (activeRegion === "Tất cả" || a.region === activeRegion)
  );

  // Phân trang
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto p-6 flex gap-6 mt-20">
      {/* Cột trái - Danh mục */}
      <div className="w-1/4">
        <h2 className="text-xl font-bold mb-4">Danh mục</h2>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat}
              className={`cursor-pointer p-2 rounded ${
                activeCategory === cat
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentPage(1);
              }}
            >
              {cat}
            </li>
          ))}
        </ul>
      </div>

      {/* Cột phải */}
      <div className="w-3/4">
        {/* Bộ lọc vùng miền */}
        <div className="flex gap-4 mb-4">
          {regions.map((region) => (
            <button
              key={region}
              className={`px-4 py-2 rounded ${
                activeRegion === region
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => {
                setActiveRegion(region);
                setCurrentPage(1);
              }}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Danh sách bài viết */}
        <div className="grid grid-cols-2 gap-8">
          {paginatedArticles.map((article) => (
            <div key={article.id} className="border rounded shadow-sm">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{article.title}</h3>
                <p className="text-sm text-gray-600">{article.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Phân trang */}
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
