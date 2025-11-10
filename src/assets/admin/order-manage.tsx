import React, { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { getAllOrders, updateOrderStatus, deleteOrder } from "@/api/order"; // ĐÃ THÊM deleteOrder
import { showSuccess, showError } from "@/common/toast";
import { FaCheckCircle, FaSpinner, FaTrashAlt } from "react-icons/fa";

interface Order {
  MaDonHang: string;
  TrangThai: string;
  NgayDat: string;
  TongTien: number;
  DiaChiGiaoHang: string;
  PhuongThucThanhToan: string;
  GhiChu?: string;
  HoTen?: string;
  SoDienThoai?: string;
}

const OrderManage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null); // THÊM: Loading xóa

  // LẤY DANH SÁCH ĐƠN HÀNG
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      showError("Không thể tải danh sách đơn hàng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // XÁC NHẬN THANH TOÁN
  const handleConfirm = async (id: string) => {
    try {
      setConfirmingId(id);
      await updateOrderStatus(id, "Đã xác nhận");
      showSuccess(`Đã xác nhận đơn ${id}`);
      fetchOrders();
    } catch (error: any) {
      showError(error.response?.data?.message || "Lỗi xác nhận đơn hàng");
    } finally {
      setConfirmingId(null);
    }
  };

  // XÓA ĐƠN HÀNG – TẤT CẢ TRẠNG THÁI ĐỀU XÓA ĐƯỢC
  const handleDelete = async (id: string) => {
    if (
      !confirm(
        `⚠️ Bạn có CHẮC chắn muốn XÓA đơn hàng #${id}?\n\nHành động này KHÔNG THỂ HOÀN TÁC!`
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteOrder(id);
      showSuccess(`Đã xóa đơn hàng #${id} thành công!`);
      setOrders((prev) => prev.filter((o) => o.MaDonHang !== id));
    } catch (error: any) {
      showError(error.response?.data?.message || "Xóa đơn hàng thất bại!");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-green-700">
          Quản lý đơn hàng
        </h2>
        <Button
          onClick={fetchOrders}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded"
        >
          {loading ? <FaSpinner className="animate-spin" /> : "↻"} Làm mới
        </Button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Mã đơn</th>
              <th className="px-4 py-2 text-left">Ngày đặt</th>
              <th className="px-4 py-2 text-left">Khách hàng</th>
              <th className="px-4 py-2 text-left">SĐT</th>
              <th className="px-4 py-2 text-right">Tổng tiền</th>
              <th className="px-4 py-2 text-left">Địa chỉ</th>
              <th className="px-4 py-2 text-center">Thanh toán</th>
              <th className="px-4 py-2 text-center">Trạng thái</th>
              <th className="px-4 py-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-12">
                  <FaSpinner className="animate-spin text-3xl text-gray-500 mx-auto" />
                  <p className="mt-2 text-gray-600">Đang tải đơn hàng...</p>
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.MaDonHang} className="hover:bg-gray-50 border-b">
                  <td className="px-4 py-2 font-semibold text-gray-800">
                    #{order.MaDonHang}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {new Date(order.NgayDat).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-4 py-2">{order.HoTen || "Khách lẻ"}</td>
                  <td className="px-4 py-2">{order.SoDienThoai || "-"}</td>
                  <td className="px-4 py-2 text-right font-bold text-green-600">
                    {order.TongTien.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="px-4 py-2 text-sm">{order.DiaChiGiaoHang}</td>
                  <td className="px-4 py-2 text-center text-xs">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.PhuongThucThanhToan.includes("QR") ||
                        order.PhuongThucThanhToan.includes("chuyển")
                          ? "text-blue-500"
                          : "text-black"
                      }`}
                    >
                      {order.PhuongThucThanhToan}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.TrangThai === "Chờ xác nhận"
                          ? "text-yellow-500"
                          : order.TrangThai === "Đã xác nhận"
                          ? "text-green-500"
                          : order.TrangThai === "Hủy"
                          ? "text-red-500"
                          : order.TrangThai === "Đang giao"
                          ? "text-purple-500"
                          : "text-gray-500"
                      }`}
                    >
                      {order.TrangThai}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex gap-2 justify-center">
                      {order.TrangThai === "Chờ xác nhận" && (
                        <Button
                          onClick={() => handleConfirm(order.MaDonHang)}
                          disabled={confirmingId === order.MaDonHang}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 flex items-center gap-1 rounded"
                        >
                          {confirmingId === order.MaDonHang ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaCheckCircle />
                          )}
                          Xác nhận
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDelete(order.MaDonHang)}
                        disabled={deletingId === order.MaDonHang}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 flex items-center gap-1 rounded"
                      >
                        {deletingId === order.MaDonHang ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaTrashAlt />
                        )}
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-12 text-gray-500 italic"
                >
                  Chưa có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        Tổng cộng: <strong>{orders.length}</strong> đơn hàng
      </div>
    </div>
  );
};

export default OrderManage;
