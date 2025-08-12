import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Bien from "@/assets/images/bien.jpg";
import Nui from "@/assets/images/nui.jpg";
import Lua from "@/assets/images/lua.jpg";
import Lang from "@/assets/images/langque.jpg";
import Song from "@/assets/images/songnuoc.jpg";
import BaMien from "@/assets/images/bamien.jpg";

const images = [
  { src: Nui, alt: "Phong cảnh núi" },
  { src: Lua, alt: "Cánh đồng lúa" },
  { src: Bien, alt: "Biển xanh" },
  { src: Song, alt: "Sông nước" },
  { src: Lang, alt: "Làng quê Việt" },
  { src: BaMien, alt: "Ẩm thực vùng miền" },
];

export default function Gallery() {
  const { ref: sectionRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  return (
    <section ref={sectionRef} className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex justify-center text-yellow-500 text-2xl mt-2"
          style={{ fontFamily: "'Ga Maamli', sans-serif" }}
        >
          MTN Photos
        </motion.span>

        <motion.h2
          className="text-4xl font-bold text-gray-800 mb-6"
          style={{ fontFamily: "'Baloo 2', cursive" }}
          initial={{ opacity: 0, y: -30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div>THƯ VIỆN ẢNH</div>
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
          </div>
        </motion.h2>

        <motion.p
          className="text-gray-600 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Từ vẻ đẹp quê hương đất nước, con người Việt Nam thân thiện, hiếu
          khách cho đến những danh lam thắng cảnh hút hồn. Các món ăn, đặc sản
          đa dạng với hương vị đậm đà khó quên.
        </motion.p>

        {/* Grid ảnh */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <motion.div
              key={index}
              className="relative group overflow-hidden rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
