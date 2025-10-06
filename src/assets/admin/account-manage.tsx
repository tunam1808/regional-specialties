import { useEffect, useState } from "react";
import { userApi } from "@/api/user-by-admin";
import type { User } from "@/types/update-user.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { Button } from "@/components/button";
import { FaPlus, FaUser, FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import { Input } from "@/components/input";
import { showSuccess, showError } from "@/common/toast";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [creatingUser, setCreatingUser] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({});

  const navigate = useNavigate();

  useEffect(() => {
    userApi.getAll().then(setUsers);
  }, []);

  const handleDelete = async (id: string | number) => {
    const numericId = Number(id);
    if (confirm("Bạn có chắc muốn xóa tài khoản này?")) {
      await userApi.remove(numericId);
      setUsers((prev) => prev.filter((u) => Number(u.id) !== numericId));
      showSuccess("Xóa tài khoản thành công!");
    }
  };

  const handleCreate = () => {
    setCreatingUser(true);
    setFormData({
      fullname: "",
      username: "",
      email: "",
      SoDienThoai: "",
      DiaChi: "",
      avatar: "",
      password: "",
      role: "user", // Mặc định là user
    });
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      fullname: user.fullname || "",
      username: user.username || "",
      email: user.email || "",
      SoDienThoai: user.SoDienThoai || "",
      DiaChi: user.DiaChi || "",
      avatar: user.avatar || "",
    });
  };

  const handleCloseModal = () => {
    setEditingUser(null);
    setCreatingUser(false);
    setFormData({});
  };

  const handleSave = async () => {
    if (!editingUser) return;

    try {
      const cleanData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          value === undefined ? null : value,
        ])
      );

      console.log("📦 Dữ liệu gửi lên (cập nhật):", cleanData);

      const res = await userApi.update(Number(editingUser.id), cleanData);
      showSuccess(res.message || "Cập nhật thành công!");

      // 🔹 Refetch lại toàn bộ danh sách để hiển thị dữ liệu mới
      const updatedList = await userApi.getAll();
      setUsers(updatedList);

      handleCloseModal();
    } catch (error: any) {
      console.error("Lỗi cập nhật:", error);
      showError("Cập nhật thất bại!");
    }
  };

  const handleCreateUser = async () => {
    try {
      // Tạo một bản sao formData để đảm bảo không ghi đè
      const cleanData = {
        fullname: formData.fullname || "",
        username: formData.username || "",
        email: formData.email || "",
        SoDienThoai: formData.SoDienThoai || "",
        DiaChi: formData.DiaChi || "",
        avatar: formData.avatar || "",
        password: formData.password || "",
        role: "user",
      };

      console.log("📦 Dữ liệu gửi lên (tạo tài khoản):", cleanData);

      const res = await userApi.create(cleanData);
      showSuccess(res.message || "Tạo tài khoản thành công!");

      // 🔹 Refetch lại danh sách
      const updatedList = await userApi.getAll();
      console.log("📋 Danh sách sau khi tạo:", updatedList); // Debug danh sách
      setUsers(updatedList);

      handleCloseModal();
    } catch (error: any) {
      console.error("Lỗi tạo tài khoản:", error);
      showError("Tạo tài khoản thất bại!");
    }
  };

  const handleResetPassword = () => {
    alert(`Mật khẩu của ${formData.username} sẽ được đặt lại (demo UI).`);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log("📝 FormData sau khi thay đổi:", {
      ...formData,
      [e.target.name]: e.target.value,
    }); // Debug formData
  };

  const adminAccounts = users.filter((u) => u.role === "admin");
  const userAccounts = users.filter((u) => u.role === "user");

  return (
    <div>
      {/* 🔹 HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700">Quản lý tài khoản</h2>
        <Button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          <FaPlus /> Tạo tài khoản
        </Button>
      </div>

      {/* 🔹 TABLE GỘP */}
      <div className="bg-white p-4 rounded-xl shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead className="w-[140px]">Username</TableHead>
              <TableHead className="w-[200px]">Email</TableHead>
              <TableHead className="w-[160px]">Họ tên</TableHead>
              <TableHead className="w-[120px]">Số điện thoại</TableHead>
              <TableHead className="w-[200px]">Địa chỉ</TableHead>
              <TableHead className="w-[100px]">Role</TableHead>
              <TableHead className="w-[100px]">Avatar</TableHead>
              <TableHead className="w-[160px]">Ngày tạo</TableHead>
              <TableHead className="text-right w-[160px]">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* --- ADMIN --- */}
            <TableRow>
              <TableCell
                colSpan={10}
                className="font-semibold text-green-700 bg-green-50 text-left"
              >
                <div className="flex items-center gap-2">
                  <FaUserShield className="text-red-500" />
                  Tài khoản quản trị (Admin)
                </div>
              </TableCell>
            </TableRow>

            {adminAccounts.length > 0 ? (
              adminAccounts.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.fullname}</TableCell>
                  <TableCell>{user.SoDienThoai || "-"}</TableCell>
                  <TableCell>{user.DiaChi || "-"}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(user)}
                    >
                      Cập nhật
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="opacity-50 cursor-not-allowed"
                      disabled
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-gray-500">
                  Không có tài khoản admin nào.
                </TableCell>
              </TableRow>
            )}

            {/* --- USER --- */}
            <TableRow>
              <TableCell
                colSpan={10}
                className="font-semibold text-blue-700 bg-blue-50 text-left"
              >
                <div className="flex items-center gap-2">
                  <FaUser className="text-blue-500" /> Tài khoản người dùng
                  (User)
                </div>
              </TableCell>
            </TableRow>

            {userAccounts.length > 0 ? (
              userAccounts.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.fullname}</TableCell>
                  <TableCell>{user.SoDienThoai || "-"}</TableCell>
                  <TableCell>{user.DiaChi || "-"}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(user)}
                    >
                      Cập nhật
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-gray-500">
                  Không có tài khoản user nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 🔹 MODAL CẬP NHẬT HOẶC TẠO MỚI */}
      <Dialog
        open={!!editingUser || creatingUser}
        onOpenChange={handleCloseModal}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {creatingUser ? "Tạo tài khoản mới" : "Cập nhật tài khoản"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="text-sm">Họ và tên</label>
              <Input
                name="fullname"
                value={formData.fullname || ""}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
              />
            </div>

            <div>
              <label className="text-sm">Tên đăng nhập</label>
              <Input
                name="username"
                value={formData.username || ""}
                onChange={handleChange}
                disabled={!!editingUser}
                placeholder="Nhập tên đăng nhập"
              />
            </div>

            <div>
              <label className="text-sm">Email</label>
              <Input
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="Nhập email"
              />
            </div>

            {creatingUser && (
              <div>
                <label className="text-sm">Mật khẩu</label>
                <Input
                  name="password"
                  type="password"
                  value={formData.password || ""}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                />
              </div>
            )}

            <div>
              <label className="text-sm">Số điện thoại</label>
              <Input
                name="SoDienThoai"
                value={formData.SoDienThoai || ""}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div>
              <label className="text-sm">Địa chỉ</label>
              <Input
                name="DiaChi"
                value={formData.DiaChi || ""}
                onChange={handleChange}
                placeholder="Nhập địa chỉ"
              />
            </div>

            <div>
              <label className="text-sm">Ảnh đại diện (URL)</label>
              <Input
                name="avatar"
                value={formData.avatar || ""}
                onChange={handleChange}
                placeholder="Nhập URL ảnh đại diện"
              />
            </div>
          </div>

          <div className="flex justify-between mt-5">
            <Button variant="outline" onClick={handleCloseModal}>
              Hủy
            </Button>
            <div className="flex gap-2">
              {editingUser?.role === "admin" && !creatingUser && (
                <Button
                  variant="secondary"
                  className="bg-yellow-500 text-white hover:bg-yellow-600"
                  onClick={handleResetPassword}
                >
                  Đặt lại mật khẩu
                </Button>
              )}
              <Button onClick={creatingUser ? handleCreateUser : handleSave}>
                {creatingUser ? "Tạo tài khoản" : "Lưu thay đổi"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
