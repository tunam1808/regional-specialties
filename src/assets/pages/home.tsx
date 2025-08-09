import Header from "@/assets/default/header";
import Banner from "@/assets/layout/banner";
import Product_special from "@/assets/layout/product_special";
import Intro from "@/assets/layout/intro";
import Guide from "@/assets/layout/guide";
import Footer from "@/assets/default/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Banner />
      <Guide />
      <Product_special />
      <Intro />
      <Footer />
      <main className="flex-grow"></main>
    </div>
  );
}
