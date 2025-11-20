import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/button";
import { useNavigate } from "react-router-dom";
import {
  FaMoneyBillWave,
  FaQrcode,
  FaEdit,
  FaTimes,
  FaArrowLeft,
  FaCopy,
  FaCheck,
  FaPaypal,
} from "react-icons/fa";
import { getProfile } from "@/api/get-profile";
import { updateUser } from "@/api/update-user";
import { getProvinces, getWards } from "@/api/address";
import { showSuccess, showError } from "@/common/toast";
import {
  checkoutCart,
  checkoutDirectly,
  getOrderById,
  updateOrderStatus,
} from "@/api/order";
import { createPayPalPayment } from "@/api/payment";
import Map from "@/assets/small-function/google-map";
import { buildFullAddressForCenter } from "@/utils/address"; // Tự động nhảy đến tọa độ địa chỉ chính xác của bạn
import { geocodeAddress } from "@/utils/geocode";
import {
  SHOP_LOCATION,
  calculateDistance,
  calculateShippingFee,
} from "@/utils/distance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import { orderSuccessEmail } from "@/utils/emailTemplates";
import { sendEmailAPI } from "@/api/email";

interface CartItem {
  MaSP: number;
  GiaBan: number;
  id: number;
  name: string;
  price: number;
  hinhAnh: string;
  quantity: number;
  checked?: boolean;
  buyNow?: boolean;
  type: "Tại chỗ" | "Đồ khô";
}

interface Customer {
  name: string;
  phone: string;
  address: string;
  email?: string;
}

interface Province {
  idProvince: string;
  name: string;
}

interface Ward {
  id: string;
  name: string;
  idProvince: string; // ← Thêm
  idCommune: string;
}

interface QrModalData {
  qrUrl: string;
  amount: number;
  accountNumber: string;
  accountName: string;
  info: string;
  MaDonHang: string;
}

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    phone: "",
    address: "",
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedTinhThanh, setSelectedTinhThanh] = useState<string>("");
  const [selectedPhuongXa, setSelectedPhuongXa] = useState<string>("");
  const [diaChiChiTiet, setDiaChiChiTiet] = useState<string>("");

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "qr" | "paypal">(
    "cod"
  );
  const [isBuyNow, setIsBuyNow] = useState(false);

  // Modal chỉnh sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPhone, setEditPhone] = useState("");
  const [editDiaChiChiTiet, setEditDiaChiChiTiet] = useState("");
  const [editTinhThanh, setEditTinhThanh] = useState("");
  const [editPhuongXa, setEditPhuongXa] = useState("");
  const [editWards, setEditWards] = useState<Ward[]>([]);

  // Modal QR
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrModalData, setQrModalData] = useState<QrModalData | null>(null);
  const [copiedField, setCopiedField] = useState<string>("");
  const [completingPayment, setCompletingPayment] = useState(false); // Loading nút hoàn tất

  const navigate = useNavigate();
  const isCheckingRef = useRef(false);

  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [distance, setDistance] = useState<number | null>(null);
  const [distanceError, setDistanceError] = useState<string | null>(null);

  /* ========================================================================== */
  /*  TỰ ĐỘNG KIỂM TRA TRẠNG THÁI ĐƠN HÀNG KHI MỞ MODAL QR                     */
  /* ========================================================================== */
  useEffect(() => {
    if (!isQrModalOpen || !qrModalData) {
      isCheckingRef.current = false;
      return;
    }

    isCheckingRef.current = true;

    const checkOrderStatus = async () => {
      if (!isCheckingRef.current) return;

      try {
        const order = await getOrderById(qrModalData.MaDonHang);
        if (order.TrangThai === "Đã xác nhận") {
          showSuccess("Thanh toán thành công! Đơn hàng đã được xác nhận.");
          localStorage.removeItem("cart_checkout");
          setIsQrModalOpen(false);
          navigate(`/orders/success/${qrModalData.MaDonHang}`);
        }
      } catch (err) {
        console.error("Lỗi kiểm tra đơn hàng:", err);
      }
    };

    // Kiểm tra ngay lập tức + mỗi 3 giây
    checkOrderStatus();
    const interval = setInterval(checkOrderStatus, 20000);

    return () => {
      isCheckingRef.current = false;
      clearInterval(interval);
    };
  }, [isQrModalOpen, qrModalData, navigate]);

  /* ========================================================================== */
  /*  1. LOAD CART – SIÊU SẠCH                                                  */
  /* ========================================================================== */
  useEffect(() => {
    const loadCart = () => {
      const raw = localStorage.getItem("cart_checkout");
      console.log("RAW CART_CHECKOUT:", raw);
      if (!raw || raw === "[]" || raw === "null" || raw.trim() === "") {
        console.log("CART_CHECKOUT RỖNG HOẶC NULL → KHÔNG LOAD", { raw });
        localStorage.removeItem("cart_checkout");
        setCart([]);
        setIsBuyNow(false);
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          localStorage.removeItem("cart_checkout");
          setCart([]);
          return;
        }

        if (parsed.length === 1 && parsed[0].buyNow === true) {
          setIsBuyNow(true);
          const item = parsed[0];
          const cleanItem: CartItem = {
            id: item.id || Date.now(),
            MaSP: item.MaSP ?? item.id ?? 0,
            GiaBan: item.GiaBan ?? item.price ?? 0,
            name: item.name || "Sản phẩm",
            price: item.price ?? item.GiaBan ?? 0,
            hinhAnh: item.hinhAnh || "",
            quantity: item.quantity || 1,
            checked: true,
            buyNow: true,
            type: item.LoaiDoAn === "Tại chỗ" ? "Tại chỗ" : "Đồ khô",
          };
          setCart([cleanItem]);
          return;
        }

        setIsBuyNow(false);
        const normalized: CartItem[] = parsed.map((item: any) => ({
          id: item.id || Date.now(),
          MaSP: item.MaSP ?? item.id ?? 0,
          GiaBan: item.GiaBan ?? item.price ?? 0,
          name: item.name || "Sản phẩm",
          price: item.price ?? item.GiaBan ?? 0,
          hinhAnh: item.hinhAnh || "",
          quantity: item.quantity || 1,
          checked: item.checked ?? true,
          buyNow: item.buyNow ?? false,
          type: item.LoaiDoAn === "Tại chỗ" ? "Tại chỗ" : "Đồ khô",
        }));

        setCart(normalized);
        console.log(
          "CART TYPES:",
          normalized.map((item) => ({ name: item.name, type: item.type }))
        );
      } catch (err) {
        console.error("Lỗi parse cart_checkout:", err);
        localStorage.removeItem("cart_checkout");
        setCart([]);
      }
    };

    loadCart();
  }, []);

  /* ========================================================================== */
  /*  2. LOAD PROVINCES                                                         */
  /* ========================================================================== */
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

  /* ========================================================================== */
  /*  3. LOAD PROFILE + PARSE ĐỊA CHỈ                                           */
  /* ========================================================================== */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setCustomer({
          name: profile.fullname || profile.HoTen || "",
          phone: profile.SoDienThoai || "",
          address: profile.DiaChiDayDu || "",
          email: profile.Email || profile.email || "",
        });
        setUserId(profile.id ? String(profile.id) : null);

        if (profile.DiaChiDayDu && provinces.length > 0) {
          parseAddressFromProfile(profile.DiaChiDayDu);
        }
        setLatitude(profile.Latitude ? Number(profile.Latitude) : undefined);
        setLongitude(profile.Longitude ? Number(profile.Longitude) : undefined);
      } catch (err) {
        console.error("Lỗi lấy profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (provinces.length > 0) fetchProfile();
  }, [provinces]);

  /* ========================================================================== */
  /*  4. LOAD WARDS                                                             */
  /* ========================================================================== */
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

  /* ========================================================================== */
  /*  5. GHÉP ĐỊA CHỈ                                                            */
  /* ========================================================================== */
  useEffect(() => {
    const fullAddress = [diaChiChiTiet, selectedPhuongXa, selectedTinhThanh]
      .filter(Boolean)
      .join(", ")
      .trim()
      .replace(/, $/, "");
    if (fullAddress) {
      setCustomer((prev) => ({ ...prev, address: fullAddress }));
    }
  }, [diaChiChiTiet, selectedPhuongXa, selectedTinhThanh]);

  /* ========================================================================== */
  /*  6. PARSE ĐỊA CHỈ TỪ PROFILE                                               */
  /* ========================================================================== */
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

  /* ========================================================================== */
  /*  7. MODAL CHỈNH SỬA                                                        */
  /* ========================================================================== */
  const openEditModal = () => {
    setEditPhone(customer.phone);
    setEditDiaChiChiTiet(diaChiChiTiet);
    setEditTinhThanh(selectedTinhThanh);
    setEditPhuongXa(selectedPhuongXa);
    setEditWards(wards);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!editTinhThanh || !isModalOpen) {
      setEditWards([]);
      return;
    }
    const prov = provinces.find((p) => p.name === editTinhThanh);
    if (prov?.idProvince) {
      getWards(prov.idProvince)
        .then(setEditWards)
        .catch(() => setEditWards([]));
    }
  }, [editTinhThanh, isModalOpen, provinces]);

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
      showSuccess("Cập nhật thành công!");
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

  /* ========================================================================== */
  /*  8. TỰ ĐỘNG NHẢY VÀO TRUNG TÂM PHƯỜNG/XÃ (DÙNG NOMINATIM - MIỄN PHÍ)       */
  /* ========================================================================== */
  useEffect(() => {
    // ƯU TIÊN: Dùng tọa độ từ profile nếu có
    if (latitude != null && longitude != null) return;

    // Chỉ chạy khi có phường + tỉnh (không cần địa chỉ chi tiết)
    if (!selectedPhuongXa || !selectedTinhThanh) return;
    if (provinces.length === 0 || wards.length === 0) return;

    const centerAddress = buildFullAddressForCenter(
      selectedPhuongXa,
      provinces,
      wards
    );

    if (!centerAddress) return;

    let isMounted = true;

    const fetchCenter = async () => {
      const coords = await geocodeAddress(centerAddress);
      if (isMounted && coords) {
        setLatitude(coords.lat);
        setLongitude(coords.lng);
      }
    };

    fetchCenter();

    return () => {
      isMounted = false;
    };
  }, [
    selectedPhuongXa,
    selectedTinhThanh,
    provinces,
    wards,
    latitude,
    longitude,
  ]);

  useEffect(() => {
    if (latitude != null && longitude != null) {
      const dist = calculateDistance(
        SHOP_LOCATION.latitude,
        SHOP_LOCATION.longitude,
        latitude,
        longitude
      );
      const rounded = Number(dist.toFixed(2));
      console.log("[Distance] Updated:", rounded, "km"); // DEBUG
      setDistance(rounded);
    } else {
      console.log("[Distance] Cleared: no coords");
      setDistance(null);
    }
  }, [latitude, longitude]);

  /* ========================================================================== */
  /*  TÍNH TIỀN + HÌNH ẢNH                                                       */
  /* ========================================================================== */
  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price || item.GiaBan) * Number(item.quantity),
    0
  );

  // TÍNH PHÍ SHIP + TỔNG CUỐI
  const shippingFee =
    latitude != null && longitude != null && distance !== null
      ? calculateShippingFee(latitude, longitude)
      : 0;
  const finalTotal = total + shippingFee;

  const getImageUrl = (hinhAnh?: string) => {
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

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 2000);
    } catch {
      showError("Copy thất bại!");
    }
  };

  /* ========================================================================== */
  /*  XỬ LÝ ĐẶT HÀNG                                                            */
  /* ========================================================================== */
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.name || !customer.phone || !customer.address) {
      showError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // MUA NGAY: luôn chọn, GIỎ HÀNG: chỉ chọn checked
    const selectedItems = cart.filter((item) =>
      isBuyNow ? true : item.checked
    );

    if (selectedItems.length === 0) {
      showError("Vui lòng chọn sản phẩm!");
      return;
    }
    // KIỂM TRA: Nếu có sản phẩm "Tại chỗ" nhưng khoảng cách > 2km → LỖI
    // KIỂM TRA: Nếu có "Tại chỗ" → PHẢI có tọa độ + <= 2km
    const hasTaiCho = selectedItems.some((item) => item.type === "Tại chỗ");
    if (hasTaiCho) {
      if (latitude == null || longitude == null) {
        showError("Vui lòng chọn vị trí giao hàng chính xác trên bản đồ!");
        return;
      }
      if (
        distance === null ||
        typeof distance !== "number" ||
        isNaN(distance)
      ) {
        showError("Không thể tính khoảng cách. Vui lòng chọn lại vị trí!");
        return;
      }
      if (distance > 2) {
        setDistanceError(
          `Sản phẩm "Tại chỗ" chỉ giao trong vòng 2km! \nKhoảng cách hiện tại của bạn là: ${distance.toFixed(
            1
          )}km\n Bạn vui lòng chọn "Đồ khô" giúp Shop nha. \nXin lỗi vì sự bất tiện này!`
        );
        return;
      }
    }

    const orderItems = selectedItems.map((item) => ({
      MaSP: item.MaSP,
      SoLuong: item.quantity,
      GiaBanTaiThoiDiem: item.price || item.GiaBan,
    }));

    try {
      let res;

      if (isBuyNow) {
        res = await checkoutDirectly({
          PhuongThucThanhToan:
            paymentMethod === "cod"
              ? "Tiền mặt"
              : paymentMethod === "qr"
              ? "Chuyển khoản"
              : "PayPal",
          DiaChiGiaoHang: customer.address,
          GhiChu:
            paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "Mua ngay",
          items: orderItems,
          KhoangCach: hasTaiCho ? distance! : distance ?? 0, // ← GỬI KHOẢNG CÁCH
          PhiShip: shippingFee,
        });
      } else {
        res = await checkoutCart({
          PhuongThucThanhToan:
            paymentMethod === "cod"
              ? "Tiền mặt"
              : paymentMethod === "qr"
              ? "Chuyển khoản"
              : "PayPal",
          DiaChiGiaoHang: customer.address,
          GhiChu: "Thanh toán khi nhận hàng",
          SanPhamDaChon: selectedItems.map((sp) => sp.MaSP),
          KhoangCach: hasTaiCho ? distance! : distance ?? 0, // ← GỬI KHOẢNG CÁCH
          PhiShip: shippingFee, // ← GỬI PHÍ SHIP
        });
      }

      localStorage.removeItem("cart_checkout");
      showSuccess(`Đặt hàng thành công! Mã đơn: ${res.MaDonHang}`);

      // ================== TỰ ĐỘNG GỬI EMAIL CHO KHÁCH ==================
      try {
        const emailItems = selectedItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price || item.GiaBan,
        }));

        const emailHtml = orderSuccessEmail(
          customer.name || "Khách yêu quý",
          res.MaDonHang,
          finalTotal,
          shippingFee,
          emailItems,
          customer.address,
          paymentMethod === "cod"
            ? "Tiền mặt"
            : paymentMethod === "qr"
            ? "Chuyển khoản"
            : "PayPal"
        );

        await sendEmailAPI({
          to: customer.email || `${customer.phone}@khachhang.shop`,
          subject: `Đặt hàng thành công! Mã đơn #${res.MaDonHang}`,
          message: emailHtml,
          userEmail: customer.email || "no-reply@shopcuachong.com", // tùy backend yêu cầu
        });

        console.log("Đã gửi email xác nhận đơn hàng cho khách rồi á ~");
      } catch (emailErr) {
        // Không làm hỏng flow đặt hàng dù email lỗi
        console.warn(
          "Gửi email thất bại (nhưng đơn hàng vẫn thành công nha):",
          emailErr
        );
      }
      // ===========================================================================

      if (paymentMethod === "qr") {
        const info = `Thanh toan don hang #${res.MaDonHang}`;
        const qrUrl = `https://img.vietqr.io/image/MB-82349824742-compact.png?amount=${total}&accountName=VU%20TU%20NAM&addInfo=${encodeURIComponent(
          info
        )}`;
        setQrModalData({
          qrUrl,
          amount: total,
          accountNumber: "82349824742",
          accountName: "VU TU NAM",
          info,
          MaDonHang: res.MaDonHang,
        });
        setIsQrModalOpen(true);
        return;
      }

      if (paymentMethod === "paypal") {
        try {
          const paypalRes = await createPayPalPayment(
            total,
            `Thanh toán đơn hàng #${res.MaDonHang}`
          );

          if (paypalRes?.approveLink) {
            // CHỈ REDIRECT — KHÔNG LÀM GÌ KHÁC
            window.location.href = paypalRes.approveLink;
          } else {
            showError("Lỗi tạo thanh toán PayPal!");
          }
          return;
        } catch (err: any) {
          showError(
            err.response?.data?.message || "Thanh toán PayPal thất bại!"
          );
          return;
        }
      }

      navigate(`/orders/success/${res.MaDonHang}`);
    } catch (error: any) {
      showError(error.response?.data?.message || "Đặt hàng thất bại!");
    }
  };

  /* ========================================================================== */
  /*  RENDER                                                                    */
  /* ========================================================================== */
  if (loadingProfile || loadingAddress) {
    return <div className="text-center py-20 text-gray-600">Đang tải...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md"
        >
          <FaArrowLeft /> Quay lại
        </button>
        <h1 className="text-4xl font-bold text-green-700 text-center flex-1">
          Thanh toán đơn hàng
        </h1>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">Giỏ hàng trống!</p>
          <Button
            onClick={() => navigate("/products")}
            className="bg-green-600 hover:bg-green-700"
          >
            Tiếp tục mua sắm
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* FORM */}
          <form
            onSubmit={handleCheckout}
            className="bg-white shadow-lg rounded-lg p-6 border flex flex-col h-full"
          >
            <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
            <div className="space-y-4 flex-1">
              <div>
                <label className="block font-medium">Họ và tên</label>
                <p className="p-2 bg-gray-50 rounded">
                  {customer.name || "Chưa có"}
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block font-medium">Số điện thoại</label>
                  <p className="p-2 bg-gray-50 rounded">
                    {customer.phone || "Chưa cập nhật"}
                  </p>
                </div>
                <div>
                  <label className="block font-medium">Địa chỉ nhận hàng</label>
                  <p className="p-2 bg-gray-50 rounded">
                    {customer.address || "Chưa cập nhật"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openEditModal}
                  className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center justify-center gap-2"
                >
                  <FaEdit /> Chỉnh sửa thông tin
                </button>

                <div className="my-4">
                  <label className="block font-medium mb-2 text-gray-700">
                    Vị trí nhận hàng chính xác (kéo thả để chọn)
                  </label>

                  {/* PHẦN QUAN TRỌNG NHẤT - BỌC BẢN ĐỒ + TẮT KHI CÓ MODAL */}
                  <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-md border">
                    {/* LỚP PHỦ DỄ THƯƠNG KHI CÓ MODAL MỞ (làm bản đồ không click được + mờ đi) */}
                    {(isModalOpen || isQrModalOpen || !!distanceError) && (
                      <div className="absolute inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                        <div className="bg-white/95 px-8 py-4 rounded-2xl shadow-2xl animate-pulse">
                          <p className="text-pink-600 font-bold text-lg flex items-center gap-3">
                            <span>✨</span> <span>✨</span>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* BẢN ĐỒ THẬT - TẮT TƯƠNG TÁC KHI CÓ MODAL */}
                    <div
                      className={`
      w-full h-full
      ${
        isModalOpen || isQrModalOpen || !!distanceError
          ? "pointer-events-none opacity-65"
          : "pointer-events-auto"
      }
    `}
                    >
                      <Map
                        latitude={latitude}
                        longitude={longitude}
                        zoom={16}
                        onPositionChange={(lat, lng, address) => {
                          setLatitude(lat);
                          setLongitude(lng);
                          if (address) {
                            setCustomer((prev) => ({ ...prev, address }));
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Địa chỉ tự động cập nhật */}
                  {/* {customer.address && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <p className="text-sm font-medium text-blue-800">
                        Địa chỉ giao hàng:
                      </p>
                      <p className="text-sm text-indigo-900 break-words">
                        {customer.address}
                      </p>
                    </div>
                  )} */}

                  {/* Hiển thị tọa độ realtime */}
                  {latitude != null && longitude != null && (
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      Vị trí: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                    </p>
                  )}

                  {/* Nút lấy vị trí hiện tại */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!navigator.geolocation) {
                        showError("Trình duyệt không hỗ trợ định vị!");
                        return;
                      }
                      showSuccess("Đang lấy vị trí...");
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          const lat = pos.coords.latitude;
                          const lng = pos.coords.longitude;
                          setLatitude(lat);
                          setLongitude(lng);
                          showSuccess(
                            `Vị trí: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
                          );
                        },
                        (err) => {
                          let msg = "Không thể lấy vị trí: ";
                          if (err.code === 1)
                            msg +=
                              "Bạn đã từ chối. Vui lòng bật trong cài đặt.";
                          else if (err.code === 2) msg += "Không tìm thấy GPS.";
                          else if (err.code === 3) msg += "Hết thời gian chờ.";
                          else msg += "Lỗi không xác định.";
                          showError(msg);
                        },
                        { enableHighAccuracy: true, timeout: 15000 }
                      );
                    }}
                    className="mt-3 w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center justify-center gap-2 font-medium shadow-md transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Dùng vị trí hiện tại
                  </button>

                  {/* NÚT CẬP NHẬT VỊ TRÍ ĐÃ CHỌN */}
                  <button
                    type="button"
                    onClick={async () => {
                      if (latitude == null || longitude == null) {
                        showError("Chưa có tọa độ để cập nhật!");
                        return;
                      }
                      if (!userId) {
                        showError("Không tìm thấy thông tin người dùng!");
                        return;
                      }
                      try {
                        await updateUser(userId, {
                          Latitude: latitude,
                          Longitude: longitude,
                        });
                        showSuccess("Cập nhật vị trí thành công!");
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
                    }}
                    disabled={latitude == null || longitude == null}
                    className={`mt-3 w-full py-3 text-white rounded-xl flex items-center justify-center gap-2 font-medium shadow-md transition-all ${
                      latitude == null || longitude == null
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Cập nhật vị trí đã chọn
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-end">
                <label className="block font-medium mb-2">
                  Phương thức thanh toán
                </label>
                <div className="space-y-3">
                  {["cod", "qr", "paypal"].map((method) => (
                    <label
                      key={method}
                      className={`flex items-center justify-between p-3 border rounded cursor-pointer ${
                        paymentMethod === method
                          ? method === "cod"
                            ? "border-green-600 bg-green-50"
                            : method === "qr"
                            ? "border-blue-600 bg-blue-50"
                            : "border-yellow-600 bg-yellow-50"
                          : "border-gray-300"
                      }`}
                      onClick={() => setPaymentMethod(method as any)}
                    >
                      <div className="flex items-center gap-2">
                        {method === "cod" && (
                          <FaMoneyBillWave className="text-green-600" />
                        )}
                        {method === "qr" && (
                          <FaQrcode className="text-blue-600" />
                        )}
                        {method === "paypal" && (
                          <FaPaypal className="text-yellow-600" />
                        )}
                        <span>
                          {method === "cod" && "Thanh toán khi nhận hàng (COD)"}
                          {method === "qr" && "Chuyển khoản QR"}
                          {method === "paypal" && "Thanh toán qua PayPal"}
                        </span>
                      </div>
                      <input
                        type="radio"
                        checked={paymentMethod === method}
                        readOnly
                      />
                    </label>
                  ))}
                </div>

                <Button
                  type="submit"
                  className={`w-full py-4 mt-6 text-white font-bold text-lg ${
                    paymentMethod === "cod"
                      ? "bg-green-600 hover:bg-green-700"
                      : paymentMethod === "qr"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-yellow-600 hover:bg-yellow-700"
                  }`}
                >
                  {paymentMethod === "cod"
                    ? "Xác nhận đặt hàng"
                    : paymentMethod === "qr"
                    ? "Hiển thị mã QR"
                    : "Thanh toán qua PayPal"}
                </Button>
              </div>
            </div>
          </form>

          {/* ĐƠN HÀNG */}
          <div className="bg-white shadow-lg rounded-lg border flex flex-col h-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Đơn hàng của bạn</h2>
            </div>
            <div className="flex-1 overflow-y-auto max-h-96 px-6">
              <ul className="divide-y py-4">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center py-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={getImageUrl(item.hinhAnh)}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border"
                        onError={(e) =>
                          (e.currentTarget.src = "/img-produce/default.jpg")
                        }
                      />
                      <div>
                        <p className="font-medium line-clamp-2">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          SL: {item.quantity} ×{" "}
                          {(item.price || item.GiaBan).toLocaleString("vi-VN")}₫
                        </p>
                      </div>
                    </div>
                    <span className="text-green-600 font-bold">
                      {(
                        Number(item.price || item.GiaBan) * item.quantity
                      ).toLocaleString("vi-VN")}
                      ₫
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 border-t bg-gray-50">
              {distance != null && (
                <div className="flex justify-between text-sm text-gray-600 border-t pt-2">
                  <span>
                    Khoảng cách: <strong>{distance} km</strong>
                  </span>
                  <span>
                    Phí ship:{" "}
                    <strong>{shippingFee.toLocaleString("vi-VN")}₫</strong>
                  </span>
                </div>
              )}

              <div className="flex justify-between text-xl font-bold">
                <span>Tổng cộng:</span>
                <span className="text-yellow-600">
                  {finalTotal.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHỈNH SỬA */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3"
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-bold mb-4">Chỉnh sửa thông tin</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="Số điện thoại"
                className="w-full border rounded p-2"
              />
              <input
                type="text"
                value={editDiaChiChiTiet}
                onChange={(e) => setEditDiaChiChiTiet(e.target.value)}
                placeholder="Số nhà, đường"
                className="w-full border rounded p-2"
              />
              <select
                value={editTinhThanh}
                onChange={(e) => {
                  setEditTinhThanh(e.target.value);
                  setEditPhuongXa("");
                }}
                className="w-full border rounded p-2"
              >
                <option value="">-- Chọn Tỉnh/Thành --</option>
                {provinces.map((p) => (
                  <option key={p.idProvince} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
              <select
                value={editPhuongXa}
                onChange={(e) => setEditPhuongXa(e.target.value)}
                disabled={!editTinhThanh}
                className="w-full border rounded p-2 disabled:bg-gray-100"
              >
                <option value="">-- Chọn Phường/Xã --</option>
                {editWards.map((w) => (
                  <option key={w.id} value={w.name}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSaveEdit}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Lưu
              </Button>
              <Button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-300"
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Thêm Dialog lỗi khoảng cách ngay cuối file, trước </div> chính hoặc sau 2 modal cũ cũng được nha~ */}
      <Dialog
        open={!!distanceError}
        onOpenChange={() => setDistanceError(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex justify-center items-center gap-2">
              <span className="text-3xl">Không thể giao hàng!</span>
            </DialogTitle>
          </DialogHeader>

          <div className="py-6 text-center space-y-4">
            <p className="text-lg whitespace-pre-line leading-relaxed">
              {distanceError}
            </p>

            <div className="flex flex-col gap-3 mt-6">
              <Button
                onClick={() => setDistanceError(null)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Tôi hiểu rồi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL QR - CHỈ ĐÓNG KHI ĐÃ XÁC NHẬN */}
      {isQrModalOpen && qrModalData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-2xl font-bold text-blue-700">
                Quét mã QR để thanh toán
              </h3>
              <button
                onClick={() => setIsQrModalOpen(false)}
                disabled={completingPayment}
              >
                <FaTimes
                  className={`text-2xl ${
                    completingPayment ? "opacity-50" : ""
                  }`}
                />
              </button>
            </div>
            <div className="p-8 flex flex-col md:flex-row gap-10 items-center">
              <img src={qrModalData.qrUrl} alt="QR" className="w-72 h-72" />
              <div className="space-y-5 text-lg">
                <div className="bg-blue-50 p-5 rounded-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold">Số tiền:</span>
                    <span className="text-2xl font-bold text-red-600">
                      {qrModalData.amount.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  {[
                    "Ngân hàng: MB Bank",
                    `STK: ${qrModalData.accountNumber}`,
                    `Chủ TK: ${qrModalData.accountName}`,
                    `Nội dung: ${qrModalData.info}`,
                  ].map((text, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span>{text.split(":")[0]}:</span>
                      <div className="flex items-center gap-2">
                        <strong>{text.split(": ")[1]}</strong>
                        <button
                          onClick={() =>
                            copyToClipboard(text.split(": ")[1], i.toString())
                          }
                          disabled={completingPayment}
                        >
                          {copiedField === i.toString() ? (
                            <FaCheck className="text-green-600" />
                          ) : (
                            <FaCopy />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 text-center">
              <Button
                onClick={async () => {
                  if (completingPayment) return;
                  setCompletingPayment(true);

                  try {
                    // Bước 1: User báo → trạng thái = Chờ xác nhận
                    await updateOrderStatus(
                      qrModalData.MaDonHang,
                      "Chờ xác nhận"
                    );
                    showSuccess("Đã báo chuyển khoản!");

                    // Bước 2: Tự động xác nhận sau 7 giây (nếu admin không hủy)
                    setTimeout(async () => {
                      try {
                        const order = await getOrderById(qrModalData.MaDonHang);
                        if (order.TrangThai === "Chờ xác nhận") {
                          await updateOrderStatus(
                            qrModalData.MaDonHang,
                            "Đã xác nhận"
                          );
                          showSuccess(
                            "Thanh toán thành công! Đơn hàng đã được xác nhận tự động."
                          );
                          localStorage.removeItem("cart_checkout");
                          setIsQrModalOpen(false);
                          navigate(`/orders/success/${qrModalData.MaDonHang}`);
                        }
                      } catch (err) {
                        console.error("Lỗi tự động xác nhận:", err);
                      }
                    }, 7000);
                  } catch (err: any) {
                    if (
                      err.response?.status === 401 ||
                      err.response?.status === 403
                    )
                      return;
                    showError(
                      err.response?.data?.message ||
                        "Báo chuyển khoản thất bại!"
                    );
                    setCompletingPayment(false);
                  }
                }}
                disabled={completingPayment}
                className={`px-10 py-3 text-white font-bold text-lg rounded-lg flex items-center gap-3 mx-auto ${
                  completingPayment
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {completingPayment ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xác nhận...
                  </>
                ) : (
                  "Đã chuyển khoản – Hoàn tất"
                )}
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                {completingPayment
                  ? "Vui lòng chờ hệ thống xác nhận giao dịch... Đừng thoát!"
                  : "Nhấn khi bạn đã chuyển khoản chính xác"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
