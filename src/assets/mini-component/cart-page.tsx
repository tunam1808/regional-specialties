import React, { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/dialog";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import {
  getCartByUser,
  deleteProductFromCart,
  addProductToCart,
} from "@/api/order-detail";

import { useNavigate } from "react-router-dom";
import { getProfile } from "@/api/get-profile";
import { showSuccess, showError } from "@/common/toast";
// import { checkoutCart } from "@/api/order"; // sẽ chuyển sang trang checkout

interface ProductType {
  MaSP: number;
  TenSP: string;
  HinhAnh: string;
  SoLuong: number;
  GiaBanTaiThoiDiem: number;
  checked?: boolean;
  LoaiDoAn: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: number } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<number | null>(null);
  const navigate = useNavigate();

  // Lấy user từ API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getProfile();
        setUser({ id: profile.id });
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Lấy giỏ hàng tạm
  useEffect(() => {
    if (!user?.id) return;

    const fetchCart = async () => {
      try {
        const data = await getCartByUser();
        const itemsWithCheck = data.map((item: any) => ({
          ...item,
          GiaBanTaiThoiDiem: Number(item.GiaBanTaiThoiDiem), // ← Chuẩn hóa số
          checked: true,
        }));
        setCartItems(itemsWithCheck);
      } catch (err) {
        console.error("Lỗi lấy giỏ:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  // Toggle chọn sản phẩm
  const toggleCheck = (MaSP: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.MaSP === MaSP ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Thay đổi số lượng
  const updateQuantity = async (MaSP: number, delta: number) => {
    const item = cartItems.find((i) => i.MaSP === MaSP);
    if (!item) return;

    const newQty = item.SoLuong + delta;
    if (newQty < 1) return;

    try {
      await addProductToCart({
        MaSP,
        SoLuong: delta > 0 ? 1 : -1,
        GiaBanTaiThoiDiem: item.GiaBanTaiThoiDiem,
      });
      setCartItems((prev) =>
        prev.map((i) => (i.MaSP === MaSP ? { ...i, SoLuong: newQty } : i))
      );
    } catch (err) {
      showError("Không thể cập nhật số lượng!");
    }
  };

  // Mở dialog xóa
  const openDeleteDialog = (MaSP: number) => {
    setDeletingItem(MaSP);
    setDeleteDialogOpen(true);
  };

  // Xác nhận xóa
  const confirmDelete = async () => {
    if (!deletingItem) return;

    try {
      await deleteProductFromCart(deletingItem);
      setCartItems((prev) => prev.filter((i) => i.MaSP !== deletingItem));
      showSuccess("Xóa sản phẩm thành công!");
    } catch (err) {
      showError("Không thể xóa sản phẩm!");
    } finally {
      setDeleteDialogOpen(false);
      setDeletingItem(null);
    }
  };

  // Chọn tất cả
  const selectAll = () => {
    const allChecked = cartItems.every((i) => i.checked);
    setCartItems((prev) => prev.map((i) => ({ ...i, checked: !allChecked })));
  };

  // Tổng tiền
  const totalPrice = useMemo(() => {
    return cartItems
      .filter((i) => i.checked)
      .reduce((sum, i) => sum + i.SoLuong * i.GiaBanTaiThoiDiem, 0);
  }, [cartItems]);

  const handleCheckout = () => {
    const selected = cartItems.filter((i) => i.checked);
    if (selected.length === 0) {
      showError("Chưa chọn sản phẩm!");
      return;
    }

    // 🔹 Lưu tạm danh sách sản phẩm được chọn vào localStorage
    const checkoutItems = selected.map((item) => ({
      id: item.MaSP,
      name: item.TenSP,
      price: item.GiaBanTaiThoiDiem,
      quantity: item.SoLuong,
      hinhAnh: item.HinhAnh,
      LoaiDoAn: item.LoaiDoAn || "Đồ khô",
    }));
    localStorage.setItem("cart_checkout", JSON.stringify(checkoutItems));

    navigate("/checkout");
  };

  // Thanh toán
  // const handleCheckout = async () => {
  //   if (!user?.id) {
  //     showError("Vui lòng đăng nhập!");
  //     navigate("/login");
  //     return;
  //   }

  //   const selected = cartItems.filter((i) => i.checked);
  //   if (selected.length === 0) {
  //     showError("Chưa chọn sản phẩm!");
  //     return;
  //   }

  //   const confirmMsg = `Thanh toán ${
  //     selected.length
  //   } sản phẩm, tổng ${totalPrice.toLocaleString()}₫?`;
  //   if (!confirm(confirmMsg)) return;

  //   try {
  //     const res = await checkoutCart({
  //       PhuongThucThanhToan: "Tiền mặt",
  //       DiaChiGiaoHang: "Nhập tại quầy",
  //       GhiChu: "",
  //     });

  //     showSuccess(`Đặt hàng thành công! Mã đơn: ${res.MaDonHang}`);
  //     setCartItems((prev) => prev.filter((i) => !i.checked));
  //   } catch (err: any) {
  //     showError(err.response?.data?.message || "Thanh toán thất bại!");
  //   }
  // };

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
    return `${baseUrl}${hinhAnh.startsWith("/") ? hinhAnh : `/${hinhAnh}`}`;
  };

  if (loading) return <p className="text-center py-8">Đang tải giỏ hàng...</p>;

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <h1 className="text-4xl font-bold mb-6 text-green-700">
        Giỏ hàng của bạn
      </h1>

      <Button
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mb-4"
        onClick={() => navigate("/products")}
      >
        ← Tiếp tục mua sắm
      </Button>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">
          Giỏ hàng trống. Hãy thêm sản phẩm!
        </p>
      ) : (
        <>
          <div className="space-y-4 mb-32">
            {cartItems.map((item) => (
              <Card key={item.MaSP} className="p-4 hover:shadow-md">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={!!item.checked}
                    onChange={() => toggleCheck(item.MaSP)}
                    className="w-5 h-5 accent-green-600"
                  />
                  <img
                    src={getImageUrl(item.HinhAnh)}
                    alt={item.TenSP}
                    className="w-16 h-16 rounded-md object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/img-produce/default.jpg";
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.TenSP}</h3>
                    <p className="text-sm text-gray-600">
                      {item.GiaBanTaiThoiDiem.toLocaleString("vi-VN", {
                        maximumFractionDigits: 0,
                      })}
                      ₫
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-700">Số lượng:</span>
                    <div className="flex items-center gap-0">
                      <button
                        onClick={() => updateQuantity(item.MaSP, -1)}
                        className="flex items-center justify-center w-8 h-8 rounded-md border border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                      >
                        <FaMinus />
                      </button>
                      <span className="w-10 text-center font-medium text-green-700">
                        {item.SoLuong}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.MaSP, 1)}
                        className="flex items-center justify-center w-8 h-8 rounded-md border border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  <span className="font-semibold text-green-700 min-w-[80px] text-right">
                    {(item.SoLuong * item.GiaBanTaiThoiDiem).toLocaleString(
                      "vi-VN",
                      { maximumFractionDigits: 0 }
                    )}
                    ₫
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(item.MaSP)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <FaTrash />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Dialog xác nhận xóa */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">
                  Xác nhận xóa sản phẩm
                </DialogTitle>
              </DialogHeader>
              <p className="text-gray-600">
                Bạn có chắc chắn muốn xóa sản phẩm{" "}
                <span className="text-red-600 font-semibold">
                  {cartItems.find((i) => i.MaSP === deletingItem)?.TenSP}
                </span>{" "}
                khỏi giỏ hàng?
              </p>

              <DialogFooter className="gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  className="px-4"
                >
                  Hủy
                </Button>
                <Button
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4"
                >
                  Xóa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg py-4 px-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={cartItems.every((i) => i.checked)}
                onChange={selectAll}
                className="w-5 h-5 accent-green-600"
              />
              <span className="font-medium">Chọn tất cả</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-lg font-bold text-green-700">
                Tổng:{" "}
                {totalPrice.toLocaleString("vi-VN", {
                  maximumFractionDigits: 0,
                })}
                ₫
              </span>
              <Button
                onClick={handleCheckout}
                className="bg-green-600 hover:bg-green-700 px-6 py-2 text-white"
              >
                Thanh toán
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
