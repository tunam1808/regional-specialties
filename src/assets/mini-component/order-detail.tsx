import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, getAllOrders, deleteOrder } from "@/api/order";

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
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [loadingAll, setLoadingAll] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("Chờ xác nhận");

  // KIỂM TRA QUYỀN ADMIN
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user.role || user.Role || user.isAdmin || "";
    setIsAdmin(role.toLowerCase() === "admin");
  }, []);

  // LẤY CHI TIẾT ĐƠN HÀNG HIỆN TẠI
  useEffect(() => {
    if (!id) return;
    setLoadingOrder(true);
    getOrderById(id)
      .then((data: any) => {
        const sanPhamDaChon: OrderItem[] = (data.ChiTiet || []).map(
          (item: any) => ({
            id: item.MaSP,
            name: item.TenSP,
            price: item.GiaBanTaiThoiDiem,
            quantity: item.SoLuong,
          })
        );

        setOrder({
          id: data.MaDonHang,
          MaDonHang: data.MaDonHang,
          PhuongThucThanhToan: data.PhuongThucThanhToan,
          GhiChu: data.GhiChu,
          DiaChiGiaoHang: data.DiaChiGiaoHang,
          SanPhamDaChon: sanPhamDaChon,
          TongTien: data.TongTien,
          TrangThai: data.TrangThai,
        });
      })
      .catch((err: any) => console.error("Lỗi tải đơn:", err))
      .finally(() => setLoadingOrder(false));
  }, [id]);

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
            SanPhamDaChon: (d.ChiTiet || []).map((item: any) => ({
              id: item.MaSP,
              name: item.TenSP,
              price: item.GiaBanTaiThoiDiem,
              quantity: item.SoLuong,
            })),
            TongTien: d.TongTien,
            TrangThai: d.TrangThai,
          }))
        )
      )
      .catch((err: any) => console.error(err))
      .finally(() => setLoadingAll(false));
  }, []);

  // XÓA ĐƠN – CHỈ ADMIN HOẶC ĐƠN CHƯA XÁC NHẬN
  const handleDelete = async () => {
    if (!order) return;

    const blockedStates = ["Đã xác nhận", "Đang giao", "Hoàn thành"];
    if (!isAdmin && blockedStates.includes(order.TrangThai)) {
      alert("Không thể xóa đơn hàng đã được xác nhận hoặc đang giao!");
      return;
    }

    if (
      !confirm(
        `Bạn có chắc muốn xóa đơn hàng #${order.MaDonHang}?\nHành động này không thể hoàn tác!`
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await deleteOrder(order.MaDonHang);
      alert("Xóa đơn hàng thành công!");
      setAllOrders((prev) =>
        prev.filter((o) => o.MaDonHang !== order.MaDonHang)
      );
      setOrder(null);
      navigate("/orders");
    } catch (err: any) {
      alert(err.response?.data?.message || "Xóa thất bại!");
    } finally {
      setDeleting(false);
    }
  };

  // CHỈ CÒN 5 TRẠNG THÁI
  const tabs = [
    { name: "Chờ xác nhận", status: "Chờ xác nhận", color: "bg-yellow-500" },
    { name: "Đã xác nhận", status: "Đã xác nhận", color: "bg-blue-600" },
    { name: "Đang giao", status: "Đang giao", color: "bg-purple-600" },
    { name: "Hoàn thành", status: "Hoàn thành", color: "bg-green-600" },
    { name: "Đã hủy", status: "Hủy", color: "bg-red-600" },
  ];

  const filteredOrders = allOrders.filter((o) => o.TrangThai === activeTab);

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

  // ĐIỀU KIỆN HIỂN THỊ NÚT HỦY: admin HOẶC đơn Chờ xác nhận / Đã hủy
  const canCancel =
    isAdmin || ["Chờ xác nhận", "Hủy"].includes(order?.TrangThai || "");

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* NÚT QUAY LẠI + ADMIN BADGE */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg"
        >
          ← Quay lại
        </button>
        {isAdmin && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl animate-pulse">
            ADMIN MODE – QUYỀN TỐI CAO
          </div>
        )}
      </div>

      {/* CHI TIẾT ĐƠN HÀNG HIỆN TẠI */}
      {order && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-indigo-100">
          {loadingOrder ? (
            <div className="text-center py-12">Đang tải chi tiết...</div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Đơn hàng #{order.MaDonHang}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Phương thức: {order.PhuongThucThanhToan}
                  </p>
                </div>

                {/* ẨN NÚT HỦY KHI ĐÃ XÁC NHẬN (TRỪ ADMIN) */}
                {canCancel && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-6 py-3 rounded-xl font-bold transition transform hover:scale-105 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-xl"
                  >
                    {deleting ? "Đang xóa..." : "Hủy đơn hàng"}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-5 rounded-xl">
                  <p className="text-sm text-gray-600">Địa chỉ giao hàng</p>
                  <p className="font-semibold text-lg">
                    {order.DiaChiGiaoHang}
                  </p>
                </div>
                <div className="bg-gray-50 p-5 rounded-xl">
                  <p className="text-sm text-gray-600">Trạng thái</p>
                  <span
                    className={`inline-block px-4 py-2 rounded-full font-bold text-sm ${getStatusColor(
                      order.TrangThai
                    )}`}
                  >
                    {order.TrangThai}
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                Sản phẩm đã mua
              </h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-4 text-center font-bold">SL</th>
                      <th className="px-6 py-4 text-right font-bold">Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.SanPhamDaChon.map((item) => (
                      <tr key={item.id} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{item.name}</td>
                        <td className="px-6 py-4 text-center">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-green-600">
                          {item.price.toLocaleString()}₫
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-right mt-8">
                <p className="text-3xl font-black text-green-600">
                  Tổng tiền: {order.TongTien.toLocaleString()}₫
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* PHÂN LOẠI ĐƠN HÀNG – CHỈ 5 TRẠNG THÁI */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-indigo-100">
        <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
          Tất cả đơn hàng
        </h2>

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

        {loadingAll ? (
          <div className="text-center py-16">Đang tải danh sách...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-xl">
            Không có đơn hàng nào ở trạng thái này
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map((o) => (
              <div
                key={o.MaDonHang}
                onClick={() => navigate(`/orders/${o.MaDonHang}`)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  order?.MaDonHang === o.MaDonHang
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
                    {o.TongTien.toLocaleString()}₫
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
