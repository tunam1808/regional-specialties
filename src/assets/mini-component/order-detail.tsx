// src/pages/OrderDetail.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getOrderById,
  getAllOrders,
  deleteOrder,
  updateOrderStatus,
} from "@/api/order";
import { FaTimes } from "react-icons/fa";
import { showSuccess, showError } from "@/common/toast";

// Import Dialog components (chỉ dùng cho xác nhận xóa)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/dialog"; // Đảm bảo đường dẫn đúng

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  MaDonHang: string;
  PhuongThucThanhToan: string;
  GhiChu?: string;
  DiaChiGiaoHang: string;
  SanPhamDaChon: OrderItem[];
  TongTien: number;
  TrangThai: string;
}

export default function OrderDetail() {
  const navigate = useNavigate();

  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("Chờ xác nhận");

  // MODAL STATE
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  // MODAL LÝ DO HỦY
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  // DIALOG XÁC NHẬN XÓA
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // DANH SÁCH LÝ DO HỦY (TƯỢNG TRƯNG)
  const cancelReasons = [
    "Tôi không muốn mua nữa",
    "Đặt nhầm sản phẩm",
    "Thay đổi địa chỉ giao hàng",
    "Tìm thấy giá rẻ hơn ở nơi khác",
    "Khác",
  ];

  // KIỂM TRA QUYỀN ADMIN
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user.role || user.Role || user.isAdmin || "";
    setIsAdmin(role.toLowerCase() === "admin");
  }, []);

  // LẤY TẤT CẢ ĐƠN HÀNG
  useEffect(() => {
    setLoadingAll(true);
    getAllOrders()
      .then((data: any[]) =>
        setAllOrders(
          data.map((d: any) => ({
            id: d.MaDonHang,
            MaDonHang: d.MaDonHang,
            PhuongThucThanhToan: d.PhuongThucThanhToan,
            GhiChu: d.GhiChu,
            DiaChiGiaoHang: d.DiaChiGiaoHang,
            SanPhamDaChon: [],
            TongTien: d.TongTien,
            TrangThai: d.TrangThai,
          }))
        )
      )
      .catch((err: any) => console.error(err))
      .finally(() => setLoadingAll(false));
  }, []);

  // MỞ MODAL + GỌI CHI TIẾT
  const openModal = async (orderSummary: any) => {
    setLoadingModal(true);
    setIsModalOpen(true);
    try {
      const fullOrder = await getOrderById(orderSummary.MaDonHang);

      const sanPhamDaChon: OrderItem[] = (fullOrder.ChiTiet || []).map(
        (item: any) => ({
          id: item.MaSP,
          name: item.TenSP,
          price: item.GiaBanTaiThoiDiem,
          quantity: item.SoLuong,
        })
      );

      setSelectedOrder({
        id: fullOrder.MaDonHang,
        MaDonHang: fullOrder.MaDonHang,
        PhuongThucThanhToan: fullOrder.PhuongThucThanhToan,
        GhiChu: fullOrder.GhiChu,
        DiaChiGiaoHang: fullOrder.DiaChiGiaoHang,
        SanPhamDaChon: sanPhamDaChon,
        TongTien: fullOrder.TongTien,
        TrangThai: fullOrder.TrangThai,
      });
    } catch (err) {
      showError("Lỗi tải chi tiết đơn hàng!");
      console.error(err);
      setIsModalOpen(false);
    } finally {
      setLoadingModal(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setIsReasonModalOpen(false);
    setSelectedReason("");
    setIsDeleteDialogOpen(false); // Đóng dialog xóa khi đóng modal chính
  };

  // XỬ LÝ HỦY HOẶC XÓA
  const handleCancelOrDelete = async () => {
    if (!selectedOrder) return;

    if (selectedOrder.TrangThai === "Hủy") {
      // ĐÃ HỦY → MỞ DIALOG XÁC NHẬN XÓA
      setIsDeleteDialogOpen(true);
    } else {
      // CHƯA HỦY → MỞ MODAL CHỌN LÝ DO
      const blockedStates = ["Đã xác nhận", "Đang giao", "Hoàn thành"];
      if (!isAdmin && blockedStates.includes(selectedOrder.TrangThai)) {
        showError("Không thể hủy đơn hàng đã được xác nhận hoặc đang giao!");
        return;
      }
      setIsReasonModalOpen(true);
    }
  };

  // XÁC NHẬN XÓA ĐƠN HÀNG
  const confirmDelete = async () => {
    if (!selectedOrder) return;

    setDeleting(true);
    try {
      await deleteOrder(selectedOrder.MaDonHang);
      showSuccess("Đơn hàng đã bị xóa!");
      setAllOrders((prev) =>
        prev.filter((o) => o.MaDonHang !== selectedOrder.MaDonHang)
      );
      closeModal();
    } catch (err: any) {
      showError(err.response?.data?.message || "Xóa đơn hàng thất bại!");
    } finally {
      setDeleting(false);
    }
  };

  // XÁC NHẬN HỦY VỚI LÝ DO
  const confirmCancelWithReason = async () => {
    if (!selectedOrder || !selectedReason) {
      showError("Vui lòng chọn lý do hủy!");
      return;
    }

    setDeleting(true);
    try {
      await updateOrderStatus(selectedOrder.MaDonHang, "Hủy");

      showSuccess(`Đơn hàng #${selectedOrder.MaDonHang} đã được hủy!`);

      setAllOrders((prev) =>
        prev.map((o) =>
          o.MaDonHang === selectedOrder.MaDonHang
            ? { ...o, TrangThai: "Hủy" }
            : o
        )
      );
      setSelectedOrder((prev) => (prev ? { ...prev, TrangThai: "Hủy" } : prev));

      setIsReasonModalOpen(false);
      setSelectedReason("");
    } catch (err: any) {
      showError(err.response?.data?.message || "Hủy đơn hàng thất bại!");
    } finally {
      setDeleting(false);
    }
  };

  // TRẠNG THÁI
  const tabs = [
    { name: "Chờ xác nhận", status: "Chờ xác nhận", color: "bg-yellow-500" },
    { name: "Đã xác nhận", status: "Đã xác nhận", color: "bg-blue-600" },
    { name: "Đang giao", status: "Đang giao", color: "bg-purple-600" },
    { name: "Hoàn thành", status: "Hoàn thành", color: "bg-green-600" },
    { name: "Đã hủy", status: "Hủy", color: "bg-red-600" },
  ];

  const filteredOrders = allOrders.filter((o) => {
    const tab = tabs.find((t) => t.name === activeTab);
    return o.TrangThai === tab?.status;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Chờ xác nhận":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Đã xác nhận":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Đang giao":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Hoàn thành":
        return "bg-green-100 text-green-800 border-green-300";
      case "Hủy":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const canCancel = (order: Order) =>
    isAdmin || ["Chờ xác nhận", "Hủy"].includes(order.TrangThai);

  const formatCurrency = (value: any) => {
    const num = Number(value) || 0;
    return num.toLocaleString("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* NÚT QUAY LẠI */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg"
        >
          Quay lại
        </button>
      </div>

      {/* DANH SÁCH ĐƠN HÀNG */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-indigo-100">
        <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
          Tất cả đơn hàng
        </h2>

        {/* TAB TRẠNG THÁI */}
        <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-200">
          {tabs.map((tab) => {
            const count = allOrders.filter(
              (o) => o.TrangThai === tab.status
            ).length;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`px-6 py-3 rounded-t-xl font-bold transition-all duration-300 relative ${
                  activeTab === tab.name
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.name}
                <span
                  className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${
                    activeTab === tab.name
                      ? "bg-white text-indigo-600"
                      : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* DANH SÁCH */}
        {loadingAll ? (
          <div className="text-center py-16">Đang tải...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-xl">
            Không có đơn hàng nào
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map((o) => (
              <div
                key={o.MaDonHang}
                onClick={() => openModal(o)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  selectedOrder?.MaDonHang === o.MaDonHang
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 bg-gray-50 hover:border-indigo-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-black text-indigo-700">
                      #{o.MaDonHang}
                    </span>
                    <span
                      className={`ml-4 inline-block px-4 py-2 rounded-full font-bold text-sm ${getStatusColor(
                        o.TrangThai
                      )}`}
                    >
                      {o.TrangThai}
                    </span>
                  </div>
                  <span className="text-2xl font-black text-green-600">
                    {formatCurrency(o.TongTien)}₫
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {loadingModal ? (
              <div className="p-12 text-center">
                <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-lg">Đang tải chi tiết...</p>
              </div>
            ) : selectedOrder ? (
              <>
                {/* HEADER */}
                <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                  <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Đơn hàng #{selectedOrder.MaDonHang}
                  </h1>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <FaTimes className="text-2xl text-gray-600" />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-600">Phương thức thanh toán</p>
                      <p className="font-semibold text-lg">
                        {selectedOrder.PhuongThucThanhToan}
                      </p>
                    </div>
                    {canCancel(selectedOrder) && (
                      <button
                        onClick={handleCancelOrDelete}
                        disabled={deleting}
                        className={`px-6 py-3 rounded-xl font-bold text-white shadow-xl transition ${
                          selectedOrder.TrangThai === "Hủy"
                            ? "bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800"
                            : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                        }`}
                      >
                        {deleting
                          ? selectedOrder.TrangThai === "Hủy"
                            ? "Đang xóa..."
                            : "Đang hủy..."
                          : selectedOrder.TrangThai === "Hủy"
                          ? "Xóa đơn hàng"
                          : "Hủy đơn hàng"}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-5 rounded-xl">
                      <p className="text-sm text-gray-600">Địa chỉ giao hàng</p>
                      <p className="font-semibold text-lg">
                        {selectedOrder.DiaChiGiaoHang}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-xl">
                      <p className="text-sm text-gray-600">Trạng thái</p>
                      <span
                        className={`inline-block px-4 py-2 rounded-full font-bold text-sm ${getStatusColor(
                          selectedOrder.TrangThai
                        )}`}
                      >
                        {selectedOrder.TrangThai}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-indigo-700">
                    Sản phẩm đã mua
                  </h2>
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                        <tr>
                          <th className="px-6 py-4 text-left font-bold">
                            Sản phẩm
                          </th>
                          <th className="px-6 py-4 text-center font-bold">
                            SL
                          </th>
                          <th className="px-6 py-4 text-right font-bold">
                            Giá
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.SanPhamDaChon.map((item) => (
                          <tr
                            key={item.id}
                            className="border-t hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 font-medium">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 text-right font-semibold text-green-600">
                              {formatCurrency(item.price)}₫
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-black text-green-600">
                      Tổng tiền: {formatCurrency(selectedOrder.TongTien)}₫
                    </p>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* MODAL CHỌN LÝ DO HỦY */}
      {isReasonModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Chọn lý do hủy đơn hàng
            </h3>
            <div className="space-y-2 mb-6">
              {cancelReasons.map((reason) => (
                <label
                  key={reason}
                  className="flex items-center p-3 rounded-lg border cursor-pointer hover:bg-indigo-50 transition"
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="mr-3 w-5 h-5 text-indigo-600"
                  />
                  <span className="text-gray-700">{reason}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsReasonModalOpen(false);
                  setSelectedReason("");
                }}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmCancelWithReason}
                disabled={deleting || !selectedReason}
                className="px-5 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? "Đang xử lý..." : "Xác nhận hủy"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG XÁC NHẬN XÓA ĐƠN HÀNG (Radix UI) */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Bạn có chắc muốn <strong>xóa vĩnh viễn</strong> đơn hàng{" "}
            <span className="font-mono text-indigo-600">
              #{selectedOrder?.MaDonHang}
            </span>
            ? Hành động này <strong>không thể hoàn tác</strong>.
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <button className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition">
                Hủy
              </button>
            </DialogClose>
            <button
              onClick={confirmDelete}
              disabled={deleting}
              className="px-5 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition disabled:opacity-50"
            >
              {deleting ? "Đang xóa..." : "Xóa vĩnh viễn"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
