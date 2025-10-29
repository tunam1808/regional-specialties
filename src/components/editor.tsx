import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// ✅ Kiểu prop rõ ràng, tránh lỗi any
interface MyEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MyEditor: React.FC<MyEditorProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="w-full">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Nhập nội dung..."}
        modules={modules}
        formats={formats}
        className="bg-white rounded-lg shadow-sm"
      />
    </div>
  );
};

// ✏️ Toolbar: đủ cơ bản cho mô tả sản phẩm
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "align",
  "list",
  "bullet",
  "link",
  "image",
];

export default MyEditor;
