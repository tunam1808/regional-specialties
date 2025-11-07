import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaMoneyBillWave,
  FaQrcode,
  FaEdit,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import { getProfile } from "@/api/get-profile";
import { updateUser } from "@/api/update-user";
import { getProvinces, getWards } from "@/api/address";
import { showSuccess, showError } from "@/common/toast";

interface CartItem {
  id: number;
  name: string;
  price: number;
  hinhAnh: string;
  quantity: number;
}

interface Customer {
  name: string;
  phone: string;
  address: string;
}

interface Province {
  idProvince: string;
  name: string;
}

interface Ward {
  id: string;
  name: string;
}

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    phone: "",
    address: "",
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [, setWards] = useState<Ward[]>([]);
  const [selectedTinhThanh, setSelectedTinhThanh] = useState<string>("");
  const [selectedPhuongXa, setSelectedPhuongXa] = useState<string>("");
  const [diaChiChiTiet, setDiaChiChiTiet] = useState<string>("");

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("cod");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPhone, setEditPhone] = useState("");
  const [editDiaChiChiTiet, setEditDiaChiChiTiet] = useState("");
  const [editTinhThanh, setEditTinhThanh] = useState("");
  const [editPhuongXa, setEditPhuongXa] = useState("");
  const [editWards, setEditWards] = useState<Ward[]>([]);

  const navigate = useNavigate();

  /* -------------------------------------------------------------------------- */
  /*  1. LOAD PROVINCES                                                         */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoadingAddress(true);
        const data = await getProvinces();
        setProvinces(data);
      } catch (err) {
        console.error("Lỗi load tỉnh:", err);
      } finally {
        setLoadingAddress(false);
      }
    };
    loadProvinces();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*  2. LOAD CART + PROFILE                                                    */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const savedCart = localStorage.getItem("cart_checkout");
    if (savedCart) setCart(JSON.parse(savedCart));

    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setCustomer({
          name: profile.fullname || profile.HoTen || "",
          phone: profile.SoDienThoai || "",
          address: profile.DiaChiDayDu || "",
        });
        setUserId(profile.id ? String(profile.id) : null);

        if (profile.DiaChiDayDu && provinces.length > 0) {
          parseAddressFromProfile(profile.DiaChiDayDu);
        }
      } catch (err) {
        console.error("Lỗi lấy profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [provinces]);

  useEffect(() => {
    if (provinces.length > 0 && customer.address && !selectedTinhThanh) {
      parseAddressFromProfile(customer.address);
    }
  }, [provinces, customer.address]);

  /* -------------------------------------------------------------------------- */
  /*  3. LOAD WARDS KHI CÓ TỈNH                                                 */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!selectedTinhThanh) {
      setWards([]);
      setSelectedPhuongXa("");
      return;
    }

    const prov = provinces.find((p) => p.name === selectedTinhThanh);
    if (!prov?.idProvince) return;

    const loadWards = async () => {
      try {
        setLoadingAddress(true);
        const data = await getWards(prov.idProvince);
        setWards(data);
      } catch (err) {
        console.error("Lỗi load phường/xã:", err);
        setWards([]);
      } finally {
        setLoadingAddress(false);
      }
    };
    loadWards();
  }, [selectedTinhThanh, provinces]);

  /* -------------------------------------------------------------------------- */
  /*  4. GHÉP ĐỊA CHỈ ĐẦY ĐỦ                                                    */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const fullAddress = [diaChiChiTiet, selectedPhuongXa, selectedTinhThanh]
      .filter(Boolean)
      .join(", ")
      .trim()
      .replace(/, $/, "");
    setCustomer((prev) => ({ ...prev, address: fullAddress }));
  }, [diaChiChiTiet, selectedPhuongXa, selectedTinhThanh]);

  /* -------------------------------------------------------------------------- */
  /*  5. PARSE ĐỊA CHỈ TỪ DiaChiDayDu                                           */
  /* -------------------------------------------------------------------------- */
  const parseAddressFromProfile = (fullAddress: string) => {
    const parts = fullAddress.split(",").map((p) => p.trim());
    if (parts.length < 3) return;

    const tinhRaw = parts[parts.length - 1];
    const phuongRaw = parts[parts.length - 2];
    const chiTiet = parts.slice(0, -2).join(", ");

    const clean = (str: string) =>
      str
        .replace(/^(Phường|Xã|Thị trấn|Quận|Huyện|Tỉnh|Thành phố)\s+/gi, "")
        .trim();

    const cleanTinh = clean(tinhRaw);
    const cleanPhuong = clean(phuongRaw);

    const prov = provinces.find(
      (p) => p.name.includes(cleanTinh) || cleanTinh.includes(p.name)
    );
    if (!prov) return;

    setSelectedTinhThanh(prov.name);
    setDiaChiChiTiet(chiTiet);

    getWards(prov.idProvince)
      .then((wardList) => {
        setWards(wardList);
        const ward = wardList.find(
          (w: Ward) =>
            w.name.includes(cleanPhuong) || cleanPhuong.includes(w.name)
        );
        if (ward) setSelectedPhuongXa(ward.name);
      })
      .catch(console.error);
  };

  /* -------------------------------------------------------------------------- */
  /*  6. MỞ MODAL CHỈNH SỬA                                                     */
  /* -------------------------------------------------------------------------- */
  const openEditModal = () => {
    setEditPhone(customer.phone);
    setEditDiaChiChiTiet(diaChiChiTiet);
    setEditTinhThanh(selectedTinhThanh);
    setEditPhuongXa(selectedPhuongXa);

    if (selectedTinhThanh) {
      const prov = provinces.find((p) => p.name === selectedTinhThanh);
      if (prov) {
        getWards(prov.idProvince).then(setEditWards).catch(console.error);
      }
    }

    setIsModalOpen(true);
  };

  /* -------------------------------------------------------------------------- */
  /*  7. LOAD WARDS TRONG MODAL                                                 */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!editTinhThanh || !isModalOpen) {
      setEditWards([]);
      return;
    }

    const prov = provinces.find((p) => p.name === editTinhThanh);
    if (!prov?.idProvince) return;

    getWards(prov.idProvince)
      .then(setEditWards)
      .catch((err) => {
        console.error("Lỗi load phường trong modal:", err);
        setEditWards([]);
      });
  }, [editTinhThanh, isModalOpen, provinces]);

  /* -------------------------------------------------------------------------- */
  /*  8. LƯU THAY ĐỔI                                                           */
  /* -------------------------------------------------------------------------- */
  const handleSaveEdit = async () => {
    if (!editPhone || !editDiaChiChiTiet || !editTinhThanh || !editPhuongXa) {
      showError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (!/^\d{10,11}$/.test(editPhone)) {
      showError("Số điện thoại phải có 10-11 chữ số!");
      return;
    }

    if (editDiaChiChiTiet.length < 5 || editDiaChiChiTiet.length > 200) {
      showError("Địa chỉ chi tiết phải từ 5-200 ký tự!");
      return;
    }

    if (!userId) {
      showError("Không tìm thấy thông tin người dùng!");
      return;
    }

    try {
      await updateUser(userId, {
        SoDienThoai: editPhone,
        TinhThanh: editTinhThanh,
        PhuongXa: editPhuongXa,
        DiaChiChiTiet: editDiaChiChiTiet,
      });

      setCustomer((prev) => ({ ...prev, phone: editPhone }));
      setDiaChiChiTiet(editDiaChiChiTiet);
      setSelectedTinhThanh(editTinhThanh);
      setSelectedPhuongXa(editPhuongXa);

      setIsModalOpen(false);
      showSuccess("Cập nhật thông tin giao hàng thành công!");
    } catch (err: any) {
      const msg = err.message || "Lỗi cập nhật";
      if (msg.includes("Token") || msg.includes("hết hạn")) {
        showError("Phiên đăng nhập hết hạn!");
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login");
      } else {
        showError("Lỗi: " + msg);
      }
    }
  };

  /* -------------------------------------------------------------------------- */
  /*  TÍNH TỔNG TIỀN                                                            */
  /* -------------------------------------------------------------------------- */
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getImageUrl = (hinhAnh: string | undefined) => {
    if (!hinhAnh) return "/img-produce/default.jpg";
    if (hinhAnh.startsWith("http")) return hinhAnh;
    if (
      hinhAnh.startsWith("/img-produce") ||
      hinhAnh.startsWith("/img-introduce")
    )
      return hinhAnh;
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
    return `${baseUrl}${hinhAnh}`;
  };

  /* -------------------------------------------------------------------------- */
  /*  XỬ LÝ ĐẶT HÀNG                                                            */
  /* -------------------------------------------------------------------------- */
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.name || !customer.phone || !customer.address) {
      showSuccess("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (paymentMethod === "cod") {
      alert(
        `Đặt hàng thành công!\n\nCảm ơn ${
          customer.name
        }.\nTổng tiền: ${total.toLocaleString("vi-VN")}₫\nĐịa chỉ: ${
          customer.address
        }`
      );
      localStorage.removeItem("cart_checkout");
      navigate("/");
    } else {
      try {
        const res = await axios.post(
          "https://your-backend-production.up.railway.app/api/payment/momo",
          {
            amount: total,
            orderId: Date.now().toString(),
            orderInfo: `Thanh toán đơn hàng #${Date.now()}`,
          }
        );
        if (res.data.payUrl) window.location.href = res.data.payUrl;
        else showError("Không thể tạo thanh toán MoMo!");
      } catch (error) {
        console.error(error);
        showError("Lỗi khi tạo thanh toán online!");
      }
    }
  };

  /* -------------------------------------------------------------------------- */
  /*  UI – LOADING                                                             */
  /* -------------------------------------------------------------------------- */
  if (loadingProfile || loadingAddress) {
    return (
      <div className="text-center py-20 text-gray-600">
        Đang tải thông tin khách hàng và địa chỉ...
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*  RENDER                                                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* NÚT QUAY LẠI – ĐẶT Ở ĐẦU TRANG */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition transform hover:-translate-y-0.5 shadow-md"
        >
          <FaArrowLeft /> Quay lại
        </button>

        <h1 className="text-4xl font-bold text-green-700 text-center flex-1 md:flex-none">
          Thanh toán đơn hàng
        </h1>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-10 text-gray-600">
          <p>Giỏ hàng trống, vui lòng quay lại mua sắm.</p>
          <Button
            className="mt-4 bg-green-500 text-white hover:bg-green-600"
            onClick={() => navigate("/products")}
          >
            Quay lại cửa hàng
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* ---------- FORM ---------- */}
          <form
            onSubmit={handleCheckout}
            className="bg-white shadow-lg rounded-lg p-6 border border-gray-100"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Thông tin giao hàng
            </h2>

            <div className="space-y-4">
              {/* Họ tên */}
              <div>
                <label className="block mb-1 font-medium">Họ và tên</label>
                <p className="p-2 bg-gray-50 rounded-md text-gray-700">
                  {customer.name || "Chưa có"}
                </p>
              </div>

              {/* SĐT + Địa chỉ */}
              <div className="space-y-3">
                <div>
                  <label className="block mb-1 font-medium">
                    Số điện thoại
                  </label>
                  <p className="p-2 bg-gray-50 rounded-md text-gray-700">
                    {customer.phone || "Chưa cập nhật"}
                  </p>
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    Địa chỉ nhận hàng
                  </label>
                  <p className="p-2 bg-gray-50 rounded-md text-gray-700">
                    {customer.address || "Chưa cập nhật"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openEditModal}
                  className="flex items-center gap-2 w-full justify-center py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  <FaEdit /> Chỉnh sửa thông tin giao hàng
                </button>
              </div>

              {/* Phương thức thanh toán */}
              <div>
                <label className="block mb-2 font-medium">
                  Phương thức thanh toán
                </label>
                <div className="space-y-3">
                  <label
                    className={`flex items-center justify-between p-3 border rounded-md cursor-pointer ${
                      paymentMethod === "cod"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <div className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-green-600 text-xl" />
                      <span>Thanh toán khi nhận hàng (COD)</span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      readOnly
                    />
                  </label>

                  <label
                    className={`flex items-center justify-between p-3 border rounded-md cursor-pointer ${
                      paymentMethod === "online"
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("online")}
                  >
                    <div className="flex items-center gap-2">
                      <FaQrcode className="text-purple-600 text-xl" />
                      <span>Thanh toán online (MoMo / QR)</span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "online"}
                      readOnly
                    />
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className={`w-full py-3 text-white rounded-md mt-4 ${
                  paymentMethod === "cod"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {paymentMethod === "cod"
                  ? "Xác nhận đặt hàng"
                  : "Thanh toán online"}
              </Button>
            </div>
          </form>

          {/* ---------- ĐƠN HÀNG ---------- */}
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Đơn hàng của bạn
            </h2>
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center py-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl(item.hinhAnh)}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md border"
                      onError={(e) => {
                        e.currentTarget.src = "/img-produce/default.jpg";
                      }}
                    />
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        SL: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold">
                    {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t pt-4 flex justify-between text-lg font-semibold">
              <span>Tổng cộng:</span>
              <span className="text-yellow-600">
                {total.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL CHỈNH SỬA ==================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>

            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Chỉnh sửa thông tin giao hàng
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Số điện thoại</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="0987654321"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Số nhà, đường</label>
                <input
                  type="text"
                  value={editDiaChiChiTiet}
                  onChange={(e) => setEditDiaChiChiTiet(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="123 Đường Láng"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Tỉnh/Thành phố</label>
                <select
                  value={editTinhThanh}
                  onChange={(e) => {
                    setEditTinhThanh(e.target.value);
                    setEditPhuongXa("");
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">-- Chọn Tỉnh/Thành --</option>
                  {provinces.map((p) => (
                    <option key={p.idProvince} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Phường/Xã</label>
                <select
                  value={editPhuongXa}
                  onChange={(e) => setEditPhuongXa(e.target.value)}
                  disabled={!editTinhThanh}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
                >
                  <option value="">-- Chọn Phường/Xã --</option>
                  {editWards.map((w) => (
                    <option key={w.id} value={w.name}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSaveEdit}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Lưu thay đổi
              </Button>
              <Button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
