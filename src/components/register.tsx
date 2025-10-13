import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useState } from "react";
import { showSuccess, showError } from "@/common/toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { register as registerApi } from "@/api/register-login-logout.api";

// Import ảnh nền
import backgroundImage from "@/assets/images/bg.jpg";

// Thêm CSS cho background và cải thiện giao diện mobile
const backgroundStyles = `
  .register-background {
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

  .register-background::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); 
    z-index: 0;
  }

  .register-form {
    position: relative;
    z-index: 10;
  }

  @media (max-width: 640px) {
    .register-form {
      padding: 1rem; /* Giảm padding trên mobile */
      border-radius: 0; /* Bỏ bo góc trên mobile */
      max-width: 100%; /* Đảm bảo form full-width trên mobile */
    }

    .register-form h1 {
      font-size: 1.75rem; /* Giảm kích thước chữ tiêu đề trên mobile */
    }

    .register-form .input-container {
      flex-direction: column; /* Chuyển sang dạng cột trên mobile */
      align-items: stretch;
      gap: 0.5rem;
    }

    .register-form label {
      width: auto; /* Label full width trên mobile */
      text-align: left; /* Căn trái label */
      font-size: 0.875rem; /* Giảm kích thước chữ label */
    }

    .register-form input {
      height: 2.25rem; /* Giảm chiều cao input */
      font-size: 0.875rem; /* Giảm kích thước chữ input */
    }

    .register-form .checkbox-container {
      padding-left: 0; /* Bỏ padding-left cho checkbox */
      justify-content: center; /* Căn giữa checkbox */
    }
  }
`;

function Register() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // state ẩn/hiện mật khẩu

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp! ");
      return;
    }

    if (!agree) {
      alert("Bạn phải đồng ý với điều khoản sử dụng.");
      return;
    }

    console.log("Đăng ký với:", { fullName, username, email, password });

    try {
      const res = await registerApi({
        fullname: fullName,
        username,
        email,
        password,
      });

      console.log("Kết quả đăng ký:", res);
      showSuccess("Đăng ký thành công! ");

      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Tài khoản hoặc email đã tồn tại!";
      showError("Đăng ký thất bại: " + errorMessage);
    }
  };

  return (
    <>
      <style>{backgroundStyles}</style>
      <div className="register-background">
        <form
          onSubmit={handleSubmit}
          className="register-form bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl flex flex-col gap-y-4 border-5 border-green-600 backdrop-blur-lg"
        >
          <h1 className="text-5xl sm:text-4xl font-extrabold text-center text-green-700 mb-4 mt-4 tracking-wide">
            ĐĂNG KÝ
          </h1>

          {/* Full Name */}
          <div className="input-container flex items-center gap-3">
            <label
              htmlFor="fullName"
              className="w-32 text-base font-medium text-right"
            >
              Họ và tên:
            </label>
            <Input
              id="fullName"
              type="text"
              className="w-full h-11 text-base border border-green-500/60 focus:border-green-700 focus:ring-green-500/50 rounded-xl pr-10 shadow-sm"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Username */}
          <div className="input-container flex items-center gap-3">
            <label
              htmlFor="username"
              className="w-32 text-base font-medium text-right"
            >
              Tên đăng nhập:
            </label>
            <Input
              id="username"
              type="text"
              className="w-full h-11 text-base border border-green-500/60 focus:border-green-700 focus:ring-green-500/50 rounded-xl pr-10 shadow-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="input-container flex items-center gap-3">
            <label
              htmlFor="email"
              className="w-32 text-base font-medium text-right"
            >
              Email:
            </label>
            <Input
              id="email"
              type="email"
              className="w-full h-11 text-base border border-green-500/60 focus:border-green-700 focus:ring-green-500/50 rounded-xl pr-10 shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="input-container flex items-center gap-3">
            <label
              htmlFor="password"
              className="w-32 text-base font-medium text-right"
            >
              Mật khẩu:
            </label>
            <div className="relative w-full">
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
                className="absolute inset-y-0 right-5 flex items-center cursor-pointer text-gray-500 hover:text-green-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-container flex items-center gap-3">
            <label
              htmlFor="confirmPassword"
              className="w-32 text-base font-medium text-right"
            >
              Xác nhận:
            </label>
            <div className="relative w-full">
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                className="w-full h-11 text-base border border-green-500/60 focus:border-green-700 focus:ring-green-500/50 rounded-xl pr-10 shadow-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

          {/* Checkbox */}
          <div className="checkbox-container flex items-center gap-2 pl-36 ">
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="agree" className="text-sm text-gray-700">
              Tôi đồng ý với{" "}
              <a href="#" className="text-green-600 hover:underline">
                điều khoản sử dụng
              </a>
            </label>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-md transition-all duration-200"
          >
            Đăng ký
          </Button>

          {/* Đã có tài khoản */}
          <p className="text-center text-sm text-gray-600 mt-2">
            Đã có tài khoản?{" "}
            <a href="/login" className="text-green-600 hover:underline">
              Đăng nhập
            </a>
          </p>
        </form>
      </div>
    </>
  );
}

export default Register;
