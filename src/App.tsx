import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/assets/pages/home";
import Products from "@/assets/pages/products";
import Login from "@/components/login";
import Register from "@/components/register";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        {/*Thêm đường dẫn này để chuyển trang*/}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
