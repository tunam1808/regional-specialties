import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { login as loginApi } from "@/api/register-login-logout.api";
import { showSuccess, showError } from "@/common/toast";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginApi({ username, password });
      console.log("Kết quả đăng nhập:", res);

      // ✅ Nếu có token thì luôn lưu vào localStorage (để axios đọc được)
      if (res.token) {
        const userData = JSON.stringify(res.user);

        // Nếu người dùng chọn "Ghi nhớ", lưu thêm flag để tự đăng nhập sau
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", userData);
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }
      }

      showSuccess("Đăng nhập thành công!");
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err: any) {
      showError(
        "Đăng nhập thất bại: " +
          (err.response?.data?.message || "Sai tài khoản hoặc mật khẩu")
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-emerald-200">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-xl flex flex-col gap-y-4 border border-green-100"
      >
        {/* Hiệu ứng ánh sáng nền */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-100/60 via-white/30 to-transparent blur-2xl -z-10" />

        <h1 className="text-4xl font-extrabold text-center text-green-700 mb-4 tracking-wide">
          ĐĂNG NHẬP
        </h1>

        {/* Username */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="username"
            className="w-32 text-base font-medium text-right text-green-800"
          >
            Tên đăng nhập:
          </label>
          <Input
            id="username"
            type="text"
            className="flex-1 h-11 text-base border border-green-500/60 focus:border-green-700 focus:ring-green-500/50 rounded-xl shadow-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="password"
            className="w-32 text-base font-medium text-right text-green-800"
          >
            Mật khẩu:
          </label>

          <div className="relative flex-1">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full h-11 text-base border border-green-500/60 focus:border-green-700 focus:ring-green-500/50 rounded-xl pr-10 shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-500 hover:text-green-700 transition-colors"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2 pl-36 mt-2">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor="remember" className="text-sm text-gray-700">
            Ghi nhớ đăng nhập
          </label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-11 text-base font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-md mt-4 transition-all duration-200"
        >
          Đăng nhập
        </Button>

        {/* No account */}
        <div className="text-center text-sm text-gray-600 mt-4 space-y-2">
          <p>
            Chưa có tài khoản?{" "}
            <a href="/register" className="text-green-600 hover:underline">
              Đăng ký ngay
            </a>
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 font-medium transition-colors"
          >
            <FaArrowLeft />
            <span>Trở về trang chủ</span>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
