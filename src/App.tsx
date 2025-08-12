import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/assets/pages/home";
import Products from "@/assets/pages/products";
import About from "@/assets/pages/about";
import News from "@/assets/pages/news";
import Login from "@/components/login";
import Register from "@/components/register";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<News />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
