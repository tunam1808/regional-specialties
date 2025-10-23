import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBoxOpen,
  FaChartLine,
  FaHome,
  FaSignOutAlt,
  FaBars,
  FaRegStar,
} from "react-icons/fa";
import { useState } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* 🔹 Overlay (chỉ mobile) */}

      <button
        className="md:hidden fixed top-6 left-4 p-2 bg-green-700 text-white rounded-lg shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars size={20} />
      </button>

      {/* 🔹 SIDEBAR */}
      <aside
        className={`bg-green-700 text-white flex flex-col w-64 md:relative md:translate-x-0 md:h-auto md:flex
        fixed top-0 left-0 h-full z-40 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-4 text-2xl font-bold border-b border-green-500 text-center relative">
          Admin Page
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4">
          <NavLink
            to="account-manage"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-base hover:bg-green-600 transition ${
                isActive ? "bg-green-600 font-semibold" : ""
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            <FaUsers /> Quản lý tài khoản
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-base hover:bg-green-600 transition ${
                isActive ? "bg-green-600 font-semibold" : ""
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            <FaBoxOpen /> Quản lý sản phẩm
          </NavLink>

          <NavLink
            to="feedback-manage"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-base hover:bg-green-600 transition ${
                isActive ? "bg-green-600 font-semibold" : ""
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            <FaRegStar /> Quản lý bài đánh giá
          </NavLink>

          <NavLink
            to="/admin/statistics"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-base hover:bg-green-600 transition ${
                isActive ? "bg-green-600 font-semibold" : ""
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            <FaChartLine /> Thống kê
          </NavLink>
        </nav>

        <div className="border-t border-green-500">
          <button
            onClick={() => {
              setIsOpen(false);
              navigate(-1);
            }}
            className="flex items-center gap-3 px-6 py-3 w-full text-left hover:bg-green-600 transition"
          >
            <FaHome /> Quay lại trang trước
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-3 w-full text-left hover:bg-green-600 transition"
          >
            <FaSignOutAlt /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* 🔹 CONTENT */}
      <main className="flex-1 p-0 sm:p-6 overflow-y-auto">
        <Outlet />
      </main>
      {/* 🔹 Overlay (chỉ mobile) */}
      {isOpen && (
        <div
          className={`fixed inset-0 bg-black/20 z-30 md:hidden transition-opacity duration-300`}
          style={{ opacity: isOpen ? 1 : 0 }}
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
