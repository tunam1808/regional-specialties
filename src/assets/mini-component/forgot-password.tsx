import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { showSuccess, showError } from "@/common/toast";
import { forgotPassword } from "@/api/forgot-pass";
import backgroundImage from "@/assets/images/bg.jpg";
import { FaArrowLeft } from "react-icons/fa";

// CSS background giống login
const backgroundStyles = `
  .forgot-background {
    background-image: url(${backgroundImage});
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .forgot-background::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5); 
    z-index: 0;
  }

  .forgot-form {
    position: relative;
    z-index: 10;
  }
`;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ✅ tạo navigator

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPassword(email); // gọi API gửi email
      showSuccess(res.message);
      setEmail("");

      // ✅ Chuyển sang trang reset-password sau 1 giây
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1000);
    } catch (err: any) {
      showError(err.message || "Gửi email thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{backgroundStyles}</style>
      <div className="forgot-background">
        <form
          onSubmit={handleSubmit}
          className="forgot-form bg-white p-10 rounded-3xl shadow-2xl w-full max-w-xl flex flex-col gap-y-4 border-5 border-green-600 backdrop-blur-lg"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-100/60 via-white/30 to-transparent blur-2xl -z-10" />

          <h1 className="text-4xl font-extrabold text-center text-green-700 mb-4 mt-4 tracking-wide">
            QUÊN MẬT KHẨU
          </h1>

          <p className="text-sm text-gray-700 mb-4">
            Nhập email của bạn để nhận link đặt lại mật khẩu.
          </p>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-green-800"
            >
              Email:
            </label>
            <Input
              id="email"
              type="email"
              className="w-full h-11 text-base border border-green-500/60 focus:border-green-700 focus:ring-green-500/50 rounded-xl shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-base font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-md transition-all duration-200"
          >
            {loading ? "Đang gửi..." : "Gửi email"}
          </Button>

          {/* Link trở về login */}
          <div className="text-center text-sm text-gray-600 mt-4 space-y-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 font-medium transition-colors"
            >
              <FaArrowLeft />
              <span>Quay lại đăng nhập</span>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
