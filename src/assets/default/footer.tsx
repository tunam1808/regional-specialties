import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import logo from "@/assets/images/logo.png";

const footerColumns = [
  {
    title: "Về chúng tôi",
    content: [
      "Chúng tôi chuyên cung cấp các món đặc sản nổi tiếng từ ba miền Bắc - Trung - Nam, đảm bảo chất lượng và hương vị truyền thống.",
    ],
  },
  {
    title: "Đặc sản 3 miền",
    links: [
      { name: "Miền Bắc", href: "/products?region=bac" },
      { name: "Miền Trung", href: "/products?region=trung" },
      { name: "Miền Nam", href: "/products?region=nam" },
    ],
  },
  {
    title: "Hỗ trợ khách hàng",
    links: [
      { name: "Giới thiệu", href: "/about" },
      { name: "Chính sách giao hàng", href: "/shipping" },
      { name: "Chính sách đổi trả", href: "/returns" },
      { name: "Liên hệ", href: "/contact" },
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
        <a href="tel:0123456789" className="hover:underline">
          0123 456 789
        </a>
      </>,
      <div className="flex gap-4 text-2xl text-yellow-500 mt-2">
        <a
          href="https://facebook.com"
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
        {/* Logo */}
        <div className="mb-10">
          <a href="/" className="inline-block">
            <img
              src={logo}
              alt="Logo"
              className="w-[80px] h-[80px] object-contain cursor-pointer"
            />
          </a>
        </div>

        {/* Cột nội dung */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {footerColumns.map((col, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{col.title}</h3>

              {col.links && (
                <ul className="space-y-2 text-sm">
                  {col.links.map((link, idx) => (
                    <li key={idx}>
                      <a href={link.href} className="hover:underline">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              {col.content &&
                col.content.map((item, idx) => (
                  <p key={idx} className="text-sm opacity-80 mb-2">
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
