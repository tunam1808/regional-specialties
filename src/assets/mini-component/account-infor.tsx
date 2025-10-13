import { useEffect, useState } from "react";

// import các file gọi API
import { getProfile } from "@/api/get-profile";
import { updateUser } from "@/api/update-user";
import { uploadAvatar } from "@/api/upload-image";
import { getProvinces, getDistricts, getWards } from "@/api/address";

// import các file định nghĩa kiểu (Interface)
import type { Province, District, Ward } from "@/types/address.type";
import type { User } from "@/types/guest.type";

// import ảnh nền
import backgroundImage from "@/assets/images/bg.jpg";
import avt from "@/assets/images/default.jpg";

import { showSuccess, showError } from "@/common/toast";
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

// Thêm CSS cho background và viền
const backgroundStyles = `
  .profile-background {
    background-image: url(${backgroundImage});
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    min-height: 100vh;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  .profile-background::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); 
    z-index: 0;
  }

  .profile-content {
    position: relative;
    z-index: 10;
    background: transparent;
    padding: 1.5rem;
  }

  .profile-card {
    border: 5px solid #4f46e5; 
  }

  .back-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1.5rem;
    background-color: #4f46e5; /* Màu giống các button khác */
    color: white;
    border-radius: 0.75rem;
    font-weight: 500;
    transition: background-color 0.3s, transform 0.2s;
  }

  .back-button:hover {
    background-color: #4338ca; /* Hiệu ứng hover */
    transform: translateY(-1px);
  }

  @media (max-width: 640px) {
    .profile-background {
      padding: 1rem;
    }
    .profile-content {
      padding: 1rem;
    }
  }
`;

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [formData, setFormData] = useState<{
    SoDienThoai?: string;
    TinhThanh?: string;
    QuanHuyen?: string;
    PhuongXa?: string;
    DiaChiChiTiet?: string;
  }>({});
  const navigate = useNavigate();

  // Lấy dữ liệu người dùng
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setLoading(false);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    getProfile()
      .then((data) => {
        const u = data.user || data;
        setUser({ ...u, id: Number(u.id) });
        setFormData({
          SoDienThoai: u.SoDienThoai || "",
          TinhThanh: u.TinhThanh || "",
          QuanHuyen: u.QuanHuyen || "",
          PhuongXa: u.PhuongXa || "",
          DiaChiChiTiet: u.DiaChi ?? "",
        });
      })
      .catch(() => {
        showError("⏳ Phiên đăng nhập đã hết hạn!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Lấy danh sách tỉnh khi bật chế độ chỉnh sửa
  useEffect(() => {
    if (editing) {
      getProvinces()
        .then((data) => setProvinces(data))
        .catch((err) => console.error("Lỗi tải tỉnh:", err));
    }
  }, [editing]);

  // Khi chọn tỉnh → load danh sách huyện
  useEffect(() => {
    if (formData.TinhThanh) {
      const selected = provinces.find((p) => p.name === formData.TinhThanh);
      if (selected)
        getDistricts(selected.code)
          .then((data) => setDistricts(data))
          .catch((err) => console.error("Lỗi tải huyện:", err));
    } else setDistricts([]);
  }, [formData.TinhThanh, provinces]);

  // Khi chọn huyện → load danh sách xã
  useEffect(() => {
    if (formData.QuanHuyen) {
      const selected = districts.find((d) => d.name === formData.QuanHuyen);
      if (selected)
        getWards(selected.code)
          .then((data) => setWards(data))
          .catch((err) => console.error("Lỗi tải xã:", err));
    } else setWards([]);
  }, [districts, formData.QuanHuyen]);

  if (loading) return <p className="text-center mt-10">⏳ Đang tải...</p>;
  if (!user) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.
      </p>
    );
  }

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    navigate("/login");
    showSuccess("Đã đăng xuất thành công!");
  };

  const handleUpdate = async () => {
    try {
      if (!user?.id) return;

      if (!formData.SoDienThoai || !/^\d{10,11}$/.test(formData.SoDienThoai)) {
        alert("Số điện thoại phải là 10-11 chữ số!");
        return;
      }
      if (
        !formData.DiaChiChiTiet ||
        formData.DiaChiChiTiet.length < 5 ||
        formData.DiaChiChiTiet.length > 200
      ) {
        alert("Địa chỉ chi tiết phải từ 5-200 ký tự!");
        return;
      }

      const updated = await updateUser(user.id.toString(), formData);

      setUser((prev) =>
        prev
          ? {
              ...prev,
              ...(updated.data as Partial<User>),
              id: Number(updated.data?.id ?? prev.id),
            }
          : prev
      );

      setEditing(false);
      showSuccess("Cập nhật thông tin thành công!");
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || "Không xác định";

      if (
        msg.includes("Token không tồn tại") ||
        msg.includes("Phiên đăng nhập hết hạn") ||
        msg.includes("Unauthorized")
      ) {
        showError("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        setTimeout(() => {
          localStorage.clear();
          sessionStorage.clear();
          navigate("/login");
        }, 2000);
      } else {
        showError("Lỗi khi cập nhật: " + msg);
        setTimeout(() => {
          localStorage.clear();
          sessionStorage.clear();
          navigate("/login");
        }, 2000);
      }
    }
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) {
      showError("Chưa chọn file hoặc chưa đăng nhập!");
      return;
    }

    try {
      setUploading(true);
      const uploadedUrl = await uploadAvatar(file, user.id);

      if (!uploadedUrl) throw new Error("Upload thất bại!");

      const finalUrl = `${uploadedUrl}?v=${Date.now()}`;

      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, avatar: finalUrl };
        localStorage.setItem("user", JSON.stringify(updated));
        return updated;
      });

      showSuccess("Ảnh đại diện đã được cập nhật!");
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || "Không xác định";

      if (
        msg.includes("Token không tồn tại") ||
        msg.includes("Phiên đăng nhập hết hạn") ||
        msg.includes("Unauthorized")
      ) {
        showError("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        setTimeout(() => {
          localStorage.clear();
          sessionStorage.clear();
          navigate("/login");
        }, 2000);
      } else {
        showError("Lỗi upload ảnh: " + msg);
      }
    } finally {
      e.target.value = "";
      setUploading(false);
    }
  };

  return (
    <>
      <style>{backgroundStyles}</style>
      <div className="profile-background">
        <div className="max-w-3xl mx-auto p-6 profile-content">
          {/* Back button */}
          <button onClick={() => navigate(-1)} className="mb-6 back-button">
            <FaArrowLeft /> Quay lại
          </button>

          {/* Profile Card */}
          <div className="bg-gradient-to-b from-indigo-50 to-purple-50 rounded-3xl shadow-xl overflow-hidden profile-card">
            {/* Cover + Avatar */}
            <div className="relative">
              <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <div className="absolute left-1/2 -bottom-16 transform -translate-x-1/2">
                <div className="relative group">
                  <img
                    src={user.avatar || avt}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white opacity-0 group-hover:opacity-100 transition rounded-full cursor-pointer text-sm font-medium"
                  >
                    {uploading ? "Đang tải..." : "Đổi ảnh"}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadAvatar}
                  />
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="pt-20 text-center px-6">
              <h2 className="text-3xl font-bold text-gray-800">
                {user.fullname || user.HoTen}
              </h2>
              <p className="text-sm text-gray-500">@{user.username}</p>
              <p className="mt-1 text-sm text-gray-600">{user.email}</p>
              <span
                className={`inline-block mt-3 px-4 py-1 text-sm rounded-full font-semibold ${
                  user.role === "admin"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {user.role}
              </span>
            </div>

            {/* Details */}
            <div className="px-6 py-6 text-gray-700 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ngày tham gia */}
                <div className="p-4 bg-white rounded-xl shadow hover:shadow-md transition">
                  <div className="flex items-center gap-2 font-medium text-indigo-500">
                    <FaCalendarAlt /> Tham gia
                  </div>
                  <div>
                    {(user.created_at || user.NgayDangKy)?.slice(0, 10) ||
                      "N/A"}
                  </div>
                </div>

                {/* SĐT */}
                <div className="p-4 bg-white rounded-xl shadow hover:shadow-md transition">
                  <div className="flex items-center gap-2 font-medium text-green-500">
                    <FaPhoneAlt /> SĐT
                  </div>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.SoDienThoai}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          SoDienThoai: e.target.value,
                        })
                      }
                      className="mt-2 w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
                    />
                  ) : (
                    <div className="mt-1">
                      {user.SoDienThoai || "Chưa cập nhật"}
                    </div>
                  )}
                </div>
              </div>

              {/* Địa chỉ */}
              <div className="p-4 bg-white rounded-xl shadow hover:shadow-md transition">
                <div className="flex items-center gap-2 font-medium text-orange-500">
                  <FaHome /> Địa chỉ
                </div>
                {editing ? (
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tỉnh/Thành */}
                    <select
                      value={formData.TinhThanh}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          TinhThanh: e.target.value,
                          QuanHuyen: "",
                          PhuongXa: "",
                        })
                      }
                      className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
                    >
                      <option value="">-- Chọn Tỉnh/Thành --</option>
                      {provinces.map((p) => (
                        <option key={p.code} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>

                    {/* Quận/Huyện */}
                    <select
                      value={formData.QuanHuyen}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          QuanHuyen: e.target.value,
                          PhuongXa: "",
                        })
                      }
                      className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
                    >
                      <option value="">-- Chọn Quận/Huyện --</option>
                      {districts.map((d) => (
                        <option key={d.code} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>

                    {/* Phường/Xã */}
                    <select
                      value={formData.PhuongXa}
                      onChange={(e) =>
                        setFormData({ ...formData, PhuongXa: e.target.value })
                      }
                      className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
                    >
                      <option value="">-- Chọn Phường/Xã --</option>
                      {wards.map((w) => (
                        <option key={w.code} value={w.name}>
                          {w.name}
                        </option>
                      ))}
                    </select>

                    {/* Địa chỉ chi tiết */}
                    <input
                      type="text"
                      value={formData.DiaChiChiTiet}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          DiaChiChiTiet: e.target.value,
                        })
                      }
                      placeholder="Địa chỉ chi tiết"
                      className="md:col-span-2 w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
                    />
                  </div>
                ) : (
                  <div className="mt-1">
                    {user.DiaChiDayDu || "Chưa cập nhật"}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex flex-wrap justify-center gap-4">
              {editing ? (
                <>
                  <button
                    onClick={handleUpdate}
                    className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition"
                  >
                    <FaSave /> Lưu
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-800 rounded-xl shadow hover:bg-gray-300 transition"
                  >
                    <FaTimes /> Hủy
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-indigo-500 text-white rounded-xl shadow hover:bg-indigo-600 transition"
                >
                  <FaEdit /> Chỉnh sửa
                </button>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-800 rounded-xl shadow hover:bg-gray-300 transition"
              >
                <FaSignOutAlt /> Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
