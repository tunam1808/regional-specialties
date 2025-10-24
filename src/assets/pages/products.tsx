// Đây là trang sản phẩm

import Header from "@/assets/default/header";
import ProductChild from "@/assets/layout/product_child";

export default function Products() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ProductChild />
     
      <main className="flex-grow"></main>
    </div>
  );
}
