// Đây là trang sản phẩm

import Header from "@/assets/default/header";
import Footer from "@/assets/default/footer";
import ProductChild from "@/assets/layout/product_child";
import ScrollToTop from "@/components/ScrollToTop";

export default function Products() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ProductChild />
      <div className="z-50">
        <Footer />
      </div>

      <ScrollToTop />

      <main className="flex-grow"></main>
    </div>
  );
}
