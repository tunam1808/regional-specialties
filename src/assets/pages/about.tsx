// Đây là trang Về chúng tôi

import Intro_Section from "@/assets/layout/intro_section";
import Header from "@/assets/default/header";
import Footer from "@/assets/default/footer";
import Main_About from "@/assets/layout/main_about";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen mt-20">
      <Header />
      <Intro_Section />
      <Main_About />
      <Footer />
      <main className="flex-grow"></main>
    </div>
  );
}
