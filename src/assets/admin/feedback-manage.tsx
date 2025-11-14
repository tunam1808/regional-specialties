import { useEffect, useState } from "react";
import { getAllFeedback, deleteFeedback } from "@/api/feedback";
import type { Feedback } from "@/types/feedback.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/dialog";
import { Button } from "@/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { showSuccess, showError } from "@/common/toast";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const data = await getAllFeedback();
        setFeedbacks(data.data || []);
      } catch (err) {
        console.error("Lỗi khi tải feedback:", err);
        showError("Không thể tải danh sách đánh giá.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const handleOpenDelete = (id: number) => {
    setDeleteId(id);
    setOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteFeedback(deleteId);
      setFeedbacks((prev) => prev.filter((f) => f.id !== deleteId));
      showSuccess("Xóa đánh giá thành công");
    } catch (err) {
      console.error("Lỗi khi xóa feedback:", err);
      showError("Xóa đánh giá thất bại");
    } finally {
      setOpen(false);
      setDeleteId(null);
    }
  };

  if (loading) return <p>Đang tải danh sách đánh giá...</p>;

  return (
    <div className="mt-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-green-700 text-center sm:text-left w-full mb-4 ml-4 sm:mb-5">
        Quản lý bài đánh giá
      </h1>

      <div className="px-0 sm:px-6 pl-0">
        {feedbacks.length === 0 ? (
          <p>Chưa có đánh giá nào.</p>
        ) : (
          <Table className="bg-white border rounded-lg shadow-sm">
            <TableHeader>
              <TableRow className="font-semibold text-green-700 bg-green-50">
                <TableHead>ID</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Tỉnh thành</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Bình luận</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbacks.map((fb) => (
                <TableRow key={fb.id}>
                  <TableCell>{fb.id}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    {fb.avatar && (
                      <img
                        src={fb.avatar}
                        alt={fb.fullname}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    {fb.fullname}
                  </TableCell>
                  <TableCell>{fb.TinhThanh || "-"}</TableCell>
                  <TableCell>{fb.rating}⭐</TableCell>
                  <TableCell>{fb.comment}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => handleOpenDelete(fb.id)}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* ✅ Dialog xác nhận */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không
              thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
