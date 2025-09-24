// Đây là trang chủ

import Header from "@/assets/default/header";
import Footer from "@/assets/default/footer";
import Banner from "@/assets/layout/banner";
import Product_special from "@/assets/layout/product_special";
import Intro from "@/assets/layout/intro";
import Guide from "@/assets/layout/guide";
import FunFacts from "../layout/fun_facts";
import Gallery from "../layout/gallery";
import Blogs from "../layout/blogs";
import Contact from "../layout/contact";
import Review from "../layout/review";
import ScrollToTop from "@/components/ScrollToTop";
import ChatWidget from "@/assets/mini-component/chat-widget";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Banner />
      <Guide />
      <Product_special />
      <Blogs />
      <Intro />
      <FunFacts />
      <Gallery />
      <Review />
      <div id="contact">
        {/* Dùng id để khi ấn vào chữ mục liên hệ trong mục hỗ trợ khách hàng thì sẽ đi đến đúng phần liên hệ */}
        <Contact />
      </div>
      <Footer />
      <ChatWidget />
      <ScrollToTop />
      <main className="flex-grow"></main>
    </div>
  );
}
