// src/components/ProductList.tsx
import React, { useEffect, useState } from "react";
import { getAllSanPham } from "@/api/product";
import type { SanPham } from "@/types/product.type";
import toast from "react-hot-toast";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<SanPham[]>([]);

  const fetchProducts = async () => {
    try {
      const data = await getAllSanPham();
      setProducts(data);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách sản phẩm");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Danh sách sản phẩm</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p>Chưa có sản phẩm</p>
        ) : (
          products.map((sp) => (
            <div
              key={sp.MaSP}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <img
                src={sp.HinhAnh ? `/uploads/${sp.HinhAnh}` : "/placeholder.png"}
                alt={sp.TenSP}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="text-lg font-semibold">{sp.TenSP}</h3>
              <p className="text-orange-600 font-bold">
                {sp.GiaBan?.toLocaleString()} đ
              </p>
              <p className="text-sm text-gray-500">
                Vùng miền: {sp.VungMien || "-"}
              </p>
              <p className="text-sm text-gray-500">
                Loại đồ ăn: {sp.LoaiDoAn || "-"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
