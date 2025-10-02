import { useEffect, useState } from "react";
import { getProfile } from "@/api/get-profile";
import { updateUser } from "@/api/update-user";
import { showSuccess, showError } from "@/common/toast";
import avt from "@/assets/images/default.jpg";
import {
  FaCalendarAlt,
  FaPhoneAlt,
  FaHome,
  FaEdit,
  FaSignOutAlt,
  FaArrowLeft,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  fullname: string;
  username: string;
  email?: string;
  role?: "user" | "admin";
  avatar?: string | null;
  created_at?: string;
  updated_at?: string;

  // Các field bổ sung từ BE
  MaKH?: number;
  HoTen?: string;
  SoDienThoai?: string;
  DiaChi?: string;
  NgayDangKy?: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<{
    SoDienThoai?: string;
    DiaChi?: string;
  }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    getProfile()
      .then((data) => {
        const u = data.user || data;
        setUser({
          ...u,
          id: Number(u.id), // Ép kiểu về number
        });
        setFormData({
          SoDienThoai: u.SoDienThoai || "",
          DiaChi: u.DiaChi || "",
        });
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">⏳ Đang tải...</p>;
  if (!user) return <p className="text-center mt-10">⚠️ Chưa đăng nhập</p>;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const handleUpdate = async () => {
    try {
      if (!user?.id) return;

      // Validation cơ bản
      if (!formData.SoDienThoai || !/^\d{10,11}$/.test(formData.SoDienThoai)) {
        alert("Số điện thoại phải là 10-11 chữ số!");
        return;
      }
      if (
        !formData.DiaChi ||
        formData.DiaChi.length < 5 ||
        formData.DiaChi.length > 200
      ) {
        alert("Địa chỉ phải từ 5-200 ký tự!");
        return;
      }

      const updated = await updateUser(user.id.toString(), formData);
      setUser((prev) =>
        prev
          ? {
              ...prev,
              ...updated.data,
              id: Number(updated.data.user_id ?? prev.id),
            }
          : prev
      ); // Sử dụng data từ API response
      setEditing(false);
      showSuccess("Cập nhật thành công");
    } catch (err: any) {
      showError("Lỗi cập nhật: " + (err.message || "Unknown"));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      {/* Nút quay lại */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition"
      >
        <FaArrowLeft /> Quay lại
      </button>

      {/* Card */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Cover + Avatar */}
        <div className="relative">
          <div className="h-28 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2">
            <img
              src={user.avatar || avt}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            />
          </div>
        </div>

        {/* Info */}
        <div className="pt-16 pb-6 px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {user.fullname || user.HoTen}
          </h2>
          <p className="text-sm text-gray-500">@{user.username}</p>
          <p className="mt-2 text-sm text-gray-600">{user.email}</p>

          {/* Vai trò */}
          <span
            className={`inline-block mt-3 px-3 py-1 text-sm rounded-full font-medium ${
              user.role === "admin"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {user.role}
          </span>
        </div>

        {/* Details */}
        <div className="border-t px-6 py-4 text-sm text-gray-700 space-y-3">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 font-medium">
              <FaCalendarAlt className="text-indigo-500" /> Tham gia:
            </span>
            <span>
              {(user.created_at || user.NgayDangKy)?.slice(0, 10) || "N/A"}
            </span>
          </div>

          {/* Nếu đang chỉnh sửa thì show input */}
          {editing ? (
            <>
              <div className="flex flex-col gap-1">
                <label className="font-medium">📞 Số điện thoại</label>
                <input
                  type="text"
                  value={formData.SoDienThoai}
                  onChange={(e) =>
                    setFormData({ ...formData, SoDienThoai: e.target.value })
                  }
                  className="border px-3 py-2 rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-medium">🏠 Địa chỉ</label>
                <input
                  type="text"
                  value={formData.DiaChi}
                  onChange={(e) =>
                    setFormData({ ...formData, DiaChi: e.target.value })
                  }
                  className="border px-3 py-2 rounded-lg"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 font-medium">
                  <FaPhoneAlt className="text-green-500" /> SĐT:
                </span>
                <span>{user.SoDienThoai || "Chưa cập nhật"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 font-medium">
                  <FaHome className="text-orange-500" /> Địa chỉ:
                </span>
                <span>{user.DiaChi || "Chưa cập nhật"}</span>
              </div>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-6 pb-6 flex justify-center gap-4">
          {editing ? (
            <>
              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
              >
                <FaSave /> Lưu
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
              >
                <FaTimes /> Hủy
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
            >
              <FaEdit /> Cập nhật
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
          >
            <FaSignOutAlt /> Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
