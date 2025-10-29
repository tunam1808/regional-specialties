import React, { useState, useEffect } from "react";
import {
  FaUpload,
  FaPlusCircle,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import {
  getAllSanPham,
  addSanPham,
  updateSanPham,
  deleteSanPham,
} from "@/api/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import type { SanPham } from "@/types/product.type";
import api from "@/api/axiosInstance";
import { Button } from "@/components/button";
import { showSuccess, showError } from "@/common/toast";
import MyEditor from "@/components/editor";

interface Product {
  tenSP: string;
  moTa: string;
  giaNhap: number | "";
  giaBan: number | "";
  soLuongTon: number | "";
  daBan: number | "";
  voucher: number | "";
  hinhAnh: string | null;
  vungMien: "Bắc" | "Trung" | "Nam" | undefined;
  loaiDoAn: "Tại chỗ" | "Đồ khô" | undefined;
  xuatXu: string;
  hanSuDung: string;
}

const ManageProducts = () => {
  const [products, setProducts] = useState<SanPham[]>([]);
  const [formData, setFormData] = useState<Product>({
    tenSP: "",
    moTa: "",
    giaNhap: "",
    giaBan: "",
    soLuongTon: "",
    daBan: "",
    voucher: "",
    hinhAnh: null,
    vungMien: undefined,
    loaiDoAn: undefined,
    xuatXu: "",
    hanSuDung: "",
  });
  const [editingProduct, setEditingProduct] = useState<SanPham | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SanPham | null>(null);

  // Lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllSanPham();
        setProducts(data);
      } catch (err) {
        showError("Lỗi khi lấy danh sách sản phẩm!");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Chuyển đổi đường dẫn ảnh
  const getImageUrl = (hinhAnh: string | undefined) => {
    if (!hinhAnh) return "/img-produce/default.jpg";
    return hinhAnh;
  };

  // Xử lý thay đổi form
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "vungMien"
          ? (value as "Bắc" | "Trung" | "Nam" | "")
          : name === "loaiDoAn"
          ? (value as "Tại chỗ" | "Đồ khô" | "")
          : value,
    }));
  };

  // Xử lý upload ảnh
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token không hợp lệ! Vui lòng đăng nhập lại. ");
          return;
        }
        const formData = new FormData();
        formData.append("image", file);
        const res = await api.post("/imgproduct/imgproduct", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        const imageUrl = res.data.url.replace("/uploads/", "/img-produce/");
        setFormData((prev) => ({ ...prev, hinhAnh: imageUrl }));
        showSuccess("Upload ảnh thành công! ");
      } catch (err) {
        console.error("Lỗi upload:", err);
        showError(
          `Lỗi khi upload ảnh! ${
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message
          } `
        );
      }
    }
  };

  // Xóa ảnh
  const clearImage = () => setFormData((prev) => ({ ...prev, hinhAnh: null }));

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.tenSP) {
      showError("Vui lòng nhập tên sản phẩm! ");
      setLoading(false);
      return;
    }
    if (!formData.giaBan || Number(formData.giaBan) <= 0) {
      showError("Giá bán phải lớn hơn 0! ");
      setLoading(false);
      return;
    }
    if (
      formData.giaNhap &&
      Number(formData.giaNhap) > Number(formData.giaBan)
    ) {
      showError("Giá nhập không được lớn hơn giá bán!");
      setLoading(false);
      return;
    }
    if (!formData.vungMien) {
      showError("Vui lòng chọn vùng miền! ");
      setLoading(false);
      return;
    }
    if (!formData.loaiDoAn) {
      showError("Vui lòng chọn loại đồ ăn! ");
      setLoading(false);
      return;
    }
    if (formData.voucher && Number(formData.voucher) > 100) {
      showError("Voucher không được lớn hơn 100%! ");
      setLoading(false);
      return;
    }
    if (!formData.soLuongTon || Number(formData.soLuongTon) <= 0) {
      showError("Số lượng tồn phải lớn hơn 0!");
      setLoading(false);
      return;
    }

    if (
      formData.daBan &&
      Number(formData.soLuongTon) < Number(formData.daBan)
    ) {
      showError("Số lượng tồn phải lớn hơn hoặc bằng số lượng đã bán!");
      setLoading(false);
      return;
    }

    const giaSauGiam =
      formData.giaBan && formData.voucher
        ? (Number(formData.giaBan) * (100 - Number(formData.voucher))) / 100
        : Number(formData.giaBan) || 0;

    const sanPham: SanPham = {
      TenSP: formData.tenSP,
      MoTa: formData.moTa || undefined,
      GiaNhap: formData.giaNhap ? Number(formData.giaNhap) : undefined,
      GiaBan: formData.giaBan ? Number(formData.giaBan) : 0,
      GiaSauGiam: giaSauGiam,
      SoLuongTon: formData.soLuongTon ? Number(formData.soLuongTon) : undefined,
      DaBan: formData.daBan ? Number(formData.daBan) : undefined,
      Voucher: formData.voucher ? `${Number(formData.voucher)}%` : undefined,
      HinhAnh: formData.hinhAnh || undefined,
      VungMien: formData.vungMien,
      LoaiDoAn: formData.loaiDoAn,
      XuatXu: formData.xuatXu || undefined,
      HanSuDung: formData.hanSuDung || undefined,
      user_id: 0,
    };

    try {
      if (editingProduct) {
        await updateSanPham(editingProduct.MaSP!, sanPham);
        showSuccess("Cập nhật sản phẩm thành công!");
        setProducts(
          products.map((p) =>
            p.MaSP === editingProduct.MaSP ? { ...p, ...sanPham } : p
          )
        );
      } else {
        const response = await addSanPham(sanPham);
        showSuccess("Thêm sản phẩm thành công! ");
        setProducts([...products, { ...sanPham, MaSP: response.MaSP }]);
      }
      setFormData({
        tenSP: "",
        moTa: "",
        giaNhap: "",
        giaBan: "",
        soLuongTon: "",
        daBan: "",
        voucher: "",
        hinhAnh: null,
        vungMien: undefined,
        loaiDoAn: undefined,
        xuatXu: "",
        hanSuDung: "",
      });
      setEditingProduct(null);
      setIsModalOpen(false);
    } catch (err) {
      showError("Lỗi khi xử lý sản phẩm! ");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa sản phẩm
  const handleDelete = async (MaSP: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await deleteSanPham(MaSP);
      showSuccess("Xóa sản phẩm thành công! ");
      setProducts(products.filter((p) => p.MaSP !== MaSP));
    } catch (err) {
      showError("Lỗi khi xóa sản phẩm! ");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý chọn sản phẩm để sửa
  const handleEdit = (product: SanPham) => {
    const vungMien = ["Bắc", "Trung", "Nam"].includes(
      product.VungMien as string
    )
      ? (product.VungMien as "Bắc" | "Trung" | "Nam")
      : undefined;
    const loaiDoAn = ["Tại chỗ", "Đồ khô"].includes(product.LoaiDoAn as string)
      ? (product.LoaiDoAn as "Tại chỗ" | "Đồ khô")
      : undefined;

    setFormData({
      tenSP: product.TenSP,
      moTa: product.MoTa || "",
      giaNhap: product.GiaNhap || "",
      giaBan: product.GiaBan || "",
      soLuongTon: product.SoLuongTon || "",
      daBan: product.DaBan || "",
      voucher: product.Voucher ? parseInt(product.Voucher) : "",
      hinhAnh: product.HinhAnh || null,
      vungMien,
      loaiDoAn,
      xuatXu: product.XuatXu || "",
      hanSuDung: product.HanSuDung || "",
    });
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Mở modal để thêm sản phẩm
  const handleOpenAddModal = () => {
    setFormData({
      tenSP: "",
      moTa: "",
      giaNhap: "",
      giaBan: "",
      soLuongTon: "",
      daBan: "",
      voucher: "",
      hinhAnh: null,
      vungMien: undefined,
      loaiDoAn: undefined,
      xuatXu: "",
      hanSuDung: "",
    });
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      tenSP: "",
      moTa: "",
      giaNhap: "",
      giaBan: "",
      soLuongTon: "",
      daBan: "",
      voucher: "",
      hinhAnh: null,
      vungMien: undefined,
      loaiDoAn: undefined,
      xuatXu: "",
      hanSuDung: "",
    });
    setEditingProduct(null);
  };

  // Tính giá sau giảm
  const giaSauGiam =
    formData.giaBan && formData.voucher
      ? (Number(formData.giaBan) * (100 - Number(formData.voucher))) / 100
      : null;

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      {/* Header với nút thêm sản phẩm */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-green-700 text-center sm:text-left w-full mb-6 sm:mb-0">
          Quản lý sản phẩm
        </h1>
        <Button
          onClick={handleOpenAddModal}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <FaPlusCircle /> Thêm sản phẩm
        </Button>
      </div>

      {/* Thông báo */}
      {loading && <p className="text-gray-500 mb-4">Đang xử lý...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      {/* Modal form thêm/sửa sản phẩm */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
                <FaPlusCircle className="text-green-600" />{" "}
                {editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
              </h2>
              <Button
                onClick={handleCloseModal}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    name="tenSP"
                    value={formData.tenSP}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 focus:ring focus:ring-green-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Xuất xứ
                  </label>
                  <input
                    type="text"
                    name="xuatXu"
                    value={formData.xuatXu}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 focus:ring focus:ring-green-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <MyEditor
                  value={formData.moTa}
                  onChange={(value: string) =>
                    setFormData((prev) => ({ ...prev, moTa: value }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Giá nhập (₫)
                  </label>
                  <input
                    type="number"
                    name="giaNhap"
                    value={formData.giaNhap}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Giá bán (₫)
                  </label>
                  <input
                    type="number"
                    name="giaBan"
                    value={formData.giaBan}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Số lượng tồn
                  </label>
                  <input
                    type="number"
                    name="soLuongTon"
                    value={formData.soLuongTon}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Đã bán
                  </label>
                  <input
                    type="number"
                    name="daBan"
                    value={formData.daBan}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Voucher (%)
                  </label>
                  <input
                    type="number"
                    name="voucher"
                    value={formData.voucher}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              {giaSauGiam !== null && (
                <div className="text-sm text-gray-600">
                  Giá sau giảm: {giaSauGiam.toLocaleString()} ₫
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Vùng miền
                  </label>
                  <select
                    name="vungMien"
                    value={formData.vungMien || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                    required
                  >
                    <option value="">Chọn vùng miền</option>
                    <option value="Bắc">Bắc</option>
                    <option value="Trung">Trung</option>
                    <option value="Nam">Nam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Loại đồ ăn
                  </label>
                  <select
                    name="loaiDoAn"
                    value={formData.loaiDoAn || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                    required
                  >
                    <option value="">Chọn loại đồ ăn</option>
                    <option value="Tại chỗ">Tại chỗ</option>
                    <option value="Đồ khô">Đồ khô</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Hạn sử dụng
                </label>
                <input
                  type="date"
                  name="hanSuDung"
                  value={formData.hanSuDung}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Hình ảnh
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-green-200">
                    <FaUpload /> Tải ảnh
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  {formData.hinhAnh && (
                    <button
                      type="button"
                      onClick={clearImage}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700"
                    >
                      <FaTimes /> Xóa
                    </button>
                  )}
                </div>
                {formData.hinhAnh && (
                  <img
                    src={getImageUrl(formData.hinhAnh)}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = formData.hinhAnh
                        ? formData.hinhAnh.replace(
                            "/img-produce/",
                            "http://localhost:4000/uploads/"
                          )
                        : "/img-produce/default.jpg";
                    }}
                  />
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                disabled={loading}
              >
                {loading
                  ? "Đang xử lý..."
                  : editingProduct
                  ? "Cập nhật sản phẩm"
                  : "Thêm sản phẩm"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Danh sách sản phẩm */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Danh sách sản phẩm
        </h2>
        {products.length === 0 && !loading ? (
          <p className="text-gray-500">Không có sản phẩm nào!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Mã SP</th>
                  <th className="px-4 py-2 text-left">Tên</th>
                  <th className="px-4 py-2 text-left">Ảnh</th>
                  <th className="px-4 py-2 text-left">Giá bán</th>
                  <th className="px-4 py-2 text-left">Vùng miền</th>
                  <th className="px-4 py-2 text-left">Loại</th>
                  <th className="px-4 py-2 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.MaSP} className="border-b">
                    <td className="px-4 py-2">{product.MaSP}</td>
                    <td className="px-4 py-2">{product.TenSP}</td>
                    <td className="px-4 py-2">
                      {product.HinhAnh ? (
                        <img
                          src={getImageUrl(product.HinhAnh)}
                          alt={product.TenSP}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = product.HinhAnh
                              ? product.HinhAnh.replace(
                                  "/img-produce/",
                                  "http://localhost:4000/uploads/"
                                )
                              : "/img-produce/default.jpg";
                          }}
                        />
                      ) : (
                        "Chưa có ảnh"
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {product.Voucher ? (
                        <>
                          <span className="line-through text-gray-400 mr-2">
                            {Number(product.GiaBan).toLocaleString()}₫
                          </span>
                          <span className="text-green-600 font-semibold">
                            {Number(
                              product.GiaSauGiam ?? product.GiaBan
                            ).toLocaleString()}
                            ₫
                          </span>
                        </>
                      ) : (
                        `${Number(product.GiaBan).toLocaleString()}₫`
                      )}
                    </td>

                    <td className="px-4 py-2">
                      {["Bắc", "Trung", "Nam"].includes(
                        product.VungMien as string
                      )
                        ? product.VungMien
                        : "Bắc"}
                    </td>
                    <td className="px-4 py-2">
                      {["Tại chỗ", "Đồ khô"].includes(
                        product.LoaiDoAn as string
                      )
                        ? product.LoaiDoAn === "Tại chỗ"
                          ? "Tại chỗ"
                          : "Đồ khô"
                        : "Đồ khô"}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => handleEdit(product)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => setDeleteTarget(product)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-red-600">
              Xóa sản phẩm
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-2">
              Bạn có chắc muốn xóa{" "}
              <span className="font-semibold text-gray-800">
                {deleteTarget?.TenSP}
              </span>{" "}
              khỏi danh sách không? Hành động này không thể hoàn tác.
            </p>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="px-4"
            >
              Hủy
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white px-4"
              onClick={() => {
                if (deleteTarget) handleDelete(deleteTarget.MaSP!);
                setDeleteTarget(null);
              }}
            >
              Xóa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageProducts;
