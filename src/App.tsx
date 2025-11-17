import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // Hiện thông báo ở dưới góc trái dưới cùng màn hình
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
import Profile from "@/assets/mini-component/account-infor";
import ProductDetail from "@/assets/layout/product-detail";
import AdminPage from "@/assets/admin/manage-page";
import AccountManage from "@/assets/admin/account-manage";
import FeedbackManage from "@/assets/admin/feedback-manage";
import ProductsManage from "@/assets/admin/products-manage";
import OrderManage from "@/assets/admin/order-manage";
import Statistics from "@/assets/admin/statistics";
import Cart from "@/assets/mini-component/cart-page";
import Checkout from "@/assets/mini-component/Checkout";
import CheckoutAfter from "@/assets/mini-component/checkout-after";
import OrderDetail from "@/assets/mini-component/order-detail";
import PaymentSuccess from "@/assets/mini-component/payment-success";
import ForgotPassword from "@/assets/mini-component/forgot-password";
import ResetPassword from "@/assets/mini-component/reset-password";

export default function App() {
  return (
    <Router>
      <Toaster position="bottom-left" reverseOrder={false} />
      <NavToContact />
      {/*Gắn component này vào để khi ở bất cứ trang nào, chỉ cần chọn mục liên hệ trong phần hỗ trợ khách hàng thì nó cũng sẽ điều hướng về phần liên hệ trong trang chủ */}

      {/*Phần khai báo đường dẫn của react-router-dom */}
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
        <Route path="/account-infor" element={<Profile />} />{" "}
        {/*Chi tiết sản phẩm theo ID */}
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart-page" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders/success/:id" element={<CheckoutAfter />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/*Trang quản lý của admin */}
        <Route path="/manage-page" element={<AdminPage />}>
          <Route index element={<AccountManage />} />
          <Route path="account-manage" element={<AccountManage />} />
          <Route path="feedback-manage" element={<FeedbackManage />} />
          <Route path="products-manage" element={<ProductsManage />} />
          <Route path="order-manage" element={<OrderManage />} />
          <Route path="statistics" element={<Statistics />} />
        </Route>
      </Routes>
    </Router>
  );
}
