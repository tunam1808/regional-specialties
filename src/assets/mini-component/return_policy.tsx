// Đây là chính sách đổi trả

import { Button } from "@/components/button";
import { Link } from "react-router-dom";

export default function ReturnPolicy() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Tiêu đề */}
      <h1 className="text-3xl font-bold text-center mb-6 text-red-700">
        CHÍNH SÁCH ĐỔI TRẢ
      </h1>

      {/* Giới thiệu */}
      <p className="text-gray-700 text-justify mb-10">
        Chúng tôi luôn mong muốn mang đến cho khách hàng những sản phẩm chất
        lượng nhất, tuy nhiên trong một số trường hợp không mong muốn, quý khách
        hoàn toàn có quyền đổi trả theo các điều kiện được quy định rõ ràng dưới
        đây. Chính sách đổi trả này được áp dụng trên toàn hệ thống bán hàng
        trực tuyến và cửa hàng phân phối đặc sản ba miền.
      </p>

      {/* Điều kiện đổi trả */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-red-700 mb-3">
          1. Điều kiện áp dụng
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Sản phẩm còn nguyên tem, nhãn mác, bao bì như khi nhận hàng.</li>
          <li>Sản phẩm chưa qua sử dụng, chưa qua chế biến.</li>
          <li>
            Trường hợp đổi trả do lỗi vận chuyển (bể, vỡ, móp méo, dập nát) cần
            có hình ảnh xác nhận ngay khi nhận hàng.
          </li>
          <li>
            Trường hợp giao sai sản phẩm hoặc thiếu số lượng phải báo trong vòng
            24h kể từ khi nhận.
          </li>
        </ul>
      </section>

      {/* Thời hạn đổi trả */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-red-700 mb-3">
          2. Thời hạn đổi trả
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Trong vòng 48h đối với sản phẩm tươi sống, dễ hỏng.</li>
          <li>
            Trong vòng 7 ngày đối với sản phẩm khô, đóng gói, còn hạn sử dụng.
          </li>
          <li>
            Quá thời gian trên, chúng tôi rất tiếc không thể hỗ trợ đổi trả vì
            lý do an toàn thực phẩm.
          </li>
        </ul>
      </section>

      {/* Quy trình đổi trả */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-red-700 mb-3">
          3. Quy trình đổi trả
        </h2>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700">
          <li>
            Khách hàng liên hệ hotline hoặc gửi email kèm hình ảnh/video chứng
            minh tình trạng sản phẩm.
          </li>
          <li>Bộ phận chăm sóc khách hàng tiếp nhận và xác nhận thông tin.</li>
          <li>
            Sau khi được xác nhận, khách hàng gửi sản phẩm về kho hoặc cửa hàng
            gần nhất.
          </li>
          <li>
            Chúng tôi tiến hành kiểm tra và gửi sản phẩm thay thế hoặc hoàn tiền
            (tùy lựa chọn của khách hàng).
          </li>
        </ol>
      </section>

      {/* Chi phí đổi trả */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-red-700 mb-3">
          4. Chi phí đổi trả
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            Trường hợp lỗi từ phía cửa hàng (sai hàng, hỏng hóc, chất lượng
            kém): chúng tôi chịu 100% chi phí vận chuyển đổi trả.
          </li>
          <li>
            Trường hợp khách hàng muốn đổi sản phẩm do thay đổi nhu cầu: khách
            hàng thanh toán phí vận chuyển 2 chiều.
          </li>
        </ul>
      </section>

      {/* Hoàn tiền */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-red-700 mb-3">
          5. Chính sách hoàn tiền
        </h2>
        <p className="text-gray-700 mb-2">
          Trong trường hợp khách hàng không muốn đổi sản phẩm mà yêu cầu hoàn
          tiền, chúng tôi sẽ xử lý theo các hình thức sau:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Hoàn tiền mặt trực tiếp tại cửa hàng.</li>
          <li>
            Hoàn qua chuyển khoản ngân hàng (trong vòng 3 - 5 ngày làm việc).
          </li>
          <li>
            Đối với thanh toán qua thẻ/ ví điện tử: tiền sẽ được hoàn về tài
            khoản gốc.
          </li>
        </ul>
      </section>

      {/* Lưu ý */}
      <section>
        <h2 className="text-2xl font-semibold text-red-700 mb-3">
          6. Lưu ý quan trọng
        </h2>
        <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-4">
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              Không áp dụng đổi trả cho sản phẩm khuyến mãi, giảm giá, hoặc hàng
              tặng kèm.
            </li>
            <li>
              Mọi trường hợp đổi trả phải có xác nhận trước từ bộ phận chăm sóc
              khách hàng.
            </li>
            <li>
              Sản phẩm hỏng do lỗi bảo quản từ phía khách hàng sẽ không được hỗ
              trợ đổi trả.
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
