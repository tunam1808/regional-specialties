// Chức năng thông báo

import toast from "react-hot-toast";

// Thông báo thành công
export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: "bottom-left",
    style: {
      background: "#4caf50",
      color: "#fff",
      fontSize: "14px",
    },
  });
};

// Thông báo lỗi
export const showError = (message: string) => {
  toast.error(message, {
    duration: 3000,
    position: "bottom-left",
    style: {
      background: "#f44336",
      color: "#fff",
      fontSize: "14px",
    },
  });
};

// Thông báo bình thường
export const showInfo = (message: string) => {
  toast(message, {
    duration: 3000,
    position: "bottom-left",
    style: {
      background: "#2196f3",
      color: "#fff",
      fontSize: "14px",
    },
  });
};
