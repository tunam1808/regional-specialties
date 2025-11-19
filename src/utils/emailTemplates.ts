// src/utils/emailTemplates.ts
export const orderSuccessEmail = (
  customerName: string,
  orderId: string,
  total: number,
  shippingFee: number,
  items: Array<{ name: string; quantity: number; price: number }>,
  address: string,
  paymentMethod: string
) => {
  const itemRows = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px 0; color: #555;">
          ${item.name} × ${item.quantity}
        </td>
        <td style="padding: 12px 0; text-align: right; color: #333; font-weight: 500;">
          ${(item.price * item.quantity).toLocaleString("vi-VN")}₫
        </td>
      </tr>
    `
    )
    .join("");

  const paymentText =
    paymentMethod === "Tiền mặt"
      ? "Thanh toán khi nhận hàng (COD)"
      : paymentMethod === "Chuyển khoản"
      ? "Chuyển khoản ngân hàng"
      : "PayPal";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Đơn hàng thành công #${orderId}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
    .content { padding: 30px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 25px; text-align: center; color: #666; font-size: 14px; }
    .badge { background: #e8f5e9; color: #2e7d32; padding: 8px 16px; border-radius: 50px; font-weight: bold; display: inline-block; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0; font-size:28px;">🎉 Đặt hàng thành công!</h1>
      <p style="margin:10px 0 0; font-size:16px; opacity:0.9;">Cảm ơn bạn đã tin tưởng shop ❤️</p>
    </div>

    <div class="content">
      <p>Xin chào <strong style="color:#d81b60;">${customerName}</strong>,</p>
      <p>Đơn hàng của bạn đã được tiếp nhận thành công!</p>

      <div style="background:#f3e5f5; padding:15px; border-radius:12px; text-align:center; margin:20px 0;">
        <p style="margin:0; font-size:18px;">Mã đơn hàng của bạn là:</p>
        <h2 style="margin:10px 0 0; color:#9c27b0; letter-spacing:3px;">#${orderId}</h2>
      </div>

      <table>${itemRows}</table>

      <table style="margin-top:15px; font-weight:500;">
        ${
          shippingFee > 0
            ? `<tr><td>Phí vận chuyển:</td><td style="text-align:right;">${shippingFee.toLocaleString(
                "vi-VN"
              )}₫</td></tr>`
            : ""
        }
        <tr style="font-size:18px; color:#d32f2f;">
          <td><strong>Tổng cộng:</strong></td>
          <td style="text-align:right;"><strong>${total.toLocaleString(
            "vi-VN"
          )}₫</strong></td>
        </tr>
      </table>

      <div style="background:#e3f2fd; padding:15px; border-radius:12px; margin:20px 0; line-height:1.6;">
        <p style="margin:0;"><strong>📍 Địa chỉ giao:</strong> ${address}</p>
        <p style="margin:10px 0 0;"><strong>💳 Thanh toán:</strong> ${paymentText}</p>
      </div>

      
    </div>

    <div class="footer">
      <p>MTN Shop - Đặc sản ba miền • Hotline: 0345281795</p>
      <p style="margin:10px 0 0; color:#999;">Email được gửi tự động • Vui lòng không trả lời email này</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Bonus: Template nhắc nhở chuyển khoản (khi chọn QR)
// export const paymentReminderEmail = (
//   customerName: string,
//   orderId: string,
//   amount: number,
//   qrInfo: string
// ) => {
//   return `
// <!DOCTYPE html>
// <html>
// <head><meta charset="utf-8"><style>
//   body{font-family:Arial,sans-serif;background:#f9f9f9;padding:20px}
//   .box{max-width:550px;margin:auto;background:white;padding:30px;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.1);text-align:center}
//   h1{color:#1976d2}
// </style></head>
// <body>
// <div class="box">
//   <h1>⏰ Nhắc nhở chuyển khoản đơn #${orderId}</h1>
//   <p>Chào <strong>${customerName}</strong>! Shop thấy bạn chọn thanh toán chuyển khoản nhưng chưa thấy tiền về ạ~</p>
//   <p style="background:#fff3e0;padding:15px;border-radius:12px;font-size:18px;">
//     Vui lòng chuyển <strong style="color:#e65100;">${amount.toLocaleString(
//       "vi-VN"
//     )}₫</strong><br>
//     Nội dung: <strong>${qrInfo}</strong>
//   </p>
//   <p>Shop chờ tiền về để xác nhận đơn nha~ Cảm ơn bạn nhiều lắm luôn! ❤️</p>
// </div>
// </body>
// </html>
//   `;
// };
