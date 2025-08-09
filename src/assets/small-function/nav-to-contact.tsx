// Component này dùng để điều hướng về phần liên hệ trong trang chủ khi chúng ta đang ở bất cứ trang nào

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHashElement() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100); // đợi render xong rồi mới scroll
      }
    }
  }, [pathname, hash]);

  return null;
}
