import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaRegStar, FaTimes, FaEnvelope } from "react-icons/fa";
import { sendFeedback } from "@/api/feedback";
import { showSuccess, showError } from "@/common/toast";

export default function FloatingReview() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      showError("Vui lòng chọn số sao đánh giá!");
      return;
    }
    if (comment.trim().length < 5) {
      showError("Nội dung đánh giá quá ngắn!");
      return;
    }

    try {
      setLoading(true);
      await sendFeedback(rating, comment);

      showSuccess(
        "Cảm ơn bạn! Mỗi lượt đánh giá là động lực giúp Shop hoàn thiện hơn ❤️"
      );

      setIsOpen(false);
      setRating(0);
      setComment("");
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 401) {
        showError("Vui lòng đăng nhập để gửi đánh giá!");
      } else {
        showError("Gửi đánh giá thất bại, vui lòng thử lại!");
      }
      console.error("❌ Lỗi khi gửi đánh giá:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔹 Nút nổi ở góc dưới phải */}
      <motion.button
        className="fixed bottom-35 right-6 bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        <FaEnvelope size={26} />
      </motion.button>

      {/* 🔹 Popup đánh giá */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md relative"
            >
              {/* 🔸 Nút đóng */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                <FaTimes size={20} />
              </button>

              <h2 className="text-xl font-bold text-center mb-4 text-amber-600">
                Đánh giá của bạn cho Shop
              </h2>

              {/* 🔸 Chọn sao */}
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    {star <= (hover || rating) ? (
                      <FaStar className="text-yellow-400 text-2xl" />
                    ) : (
                      <FaRegStar className="text-gray-400 text-2xl" />
                    )}
                  </button>
                ))}
              </div>

              {/* 🔸 Nhập nội dung */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Hãy chia sẻ cảm nhận của bạn..."
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 h-28 resize-none"
              />

              {/* 🔸 Nút gửi */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-semibold transition ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
