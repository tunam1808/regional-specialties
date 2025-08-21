// Đây là chính sách giao hàng

import { Button } from "@/components/button";
import { Link } from "react-router-dom";

export default function ShippingPolicy() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Tiêu đề */}
      <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
        CHÍNH SÁCH GIAO HÀNG
      </h1>

      {/* Giới thiệu */}
      <p className="text-gray-700 text-justify mb-10">
        Với mong muốn đưa những hương vị đặc trưng của ẩm thực Việt Nam từ Bắc
        chí Nam đến tận tay khách hàng, chúng tôi xây dựng chính sách giao hàng
        rõ ràng, minh bạch và thuận tiện. Chính sách này áp dụng cho tất cả các
        đơn hàng đặt tại hệ thống cửa hàng & website phân phối đặc sản ba miền.
      </p>

      {/* Nguyên tắc chung */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-green-700 mb-3">
          1. Nguyên tắc chung
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            Mọi đơn hàng đều được xác nhận qua điện thoại hoặc email trước khi
            giao.
          </li>
          <li>
            Sản phẩm được đóng gói kỹ lưỡng, đảm bảo vệ sinh an toàn thực phẩm.
          </li>
          <li>Khách hàng có quyền kiểm tra hàng trước khi thanh toán.</li>
          <li>Hóa đơn VAT được xuất theo yêu cầu.</li>
        </ul>
      </section>

      {/* Phạm vi giao hàng */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-green-700 mb-3">
          2. Phạm vi giao hàng
        </h2>
        <p className="text-gray-700 mb-2">
          Chúng tôi giao hàng trên toàn quốc thông qua các đơn vị vận chuyển uy
          tín như Giao Hàng Nhanh (GHN), Viettel Post, J&T Express và đối tác
          giao hàng nội bộ.
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>
            Khu vực nội thành Hà Nội & TP. Hồ Chí Minh: hỗ trợ giao nhanh trong
            24h.
          </li>
          <li>Các tỉnh thành khác: thời gian từ 2 - 5 ngày tùy địa điểm.</li>
          <li>Vùng sâu, vùng xa: thời gian có thể kéo dài 5 - 7 ngày.</li>
        </ul>
      </section>

      {/* Thời gian giao hàng theo miền */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-green-700 mb-5">
          3. Thời gian & ưu đãi giao hàng
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Miền Bắc */}
          <div className="bg-white rounded-2xl shadow-lg p-5 border-t-4 border-green-600">
            <h3 className="text-xl font-semibold text-green-700 mb-3">
              Miền Bắc
            </h3>
            <p className="text-gray-600">
              - Thời gian: 1 - 3 ngày làm việc <br />
              - Miễn phí vận chuyển cho đơn &gt; 500.000đ <br />- Bảo quản lạnh
              cho sản phẩm tươi (nem, giò chả, bánh cuốn).
            </p>
          </div>

          {/* Miền Trung */}
          <div className="bg-white rounded-2xl shadow-lg p-5 border-t-4 border-orange-500">
            <h3 className="text-xl font-semibold text-orange-600 mb-3">
              Miền Trung
            </h3>
            <p className="text-gray-600">
              - Thời gian: 2 - 4 ngày làm việc <br />- Hỗ trợ gói hút chân không
              cho đặc sản khô (mực, bò khô, tré) <br />- Miễn phí vận chuyển cho
              đơn &gt; 700.000đ.
            </p>
          </div>

          {/* Miền Nam */}
          <div className="bg-white rounded-2xl shadow-lg p-5 border-t-4 border-red-500">
            <h3 className="text-xl font-semibold text-red-600 mb-3">
              Miền Nam
            </h3>
            <p className="text-gray-600">
              - Thời gian: 2 - 5 ngày làm việc <br />
              - Giao nhanh 24h tại TP. Hồ Chí Minh <br />- Miễn phí vận chuyển
              cho đơn &gt; 600.000đ.
            </p>
          </div>
        </div>
      </section>

      {/* Chi phí vận chuyển */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-green-700 mb-3">
          4. Chi phí vận chuyển
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            Đơn hàng dưới giá trị miễn phí: tính phí theo bảng giá của đơn vị
            vận chuyển.
          </li>
          <li>
            Đơn hàng cồng kềnh (thùng lớn &gt; 10kg): phụ thu theo trọng lượng.
          </li>
          <li>
            Đơn hàng giao gấp (trong 2h tại nội thành): phụ phí 30.000đ -
            50.000đ.
          </li>
        </ul>
      </section>

      {/* Chính sách đổi trả */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-green-700 mb-3">
          5. Chính sách đổi trả
        </h2>
        <p className="text-gray-700 mb-2">
          Chúng tôi cam kết đổi trả trong vòng 48h kể từ khi khách hàng nhận
          hàng nếu:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Sản phẩm bị hư hỏng do quá trình vận chuyển.</li>
          <li>Giao sai sản phẩm, thiếu hàng so với đơn đặt.</li>
          <li>Sản phẩm còn hạn sử dụng nhưng không đạt chất lượng cam kết.</li>
        </ul>
      </section>

      {/* Lưu ý */}
      <section>
        <h2 className="text-2xl font-semibold text-green-700 mb-3">
          6. Lưu ý quan trọng
        </h2>
        <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-4">
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              Khách hàng vui lòng cung cấp địa chỉ, số điện thoại chính xác.
            </li>
            <li>
              Thời gian giao hàng có thể thay đổi trong dịp Lễ, Tết hoặc do
              thiên tai, dịch bệnh.
            </li>
            <li>
              Đối với sản phẩm đông lạnh: vui lòng bảo quản ngay trong ngăn đá
              sau khi nhận hàng.
            </li>
            <li>
              Hỗ trợ đổi trả nếu sản phẩm bị hư hỏng trong quá trình vận chuyển.
            </li>
          </ul>
        </div>
      </section>
      <Link to="/">
        <Button variant="default" className="mt-5">
          Trở về trang chủ
        </Button>
      </Link>
    </div>
  );
}
