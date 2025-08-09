import { Button } from "@/components/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Nem from "@/assets/images/nem-chua-xu-thanh.jpg";
import Gio from "@/assets/images/go-me.png";
import Thit from "@/assets/images/thit-trau.jpg";
import Muc from "@/assets/images/muc.jpg";
import Com from "@/assets/images/com.jpg";
import Tet from "@/assets/images/Cach-lam-banh-tet-la-cam.jpg";
import Cacao from "@/assets/images/572b556865ced7908edf1.jpg";
import Hat from "@/assets/images/hatdieu.jpg";

const products = [
  {
    id: 1,
    name: "Thịt trâu gác bếp",
    description: "Hương vị Tây Bắc đậm đà",
    price: "450.000đ",
    image: Thit,
  },
  {
    id: 2,
    name: "Nem chua xứ Thanh",
    description: "Đặc sản xứ Thanh",
    price: "120.000đ",
    image: Nem,
  },
  {
    id: 3,
    name: "Giò me Nghệ An",
    description: "Giò đặc biệt thơm ngon",
    price: "280.000đ",
    image: Gio,
  },
  {
    id: 4,
    name: "Mực một nắng",
    description: "Mực nướng giòn ngon",
    price: "320.000đ",
    image: Muc,
  },
  {
    id: 5,
    name: "Bánh cốm làng Vòng",
    description: "Mực nướng giòn ngon",
    price: "68.000đ",
    image: Com,
  },
  {
    id: 6,
    name: "Bánh Tét lá cẩm",
    description: "Mực nướng giòn ngon",
    price: "78.000đ",
    image: Tet,
  },
  {
    id: 7,
    name: "Bột Cacao nguyên chất ",
    description: "Mực nướng giòn ngon",
    price: "220.000đ",
    image: Cacao,
  },
  {
    id: 8,
    name: "Hạt điều rang muối",
    description: "Mực nướng giòn ngon",
    price: "160.000đ",
    image: Hat,
  },
];

export default function Product_special() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div
      className="bg-cover bg-center bg-no-repeat"
      ref={ref}
      style={{
        backgroundImage:
          "url('https://primeluxe.monamedia.net/wp-content/uploads/2024/08/sec-bg.webp')",
        backgroundColor: "#ECFAFF",
      }}
    >
      {/* Tiêu đề */}
      <motion.span
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex justify-center text-yellow-500 text-2xl mt-2"
        style={{ fontFamily: "'Ga Maamli', sans-serif" }}
      >
        MTN Special
      </motion.span>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex justify-center text-4xl mb-6 mt-2 font-bold"
        style={{ fontFamily: "'Baloo 2', cursive" }}
      >
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div>SẢN PHẨM NỔI BẬT</div>
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
        </div>
      </motion.div>

      {/* Danh sách sản phẩm với animation */}
      <div className="flex justify-center gap-8 flex-wrap">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -100 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="w-60 border rounded-xl shadow hover:shadow-lg hover:-translate-y-3 transition bg-white group"
          >
            {/* Ảnh và nút */}
            <div className="relative overflow-hidden rounded-t-md">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-60 object-cover transform transition-transform duration-300 group-hover:scale-105"
              />
              <Button
                variant="default"
                className="absolute bottom-15 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white font-semibold py-1 px-4 rounded-lg"
              >
                Mua hàng
              </Button>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="relative bg-[#8d7c8224] h-28 overflow-hidden flex items-center justify-center">
              <div className="text-center transition-all duration-500 transform group-hover:-translate-y-4">
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm mt-1 text-gray-700">
                  {product.description}
                </p>
              </div>
              <p className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 text-red-600 font-semibold opacity-0 group-hover:bottom-3 group-hover:opacity-100 transition-all duration-500">
                {product.price}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Nút xem tất cả */}
      <div className="flex justify-center mt-7">
        <Link to="/products">
          <Button className="border border-transparent hover:border-amber-600 bg-amber-600 hover:bg-white hover:text-black mb-5">
            Xem tất cả
          </Button>
        </Link>
      </div>
    </div>
  );
}
