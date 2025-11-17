import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { login as loginApi } from "@/api/register-login-logout.api";
import { showSuccess, showError } from "@/common/toast";

// Import ảnh nền
import backgroundImage from "@/assets/images/bg.jpg";

// Thêm CSS cho background và cải thiện giao diện mobile
const backgroundStyles = `
  .login-background {
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

  .login-background::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); 
    z-index: 0;
  }

  .login-form {
    position: relative;
    z-index: 10;
  }

  @media (max-width: 640px) {
    .login-form {
      padding: 1rem; /* Giảm padding trên mobile */
      border-radius: 0; /* Bỏ bo góc trên mobile */
      max-width: 100%; /* Đảm bảo form full-width trên mobile */
    }

    .login-form h1 {
      font-size: 1.75rem; /* Giảm kích thước chữ tiêu đề trên mobile */
    }

    .login-form .input-container {
      flex-direction: column; /* Chuyển sang dạng cột trên mobile */
      align-items: stretch;
      gap: 0.5rem;
    }

    .login-form label {
      width: auto; /* Label full width trên mobile */
      text-align: left; /* Căn trái label */
      font-size: 0.875rem; /* Giảm kích thước chữ label */
    }

    .login-form input {
      height: 2.25rem; /* Giảm chiều cao input */
      font-size: 0.875rem; /* Giảm kích thước chữ input */
    }

    .login-form .checkbox-container {
      padding-left: 0; /* Bỏ padding-left cho checkbox */
      justify-content: center; /* Căn giữa checkbox */
    }
  }
`;

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
    <>
      <style>{backgroundStyles}</style>
      <div className="login-background">
        <form
          onSubmit={handleSubmit}
          className="login-form bg-white p-10 rounded-3xl shadow-2xl w-full max-w-xl flex flex-col gap-y-4 border-5 border-green-600 backdrop-blur-lg"
        >
          {/* Hiệu ứng ánh sáng nền */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-100/60 via-white/30 to-transparent blur-2xl -z-10" />

          <h1 className="text-4xl font-extrabold text-center text-green-700 mb-4 mt-4 tracking-wide">
            ĐĂNG NHẬP
          </h1>

          {/* Username */}
          <div className="input-container flex items-center gap-3">
            <label
              htmlFor="username"
              className="w-32 text-base font-medium text-right text-green-800"
            >
              Tên đăng nhập:
            </label>
            <div className="relative flex-1">
              <Input
                id="username"
                type="text"
                className="w-full h-11 text-base border border-green-500/60 focus:border-green-700 focus:ring-green-500/50 rounded-xl shadow-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          {/* Password */}
          <div className="input-container flex items-center gap-3">
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
          {/* Quên mật khẩu + Remember me */}
          <div className="flex items-center justify-between mb-4">
            {/* Remember me lùi vào */}
            <div className="flex items-center gap-2 pl-10">
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

            {/* Link quên mật khẩu */}
            <div>
              <Link
                to="/forgot-password"
                className="text-sm text-green-600 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-md transition-all duration-200"
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
    </>
  );
}

export default Login;
