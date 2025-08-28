// Đây là section các bài viết trong trang chủ

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Button } from "@/components/button";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function BlogSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const blogPosts = [
    {
      id: 1,
      title: "Mẹo nấu ăn ngon từ đặc sản vùng miền",
      description:
        "Khám phá các bí quyết để giữ trọn hương vị và màu sắc của món ăn đặc sản.",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    },
    {
      id: 2,
      title: "Công thức món ăn nổi tiếng",
      description:
        "Những công thức chuẩn xác giúp bạn tái hiện hương vị quê hương ngay tại nhà.",
      image:
        "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800",
    },
    {
      id: 3,
      title: "Câu chuyện du lịch ẩm thực",
      description:
        "Hành trình khám phá những vùng đất mới qua từng món ăn đặc trưng.",
      image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800",
    },
  ];

  return (
    <section className="py-6 mb-5 bg-gray-50">
      <div className="flex items-center justify-center gap-4 mb-2" ref={ref}>
        <div className="flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-yellow-500 text-2xl mt-2"
            style={{ fontFamily: "'Ga Maamli', sans-serif" }}
          >
            MTN Blogs
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl mb-6 mt-2 font-bold"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div>CÁC BÀI VIẾT</div>
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Nút Xem thêm bên phải */}
      <div className="max-w-6xl mx-auto flex justify-end mb-4 -mt-6">
        <Link to="/news">
          <Button variant="default">Xem thêm</Button>
        </Link>
      </div>

      <div
        className={`grid md:grid-cols-3 gap-8 max-w-6xl mx-auto transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img
              src={post.image}
              alt={post.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-600 text-sm">{post.description}</p>
              <div className="flex justify-end">
                <Link to="/news">
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
