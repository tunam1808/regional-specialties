// Đây là trang tin tức

import Header from "@/assets/default/header";
import Footer from "@/assets/default/footer";
import NewsSection from "@/assets/layout/news_section";

export default function Products() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <NewsSection />
      <Footer />
      <main className="flex-grow"></main>
    </div>
  );
}
