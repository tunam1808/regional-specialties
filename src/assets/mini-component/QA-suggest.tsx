// Các câu hỏi gợi ý khi chat với cửa hàng

type Suggestion = {
  q: string;
  a: string;
};

interface ChatSuggestionsProps {
  onSelect: (item: Suggestion) => void;
}

const sampleQuestions: Suggestion[] = [
  {
    q: "Shop có giao hàng toàn quốc không?",
    a: "Dạ có ạ! Shop hỗ trợ giao hàng toàn quốc, thời gian 2-5 ngày tuỳ khu vực.",
  },
  {
    q: "Phí vận chuyển là bao nhiêu?",
    a: "Phí vận chuyển tính theo đơn vị vận chuyển và trọng lượng. Đơn từ 500k sẽ FREESHIP.",
  },
  {
    q: "Có thể đặt số lượng lớn không?",
    a: "Shop có chính sách ưu đãi cho đơn hàng số lượng lớn và đối tác.",
  },
  {
    q: "Sản phẩm có đảm bảo vệ sinh không?",
    a: "Tất cả sản phẩm đều có chứng nhận an toàn vệ sinh thực phẩm và đóng gói cẩn thận.",
  },
];

export default function ChatSuggestions({ onSelect }: ChatSuggestionsProps) {
  return (
    <div className="flex gap-2 flex-wrap mt-2">
      {sampleQuestions.map((item, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(item)}
          className="px-3 py-1.5 text-xs bg-white border border-orange-300 text-orange-600 rounded-full shadow-sm hover:bg-orange-50 transition"
        >
          {item.q}
        </button>
      ))}
    </div>
  );
}
