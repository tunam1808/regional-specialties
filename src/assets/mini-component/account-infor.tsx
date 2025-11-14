import { useEffect, useState } from "react";

// import API
import { getProfile } from "@/api/get-profile";
import { updateUser } from "@/api/update-user";
import { uploadAvatar } from "@/api/upload-image";
import { getProvinces, getWards } from "@/api/address";

// import types
import type { User } from "@/types/guest.type";

// import assets
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

// CSS (giữ nguyên)
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
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5); 
    z-index: 0;
  }

  .profile-content { position: relative; z-index: 10; padding: 1.5rem; }
  .profile-card { border: 5px solid #4f46e5; }

  .back-button {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.5rem 1.5rem; background-color: #4f46e5; color: white;
    border-radius: 0.75rem; font-weight: 500;
    transition: background-color 0.3s, transform 0.2s;
  }
  .back-button:hover { background-color: #4338ca; transform: translateY(-1px); }

  @media (max-width: 640px) {
    .profile-background, .profile-content { padding: 1rem; }
  }
`;

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const [formData, setFormData] = useState<{
    SoDienThoai?: string;
    TinhThanh?: string;
    TinhThanhCode?: string;
    PhuongXa?: string;
    PhuongXaCode?: string;
    DiaChiChiTiet?: string;
  }>({});

  const navigate = useNavigate();

  // === 1. LẤY USER ===
  useEffect(() => {
    console.log("🔄 [LOG] Bắt đầu load profile...");
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      console.log("❌ [LOG] Không có token → redirect login");
      setLoading(false);
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    getProfile()
      .then((data) => {
        const u = data.user || data;
        console.log("✅ [LOG] Load user thành công:", {
          fullname: u.fullname || u.HoTen,
          TinhThanh: u.TinhThanh,
          PhuongXa: u.PhuongXa,
        });
        setUser({ ...u, id: Number(u.id) });
        setFormData({
          SoDienThoai: u.SoDienThoai || "",
          TinhThanh: u.TinhThanh || "",
          PhuongXa: u.PhuongXa || "",
          DiaChiChiTiet: u.DiaChi ?? "",
        });
      })
      .catch((err) => {
        console.error("❌ [LOG] Lỗi load profile:", err);
        showError("Phiên đăng nhập đã hết hạn!");
        setTimeout(() => navigate("/login"), 2000);
        setUser(null);
      })
      .finally(() => {
        console.log("🔄 [LOG] Kết thúc load profile");
        setLoading(false);
      });
  }, [navigate]);

  // === 2. LOAD PROVINCES ===
  useEffect(() => {
    if (user || editing) {
      console.log("🚀 [FRONTEND] Bắt đầu load provinces...");
      getProvinces()
        .then((data) => {
          console.log("🌟 [FRONTEND] getProvinces() trả về:", data);
          if (Array.isArray(data) && data.length > 0) {
            console.log("✅ [FRONTEND] Tải tỉnh thành công:", data.length);
            setProvinces(data);
          } else {
            console.warn("⚠️ [FRONTEND] Provinces rỗng");
            setProvinces([]);
          }
        })
        .catch((err) => {
          console.error("❌ [FRONTEND] Lỗi API provinces:", err);
          setProvinces([]);
        });
    }
  }, [user, editing]);

  // === 3. TỰ ĐỘNG SET TinhThanhCode KHI CÓ TỈNH ===
  useEffect(() => {
    if (provinces.length > 0 && formData.TinhThanh && !formData.TinhThanhCode) {
      const prov = provinces.find((p) => p.name === formData.TinhThanh);
      if (prov) {
        console.log("✅ [LOG] Auto set TinhThanhCode:", prov.idProvince);
        setFormData((prev) => ({
          ...prev,
          TinhThanhCode: prov.idProvince,
        }));
      }
    }
  }, [provinces, formData.TinhThanh]);

  // === 4. LOAD PHƯỜNG/XÃ KHI CÓ TỈNH ===
  useEffect(() => {
    if (formData.TinhThanhCode) {
      console.log("🚀 [LOG] Load wards cho tỉnh:", formData.TinhThanhCode);
      getWards(formData.TinhThanhCode)
        .then((data) => {
          if (Array.isArray(data)) {
            console.log("✅ [LOG] Wards loaded:", data.length);
            setWards(data);
          } else {
            setWards([]);
          }
        })
        .catch((err) => {
          console.error("❌ [LOG] Lỗi getWards:", err);
          setWards([]);
        });
    } else {
      setWards([]);
    }
  }, [formData.TinhThanhCode]);

  // === RENDER LOADING / ERROR ===
  if (loading) return <p className="text-center mt-10">Đang tải...</p>;
  if (!user)
    return (
      <p className="text-center mt-10 text-gray-500">
        Không tìm thấy thông tin người dùng.
      </p>
    );

  // === LOGOUT ===
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    navigate("/login");
    showSuccess("Đã đăng xuất thành công!");
  };

  // === CẬP NHẬT ===
  const handleUpdate = async () => {
    console.log("💾 [LOG] Bắt đầu update với payload:", formData);
    if (!user?.id) return;
    if (!formData.SoDienThoai || !/^\d{10,11}$/.test(formData.SoDienThoai)) {
      showError("Số điện thoại phải là 10-11 chữ số!");
      return;
    }
    if (
      !formData.DiaChiChiTiet ||
      formData.DiaChiChiTiet.length < 5 ||
      formData.DiaChiChiTiet.length > 200
    ) {
      showError("Địa chỉ chi tiết phải từ 5-200 ký tự!");
      return;
    }

    const payload = {
      SoDienThoai: formData.SoDienThoai,
      TinhThanh: formData.TinhThanh,
      PhuongXa: formData.PhuongXa,
      DiaChiChiTiet: formData.DiaChiChiTiet,
    };

    try {
      const updated = await updateUser(user.id.toString(), payload);
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
      showSuccess("Cập nhật thành công!");
    } catch (err: any) {
      console.error("❌ [LOG] Lỗi update:", err);
      const msg = err.response?.data?.message || err.message || "Lỗi";
      if (msg.includes("Token") || msg.includes("hết hạn")) {
        showError("Phiên đăng nhập đã hết hạn!");
        setTimeout(() => {
          localStorage.clear();
          sessionStorage.clear();
          navigate("/login");
        }, 2000);
      } else {
        showError("Lỗi cập nhật: " + msg);
      }
    }
  };

  // === UPLOAD AVATAR ===
  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return showError("Chưa chọn file!");

    try {
      setUploading(true);
      const uploadedUrl = await uploadAvatar(file, user.id);
      const finalUrl = `${uploadedUrl}?v=${Date.now()}`;
      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, avatar: finalUrl };
        localStorage.setItem("user", JSON.stringify(updated));
        return updated;
      });
      showSuccess("Cập nhật ảnh thành công!");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      if (msg.includes("Token") || msg.includes("hết hạn")) {
        showError("Phiên đăng nhập đã hết hạn!");
        setTimeout(() => {
          localStorage.clear();
          sessionStorage.clear();
          navigate("/login");
        }, 2000);
      } else {
        showError("Lỗi upload: " + msg);
      }
    } finally {
      e.target.value = "";
      setUploading(false);
    }
  };

  // === RENDER ===
  return (
    <>
      <style>{backgroundStyles}</style>
      <div className="profile-background">
        <div className="max-w-3xl mx-auto p-6 profile-content">
          <button onClick={() => navigate(-1)} className="mb-6 back-button">
            <FaArrowLeft /> Quay lại
          </button>

          <div className="bg-gradient-to-b from-indigo-50 to-purple-50 rounded-3xl shadow-xl overflow-hidden profile-card">
            {/* Avatar */}
            <div className="relative">
              <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <div className="absolute left-1/2 -bottom-16 transform -translate-x-1/2">
                <div className="relative group">
                  <img
                    src={
                      user.avatar
                        ? user.avatar.startsWith("http")
                          ? user.avatar
                          : `${import.meta.env.VITE_BASE_SERVER}${user.avatar}`
                        : avt
                    }
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

            {/* Info */}
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
                <div className="p-4 bg-white rounded-xl shadow hover:shadow-md transition">
                  <div className="flex items-center gap-2 font-medium text-indigo-500">
                    <FaCalendarAlt /> Tham gia
                  </div>
                  <div>
                    {(user.created_at || user.NgayDangKy)?.slice(0, 10) ||
                      "N/A"}
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl shadow hover:shadow-md transition">
                  <div className="flex items-center gap-2 font-medium text-green-500">
                    <FaPhoneAlt /> SĐT
                  </div>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.SoDienThoai || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          SoDienThoai: e.target.value,
                        })
                      }
                      className="mt-2 w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
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
                    {/* TỈNH */}
                    <select
                      value={formData.TinhThanh || ""}
                      onChange={(e) => {
                        const name = e.target.value;
                        const prov = provinces.find((p) => p.name === name);
                        console.log(
                          "🎯 [LOG] Chọn tỉnh:",
                          name,
                          "→ Code:",
                          prov?.idProvince
                        );
                        setFormData({
                          ...formData,
                          TinhThanh: name,
                          TinhThanhCode: prov?.idProvince || "", // ← DÙNG idProvince
                          PhuongXa: "",
                          PhuongXaCode: "",
                        });
                      }}
                      className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                    >
                      <option value="">-- Chọn Tỉnh/Thành --</option>
                      {provinces.map((p) => (
                        <option key={p.idProvince} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>

                    {/* PHƯỜNG/XÃ */}
                    <select
                      value={formData.PhuongXa || ""}
                      onChange={(e) => {
                        const name = e.target.value;
                        const ward = wards.find((w) => w.name === name);
                        console.log(
                          "🎯 [LOG] Chọn xã:",
                          name,
                          "→ Code:",
                          ward?.id
                        );
                        setFormData({
                          ...formData,
                          PhuongXa: name,
                          PhuongXaCode: ward?.id || "", // ← DÙNG id
                        });
                      }}
                      className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                    >
                      <option value="">-- Chọn Phường/Xã --</option>
                      {wards.map((w) => (
                        <option key={w.id} value={w.name}>
                          {w.name}
                        </option>
                      ))}
                    </select>

                    {/* ĐỊA CHỈ CHI TIẾT */}
                    <input
                      type="text"
                      value={formData.DiaChiChiTiet || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          DiaChiChiTiet: e.target.value,
                        })
                      }
                      placeholder="Địa chỉ chi tiết"
                      className="md:col-span-2 w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
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
