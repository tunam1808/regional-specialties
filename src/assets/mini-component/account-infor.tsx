import { useEffect, useState } from "react";

// import các file gọi API
import { getProfile } from "@/api/get-profile";
import { updateUser } from "@/api/update-user";
import { uploadAvatar } from "@/api/upload-image";
import { getProvinces, getDistricts, getWards } from "@/api/address";

// import các file định nghĩa kiểu (Interface)
import type { Province, District, Ward } from "@/types/address.type";
import type { User } from "@/types/guest.type";

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
          DiaChiChiTiet: u.DiaChiChiTiet || "",
        });
      })
      .catch(() => setUser(null))
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
  if (!user) return <p className="text-center mt-10">⚠️ Chưa đăng nhập</p>;

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    navigate("/login");
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
      showError("Lỗi khi cập nhật: " + (err.message || "Không xác định"));
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
      const finalUrl = `${uploadedUrl}?v=${Date.now()}`;

      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, avatar: finalUrl };
        localStorage.setItem("user", JSON.stringify(updated));
        return updated;
      });

      showSuccess("Ảnh đại diện đã được cập nhật!");
    } catch (err: any) {
      showError("Lỗi upload ảnh: " + (err.message || "Không xác định"));
    } finally {
      e.target.value = "";
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition"
      >
        <FaArrowLeft /> Quay lại
      </button>

      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Cover + Avatar */}
        <div className="relative">
          <div className="h-28 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2">
            <div className="relative group">
              <img
                src={user.avatar ? `${user.avatar}` : avt}
                key={user.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition rounded-full cursor-pointer"
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

        {/* Thông tin */}
        <div className="pt-16 pb-6 px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {user.fullname || user.HoTen}
          </h2>
          <p className="text-sm text-gray-500">@{user.username}</p>
          <p className="mt-2 text-sm text-gray-600">{user.email}</p>
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

        {/* Chi tiết */}
        <div className="border-t px-6 py-4 text-sm text-gray-700 space-y-3">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 font-medium">
              <FaCalendarAlt className="text-indigo-500" /> Tham gia:
            </span>
            <span>
              {(user.created_at || user.NgayDangKy)?.slice(0, 10) || "N/A"}
            </span>
          </div>

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

              {/* Dropdown địa chỉ */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-medium">🏙️ Tỉnh/Thành phố</label>
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
                    className="border px-3 py-2 rounded-lg"
                  >
                    <option value="">-- Chọn Tỉnh/Thành --</option>
                    {provinces.map((p) => (
                      <option key={p.code} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-medium">🏘️ Quận/Huyện</label>
                  <select
                    value={formData.QuanHuyen}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        QuanHuyen: e.target.value,
                        PhuongXa: "",
                      })
                    }
                    className="border px-3 py-2 rounded-lg"
                  >
                    <option value="">-- Chọn Quận/Huyện --</option>
                    {districts.map((d) => (
                      <option key={d.code} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-medium">🏠 Phường/Xã</label>
                  <select
                    value={formData.PhuongXa}
                    onChange={(e) =>
                      setFormData({ ...formData, PhuongXa: e.target.value })
                    }
                    className="border px-3 py-2 rounded-lg"
                  >
                    <option value="">-- Chọn Phường/Xã --</option>
                    {wards.map((w) => (
                      <option key={w.code} value={w.name}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1 col-span-2">
                  <label className="font-medium">📍 Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    value={formData.DiaChiChiTiet}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        DiaChiChiTiet: e.target.value,
                      })
                    }
                    className="border px-3 py-2 rounded-lg"
                  />
                </div>
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
                <span>{user.DiaChiDayDu || "Chưa cập nhật"}</span>
              </div>
            </>
          )}
        </div>

        {/* Nút hành động */}
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
