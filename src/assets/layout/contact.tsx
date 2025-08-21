// Đây là phần liên hệ với chúng tôi nằm trong trang chủ

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.6, delay },
  });

  const fadeLeft = (delay = 0) => ({
    initial: { opacity: 0, x: -30 },
    animate: inView ? { opacity: 1, x: 0 } : {},
    transition: { duration: 0.6, delay },
  });

  const fadeRight = (delay = 0) => ({
    initial: { opacity: 0, x: 30 },
    animate: inView ? { opacity: 1, x: 0 } : {},
    transition: { duration: 0.6, delay },
  });

  return (
    <section className="py-10 bg-gray-50">
      <div ref={ref} className="max-w-5xl mx-auto px-4 ">
        {/* Tiêu đề */}
        <div className="flex flex-col items-center mb-8">
          <motion.span
            {...fadeUp(0)}
            className="text-yellow-500 text-2xl"
            style={{ fontFamily: "'Ga Maamli', sans-serif" }}
          >
            MTN Contact
          </motion.span>

          <motion.div
            {...fadeUp(0.2)}
            className="flex justify-center text-4xl mb-6 mt-2 font-bold"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div>LIÊN HỆ VỚI CHÚNG TÔI</div>
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
            </div>
          </motion.div>
        </div>

        {/* Nội dung */}
        <div className="grid md:grid-cols-2 gap-x-2 items-center">
          {/* Thông tin liên hệ */}
          <motion.div {...fadeLeft(0.3)} className="space-y-6">
            <div className="flex items-center gap-4">
              <Mail className="text-yellow-500" />
              <span>mtn.dacsanbamien@gmail.com</span>
            </div>

            <div className="flex items-center gap-4">
              <Phone className="text-yellow-500" />
              <span>0345 281 795</span>
            </div>

            <div className="flex items-center gap-4">
              <MapPin className="text-yellow-500" />
              <span>
                Vinhomes chân đê, Xóm 1, Cổ Điển, Hải Bối, Đông Anh, Hà Nội
              </span>
            </div>

            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-yellow-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0A9 9 0 113 12a9 9 0 0118 0z"
                />
              </svg>
              <span>Giờ làm việc: 8:00 - 17:00 (T2 - T7)</span>
            </div>

            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-yellow-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span>Website: www.congtyabc.com</span>
            </div>

            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-yellow-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17v-2a4 4 0 014-4h4V9a4 4 0 00-4-4H9V3L4 7l5 4v-2h4a2 2 0 012 2v2h-4a4 4 0 00-4 4v2z"
                />
              </svg>
              <span>Fanpage: facebook.com/congtyabc</span>
            </div>
          </motion.div>

          {/* Form liên hệ */}
          <motion.form
            {...fadeRight(0.4)}
            className="bg-white p-6 rounded-xl shadow-md space-y-4"
          >
            <input
              type="text"
              placeholder="Họ và tên"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <textarea
              placeholder="Nội dung"
              rows={4}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition"
            >
              Gửi tin nhắn
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
