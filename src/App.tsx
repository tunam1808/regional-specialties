import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/assets/pages/home";
import Products from "@/assets/pages/products";
import About from "@/assets/pages/about";
import News from "@/assets/pages/news";
import FAQ from "@/assets/mini-component/FAQ";
import ShippingPolicy from "@/assets/mini-component/shipping_policy";
import ReturnPolicy from "@/assets/mini-component/return_policy";
import Login from "@/components/login";
import Register from "@/components/register";
import NavToContact from "@/assets/small-function/nav-to-contact";
import Voucher from "@/assets/mini-component/voucher-wheel";

export default function App() {
  return (
    <Router>
      <NavToContact />
      {/*Gắn component này vào để khi ở bất cứ trang nào, chỉ cần chọn mục liên hệ trong phần hỗ trợ khách hàng thì nó cũng sẽ điều hướng về phần liên hệ trong trang chủ */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<News />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/shipping_policy" element={<ShippingPolicy />} />
        <Route path="/return_policy" element={<ReturnPolicy />} />
        <Route path="/voucher" element={<Voucher />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
