import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/card";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import avt from "@/assets/images/default.jpg";
import api from "@/api/axiosInstance";
import type { Feedback } from "@/types/feedback.type";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Feedback[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  // ✅ Gọi API
  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/feedback?page=${page}&limit=6`);
      setReviews(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi tải đánh giá:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  return (
    <section className="py-12 bg-emerald-50 flex justify-center">
      <div className="max-w-6xl w-full text-center">
        <motion.div ref={ref} className="text-center">
          <motion.span
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
        </motion.div>

        {loading && <p className="text-gray-500">Đang tải đánh giá...</p>}

        <div className="grid gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {!loading &&
            reviews.map((review, index) => (
              <motion.div
                key={review.id || index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="rounded-xl shadow-md hover:shadow-xl transition h-64 flex">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-3">
                    <img
                      src={avt}
                      alt={review.fullname}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />

                    <p className="text-gray-600 text-sm italic line-clamp-3">
                      "{review.comment}"
                    </p>

                    <div className="flex items-center justify-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
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

                    {/* ✅ Hiển thị tên + tỉnh thành */}
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-800 text-base">
                        {review.fullname}
                      </h4>
                      {review.TinhThanh && (
                        <p className="text-gray-500 text-sm">
                          {review.TinhThanh}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>

        {/* ✅ Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50"
            >
              ← Trước
            </button>

            <span className="text-gray-700">
              Trang {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50"
            >
              Sau →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
