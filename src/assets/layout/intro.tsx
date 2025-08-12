import { motion } from "framer-motion";
import { Button } from "@/components/button";
import Ruong from "@/assets/images/ruong.jpg";
import { Link } from "react-router-dom";

export default function IntroSection() {
  return (
    <section className="relative py-20 px-6 md:px-20 overflow-hidden">
      {/* Bản đồ Việt Nam mờ ở nền */}
      <div
        className="absolute inset-0 w-full h-full bg-no-repeat bg-center bg-cover opacity-50 pointer-events-none"
        style={{
          backgroundImage: `url(${Ruong})`,
        }}
      ></div>

      {/* Nội dung chính */}
      <div className="relative z-10 max-w-5xl mx-auto text-center backdrop-blur-md p-10 rounded-3xl shadow-md">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-amber-700 mb-4"
        >
          Khám phá đặc sản ba miền
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-700 text-lg md:text-xl leading-relaxed"
        >
          Từ những món ăn đậm đà hương vị Tây Bắc cho đến những đặc sản miền
          Trung nồng nàn và vị ngọt miền Nam – chúng tôi mang đến cho bạn trải
          nghiệm ẩm thực tinh tế từ khắp mọi miền đất nước. Hành trình hương vị
          Việt bắt đầu từ đây.<br></br>
          <Link to="/about">
            <Button variant="default" className="mt-5">
              Khám phá ngay
            </Button>
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
