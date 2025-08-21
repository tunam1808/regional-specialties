// Đây là câu hỏi thường gặp

import { useState } from "react";
import { Button } from "@/components/button";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "Đặc sản miền Bắc nổi tiếng nhất là gì?",
    answer:
      "Miền Bắc nổi tiếng với cốm làng Vòng, bánh chưng, phở Hà Nội, bún chả...",
  },
  {
    question: "Miền Trung có đặc sản gì đặc biệt?",
    answer:
      "Miền Trung có mì Quảng, bún bò Huế, nem chợ Huyện, bánh tráng cuốn thịt heo...",
  },
  {
    question: "Miền Nam có những món ăn nào đặc trưng?",
    answer:
      "Miền Nam nổi tiếng với hủ tiếu Mỹ Tho, cá kho tộ, bánh xèo, gỏi cuốn...",
  },
  {
    question: "Có thể mua đặc sản ba miền online không?",
    answer:
      "Có, hiện nay nhiều cửa hàng và sàn thương mại điện tử cung cấp đặc sản ba miền, giao hàng tận nơi.",
  },
  {
    question: "Đặc sản nào thường được chọn làm quà biếu?",
    answer:
      "Thường chọn bánh kẹo đặc sản, nem chua, mứt, trà, cà phê, rượu vang, trái cây sấy...",
  },
  {
    question: "Mua đặc sản miền Bắc ở TP.HCM có dễ không?",
    answer:
      "Có, bạn có thể mua tại các cửa hàng chuyên bán đặc sản vùng miền hoặc đặt online.",
  },
  {
    question: "Miền Trung có đặc sản khô gì ngon?",
    answer:
      "Đặc sản khô nổi tiếng có mực rim me, cá cơm rim, tôm khô, bò khô...",
  },
  {
    question: "Đặc sản miền Nam có ngọt nhiều không?",
    answer:
      "Đúng vậy, miền Nam nổi tiếng với các loại bánh kẹo, trái cây và chè ngọt.",
  },
  {
    question: "Có tour du lịch kèm mua đặc sản không?",
    answer:
      "Nhiều tour du lịch hiện nay có phần tham quan chợ đặc sản và mua sắm quà lưu niệm.",
  },
  {
    question: "Làm sao để bảo quản đặc sản lâu?",
    answer:
      "Mỗi loại đặc sản có cách bảo quản riêng, ví dụ khô thì để nơi thoáng mát, bánh kẹo nên dùng hộp kín.",
  },
  {
    question: "Có đặc sản nào nên ăn ngay khi mua?",
    answer:
      "Có, ví dụ bánh cuốn Thanh Trì, bún chả Hà Nội, bánh xèo miền Tây ngon nhất khi ăn nóng.",
  },
  {
    question: "Có thể mang đặc sản ba miền đi nước ngoài không?",
    answer:
      "Tùy loại, thường đặc sản khô, đóng gói sẵn được phép mang, còn đồ tươi sống thì hạn chế.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="">
      <Link to="/">
        <Button variant="default" className="mt-5 ml-5">
          Trở về trang chủ
        </Button>
      </Link>
      <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Các câu hỏi thường gặp
      </h2>
      <div className="space-y-3 pr-2">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl shadow-sm overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center p-4 text-left text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              {faq.question}
              <span className="ml-2 text-gray-500">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div className="p-4 text-gray-600 bg-gray-50 border-t border-gray-200">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
