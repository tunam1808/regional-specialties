// Đây là phần liên hệ với chúng tôi nằm trong trang chủ

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import {
  MdMail,
  MdPhone,
  MdLocationOn,
  MdAccessTime,
  MdLanguage,
  MdShare,
} from "react-icons/md";
import { sendEmailAPI } from "@/api/email";
import { getProfile } from "@/api/get-profile";
import { showSuccess, showError } from "@/common/toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  // State form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{
    id: number;
    fullname?: string;
    email?: string;
  } | null>(null);
  const navigate = useNavigate();

  // Lấy thông tin user khi load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getProfile();
        const userData = {
          id: profile.id,
          fullname: profile.fullname || profile.name || "", // tùy backend trả về
          email: profile.email || "",
        };
        setUser(userData);

        // Tự động điền form nếu có dữ liệu
        if (userData.fullname) setName(userData.fullname);
        if (userData.email) setEmail(userData.email);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra đăng nhập
    if (!user?.id) {
      showError("Vui lòng đăng nhập để gửi liên hệ!");
      navigate("/login");
      return;
    }

    if (!name || !email || !message) {
      showError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setLoading(true);

    const messageHtml = `
      <p><strong>Họ tên:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Nội dung:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
    `;

    try {
      const result = await sendEmailAPI({
        to: "mtn.dacsanbamien@gmail.com",
        subject: `Tin nhắn từ ${name} - ${email}`,
        message: messageHtml,
        userEmail: email,
      });

      if (result.success) {
        showSuccess("Cảm ơn bạn đã phản hồi!");
        setMessage(""); // Chỉ xóa nội dung tin nhắn, giữ lại name & email
      } else {
        showError("Gửi tin nhắn thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      showError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

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
              <MdMail className="text-yellow-500" />
              <span>mtn.dacsanbamien@gmail.com</span>
            </div>

            <div className="flex items-center gap-4">
              <MdPhone className="text-yellow-500" />
              <span>0345 281 795</span>
            </div>

            <div className="flex items-center gap-4">
              <MdLocationOn className="text-yellow-500" />
              <span>
                Vinhomes chân đê, Xóm 1, Cổ Điển, Hải Bối, Đông Anh, Hà Nội
              </span>
            </div>

            <div className="flex items-center gap-4">
              <MdAccessTime className="w-5 h-5 text-yellow-500" />
              <span>Giờ làm việc: 8:00 - 17:00 (T2 - T7)</span>
            </div>

            <div className="flex items-center gap-4">
              <MdLanguage className="w-5 h-5 text-yellow-500" />
              <span>Website: Regional-specialties.vercel.app</span>
            </div>

            <div className="flex items-center gap-4">
              <MdShare className="w-5 h-5 text-yellow-500" />
              <span>Fanpage: MTN Shop - Đặc sản ba miền</span>
            </div>
          </motion.div>

          {/* Form liên hệ */}
          <motion.form
            {...fadeRight(0.4)}
            className="bg-white p-6 rounded-xl shadow-md space-y-4"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Họ và tên"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              // Có thể thêm: disabled={!!user?.fullname} nếu muốn khóa không cho sửa
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              // disabled={!!user?.email}
            />
            <textarea
              placeholder="Nội dung"
              rows={4}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition w-full ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Đang gửi..." : "Gửi tin nhắn"}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
