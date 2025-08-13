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
      <Contact />
      <Footer />
      <main className="flex-grow"></main>
    </div>
  );
}
