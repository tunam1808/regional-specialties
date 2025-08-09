// Đây là phần đánh giá của khách hàng nằm trong trang chủ

import { Card, CardContent } from "@/components/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const reviews = [
  {
    name: "Nguyễn Văn An",
    location: "Hà Nội",
    comment:
      "Đặc sản miền Bắc rất ngon, đóng gói cẩn thận. Giao hàng nhanh chóng!",
    rating: 5,
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    name: "Trần Thị Hoa",
    location: "Đà Nẵng",
    comment:
      "Mình rất thích nem chua và mực rim me, hương vị chuẩn miền Trung.",
    rating: 4,
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    name: "Lê Minh Tuấn",
    location: "TP.HCM",
    comment: "Bánh xèo và hủ tiếu thật sự ngon. Sẽ tiếp tục ủng hộ lâu dài!",
    rating: 5,
    avatar: "https://i.pravatar.cc/100?img=3",
  },
  {
    name: "Phạm Thị Lan",
    location: "Huế",
    comment:
      "Bún bò Huế đậm đà, chuẩn vị quê hương. Cả nhà mình đều khen ngon!",
    rating: 5,
    avatar: "https://i.pravatar.cc/100?img=4",
  },
  {
    name: "Nguyễn Trung Anh",
    location: "Cần Thơ",
    comment: "Ăn như cứt ý!'.",
    rating: 1.5,
    avatar: "https://i.pravatar.cc/100?img=5",
  },
  {
    name: "Đỗ Thu Hằng",
    location: "Nghệ An",
    comment: "Món chè, bánh kẹo miền Nam rất hợp khẩu vị, đóng gói đẹp mắt.",
    rating: 5,
    avatar: "https://i.pravatar.cc/100?img=6",
  },
];

export default function CustomerReviews() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section className="py-12 bg-emerald-50 flex justify-center">
      <div className="max-w-6xl w-full text-center">
        <motion.span
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex justify-center text-yellow-500 text-2xl mt-2"
          style={{ fontFamily: "'Ga Maamli', sans-serif" }}
        >
          MTN Review
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
            <div>ĐÁNH GIÁ TỪ KHÁCH HÀNG</div>
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
          </div>
        </motion.div>

        {/* Grid responsive */}
        <div className="grid gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="rounded-xl shadow-md hover:shadow-xl transition h-64 flex">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-3">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                  <p className="text-gray-600 text-sm italic line-clamp-3">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center justify-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-base">
                      {review.name}
                    </h4>
                    <p className="text-xs text-gray-500">{review.location}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
