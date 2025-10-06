import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBoxOpen,
  FaChartLine,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 🔹 SIDEBAR */}
      <aside className="w-64 bg-green-700 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-green-500 text-center">
          Admin Page
        </div>

        <nav className="flex-1 mt-4">
          <NavLink
            to="account-manage" // ✅ sửa lại: nằm dưới /admin
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-base hover:bg-green-600 transition ${
                isActive ? "bg-green-600 font-semibold" : ""
              }`
            }
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
          >
            <FaBoxOpen /> Quản lý sản phẩm
          </NavLink>

          <NavLink
            to="/admin/statistics"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-base hover:bg-green-600 transition ${
                isActive ? "bg-green-600 font-semibold" : ""
              }`
            }
          >
            <FaChartLine /> Thống kê
          </NavLink>
        </nav>

        <div className="border-t border-green-500">
          <button
            onClick={() => navigate(-1)}
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

      {/* 🔹 NỘI DUNG */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet /> {/* 👉 nơi render các trang con */}
      </main>
    </div>
  );
}
