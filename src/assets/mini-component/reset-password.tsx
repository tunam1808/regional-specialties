import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { showSuccess, showError } from "@/common/toast";
import { resetPassword } from "@/api/reset-pass";
import backgroundImage from "@/assets/images/bg.jpg";
import { FaArrowLeft } from "react-icons/fa";

// CSS background giống login
const backgroundStyles = `
  .reset-background {
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
  .reset-background::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5); 
    z-index: 0;
  }
  .reset-form { position: relative; z-index: 10; }
`;

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !tempPassword || !newPassword || !confirmPassword) {
      showError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (newPassword !== confirmPassword) {
      showError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(
        email,
        tempPassword,
        newPassword,
        confirmPassword
      );
      showSuccess(res.message);
      setEmail("");
      setTempPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      showError(err.message || "Đặt lại mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{backgroundStyles}</style>
      <div className="reset-background">
        <form
          onSubmit={handleSubmit}
          className="reset-form bg-white p-10 rounded-3xl shadow-2xl w-full max-w-xl flex flex-col gap-y-4 border-5 border-green-600 backdrop-blur-lg"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-100/60 via-white/30 to-transparent blur-2xl -z-10" />

          <h1 className="text-4xl font-extrabold text-center text-green-700 mb-4 mt-4 tracking-wide">
            ĐẶT LẠI MẬT KHẨU
          </h1>

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Mật khẩu tạm thời */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="tempPassword"
              className="text-sm font-medium text-green-800"
            >
              Mật khẩu tạm thời (nhận từ email):
            </label>
            <Input
              id="tempPassword"
              type="password"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              required
            />
          </div>

          {/* Mật khẩu mới */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="newPassword"
              className="text-sm font-medium text-green-800"
            >
              Mật khẩu mới:
            </label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-green-800"
            >
              Xác nhận mật khẩu mới:
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-base font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-md transition-all duration-200"
          >
            {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
          </Button>

          {/* Link về login */}
          <div className="text-center text-sm text-gray-600 mt-4 space-y-2">
            <a
              href="/login"
              className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 font-medium transition-colors"
            >
              <FaArrowLeft /> Quay lại đăng nhập
            </a>
          </div>
        </form>
      </div>
    </>
  );
}
