import React, { useState } from "react";
import { FaUpload, FaPlusCircle, FaTimes } from "react-icons/fa";

interface Product {
  tenSP: string;
  moTa: string;
  giaNhap: number | "";
  giaBan: number | "";
  soLuongTon: number | "";
  daBan: number | "";
  voucher: number | ""; // phần trăm giảm giá
  hinhAnh: string | null;
}

export default function AddProduct() {
  const [product, setProduct] = useState<Product>({
    tenSP: "",
    moTa: "",
    giaNhap: "",
    giaBan: "",
    soLuongTon: "",
    daBan: "",
    voucher: "",
    hinhAnh: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct((prev) => ({ ...prev, hinhAnh: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => setProduct((prev) => ({ ...prev, hinhAnh: null }));

  // ✅ Tính giá sau giảm
  const giaSauGiam =
    product.giaBan && product.voucher
      ? (Number(product.giaBan) * (100 - Number(product.voucher))) / 100
      : null;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-200 min-h-screen">
      {/* BÊN TRÁI - FORM NHẬP */}
      <div className="w-full md:w-1/2 bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <FaPlusCircle className="text-green-600" /> Thêm sản phẩm
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Tên sản phẩm
            </label>
            <input
              type="text"
              name="tenSP"
              value={product.tenSP}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea
              name="moTa"
              value={product.moTa}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg p-2 focus:ring focus:ring-green-200"
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
                value={product.giaNhap}
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
                value={product.giaBan}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
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
                value={product.soLuongTon}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Đã bán</label>
              <input
                type="number"
                name="daBan"
                value={product.daBan}
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
                value={product.voucher}
                onChange={handleChange}
                placeholder="0"
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="block text-sm font-medium mb-2">Hình ảnh</label>
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
              {product.hinhAnh && (
                <button
                  onClick={clearImage}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700"
                >
                  <FaTimes /> Xóa
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BÊN PHẢI - REVIEW */}
      <div className="w-full md:w-1/2 bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Xem trước sản phẩm
        </h2>
        {product.hinhAnh ? (
          <img
            src={product.hinhAnh}
            alt="Preview"
            className="w-56 h-56 object-cover rounded-xl mb-4 shadow-md"
          />
        ) : (
          <div className="w-56 h-56 bg-gray-100 flex items-center justify-center text-gray-400 rounded-xl mb-4">
            Chưa có ảnh
          </div>
        )}

        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {product.tenSP || "Tên sản phẩm"}
          </h3>

          {/* 💸 Hiển thị giá */}
          {giaSauGiam ? (
            <div className="flex justify-center items-center gap-2">
              <span className="text-gray-400 line-through text-sm">
                {Number(product.giaBan).toLocaleString()}₫
              </span>
              <span className="text-red-600 text-lg font-bold">
                {giaSauGiam.toLocaleString()}₫
              </span>
            </div>
          ) : (
            <p className="text-green-600 text-lg font-semibold">
              {product.giaBan
                ? `${Number(product.giaBan).toLocaleString()}₫`
                : "0₫"}
            </p>
          )}

          {/* Thông tin tồn kho / đã bán */}
          <div className="flex justify-center gap-6 mt-3 text-sm text-gray-600">
            <p>Tồn: {product.soLuongTon || 0}</p>
            <p>Đã bán: {product.daBan || 0}</p>
          </div>

          {product.voucher && (
            <p className="mt-2 text-xs text-red-500 font-medium">
              🎟 Giảm {product.voucher}% khi áp dụng voucher
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
