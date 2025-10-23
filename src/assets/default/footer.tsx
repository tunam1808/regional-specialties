import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import logo from "@/assets/images/img-head-foot/logo.png";

const footerColumns = [
  {
    content: [
      <>
        <a href="/" className="inline-block mb-4 -mt-5">
          <img
            src={logo}
            alt="Logo"
            className="size-[90px] object-contain cursor-pointer"
          />
        </a>
        <h3 className="text-lg font-semibold mb-3">Về chúng tôi</h3>
        <p>
          Chúng tôi chuyên cung cấp các món đặc sản nổi tiếng từ ba miền Bắc -
          Trung - Nam, đảm bảo chất lượng và hương vị truyền thống.
        </p>
      </>,
    ],
  },
  {
    title: "Đặc sản 3 miền",
    links: [
      { name: "Miền Bắc", href: "/products?region=bac" },
      { name: "Miền Trung", href: "/products?region=trung" },
      { name: "Miền Nam", href: "/products?region=nam" },
      { name: "Xem tất cả sản phẩm", href: "/products" },
    ],
  },
  {
    title: "Hỗ trợ khách hàng",
    links: [
      { name: "Giới thiệu", href: "/about" },
      { name: "Chính sách giao hàng", href: "/shipping_policy" },
      { name: "Chính sách đổi trả", href: "/return_policy" },
      { name: "Câu hỏi thường gặp", href: "/faq" },
      { name: "Mã giảm giá", href: "/voucher" },
      { name: "Liên hệ", href: "/#contact" },
    ],
  },
  {
    title: "Đội ngũ của chúng tôi",
    content: [
      <ul className="space-y-2 leading-7">
        <li className="opacity-80">Vũ Tú Nam</li>
        <li className="opacity-80">Đỗ Thị Mai</li>
        <li className="opacity-80">Nguyễn Hồng Thịnh</li>
      </ul>,
    ],
  },
  {
    title: "Liên hệ",
    content: [
      <>
        Email:{" "}
        <a href="mailto:lienhe@dacsan3mien.vn" className="hover:underline">
          mtn.dacsanbamien@gmail.com
        </a>
      </>,
      <>
        Hotline:{" "}
        <a href="tel:0345281795" className="hover:underline">
          0345 281 795
        </a>
      </>,
      <div className="flex gap-4 text-2xl text-yellow-500 mt-2">
        <a
          href="https://www.facebook.com/profile.php?id=61581439421009"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-yellow-400"
        >
          <FaFacebook />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-yellow-400"
        >
          <FaInstagram />
        </a>
        <a
          href="https://tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-yellow-400"
        >
          <FaTiktok />
        </a>
      </div>,
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-12 pb-8 rounded-t-3xl mt-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Các cột */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-11 text-sm">
          {footerColumns.map((col, index) => (
            <div key={index}>
              {col.title && (
                <h3 className="text-xl font-semibold mb-4">{col.title}</h3>
              )}

              {col.links && (
                <ul className="space-y-2 leading-7">
                  {col.links.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link.href}
                        className="opacity-80 hover:underline"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              {col.content &&
                col.content.map((item, idx) => (
                  <p key={idx} className="opacity-80 mb-2">
                    {item}
                  </p>
                ))}
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm opacity-70">
          &copy; {new Date().getFullYear()} Đặc sản ba miền. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
