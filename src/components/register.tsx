import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useState } from "react";
import { showSuccess, showError } from "@/common/toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { register as registerApi } from "@/api/register-login-logout.api"; // Gọi API đăng ký

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
      alert("Mật khẩu và xác nhận mật khẩu không khớp!");
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
      showSuccess("Đăng ký thành công!");

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br ">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl flex flex-col gap-y-4"
      >
        <h1 className="text-3xl font-bold text-center text-green-600 mb-2">
          ĐĂNG KÝ
        </h1>

        {/* Full Name */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="fullName"
            className="w-32 text-base font-medium text-right"
          >
            Họ và tên:
          </label>
          <Input
            id="fullName"
            type="text"
            className="flex-1 h-11 text-base border border-green-600"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

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

        {/* Email */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="email"
            className="w-32 text-base font-medium text-right"
          >
            Email:
          </label>
          <Input
            id="email"
            type="email"
            className="flex-1 h-11 text-base border border-green-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              type={showPassword ? "text" : "password"} // Ẩn, hiện mật khẩu
              className="flex-1 h-11 text-base border border-green-600"
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
        <div className="flex items-center gap-3">
          <label
            htmlFor="confirmPassword"
            className="w-32 text-base font-medium text-right"
          >
            Xác nhận:
          </label>
          <div className="relative flex-1">
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"} // Ẩn, hiện mật khẩu
              className="flex-1 h-11 text-base border border-green-600"
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
        <div className="flex items-center gap-2 pl-36 mt-2">
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
          className="w-full h-11 text-base font-semibold bg-green-600 hover:bg-green-700 mt-2 cursor-pointer"
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
  );
}

export default Register;
