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
      navigate("/");
    } catch (err: any) {
      showError(
        "Đăng nhập thất bại: " +
          (err.response?.data?.message || "Sai tài khoản hoặc mật khẩu")
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl flex flex-col gap-y-4"
      >
        <h1 className="text-3xl font-bold text-center text-green-600 mb-2">
          ĐĂNG NHẬP
        </h1>

        {/* Username */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="username"
            className="w-32 text-base font-medium text-right"
          >
            Tên đăng nhập:
          </label>
          <Input
            id="username"
            type="text"
            className="flex-1 h-11 text-base border border-green-600"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="password"
            className="w-32 text-base font-medium text-right"
          >
            Mật khẩu:
          </label>

          <div className="relative flex-1">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full h-11 text-base border border-green-600 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-5 flex items-center cursor-pointer text-gray-500 hover:text-green-600"
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
          className="w-full h-11 text-base font-semibold bg-green-600 hover:bg-green-700 mt-2 cursor-pointer"
        >
          Đăng nhập
        </Button>

        {/* No account */}
        <p className="text-center text-sm text-gray-600 mt-2">
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-green-600 hover:underline">
            Đăng ký ngay
          </a>
          <Link to="/" className="flex items-center gap-2 hover:text-black">
            <FaArrowLeft />
            <span>Trở về trang chủ</span>
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
