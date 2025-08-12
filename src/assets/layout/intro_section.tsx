import { motion } from "framer-motion";

export default function IntroSection() {
  return (
    <section className="bg-gradient-to-r from-yellow-100 via-pink-100 to-red-100 py-14">
      <div className="max-w-5xl mx-auto px-6">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-extrabold text-center text-red-600 drop-shadow-md mb-4"
        >
          Vài nét về ẩm thực Việt Nam
          <div className="w-24 h-1 bg-red-400 mx-auto rounded-full mb-6 mt-2"></div>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-justify leading-relaxed text-lg text-gray-800 bg-white bg-opacity-60 p-6 rounded-xl shadow-lg"
        >
          Ẩm thực Việt Nam là sự hòa quyện tinh tế giữa các hương vị, màu sắc và
          cách chế biến, phản ánh sự phong phú của đất nước trải dài từ Bắc vào
          Nam. Mỗi miền đều mang trong mình nét đặc trưng riêng, chịu ảnh hưởng
          của khí hậu, địa hình và văn hóa địa phương. Nếu miền Bắc nổi bật với
          sự thanh đạm, tinh tế; miền Trung ghi dấu bằng vị đậm đà, cay nồng;
          thì miền Nam lại khiến người thưởng thức ấn tượng bởi sự ngọt ngào và
          phóng khoáng. Sự đa dạng ấy tạo nên một bức tranh ẩm thực đầy màu sắc,
          khiến Việt Nam trở thành điểm đến hấp dẫn đối với du khách trong và
          ngoài nước.
        </motion.p>
      </div>
    </section>
  );
}
