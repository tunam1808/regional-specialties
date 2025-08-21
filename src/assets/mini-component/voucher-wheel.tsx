import { useState } from "react";
import { Wheel } from "react-custom-roulette";
import { Button } from "@/components/button";
import { Link } from "react-router-dom";

const data = [
  { option: "Voucher 10%" },
  { option: "Voucher 20%" },
  { option: "Voucher 30%" },
  { option: "Voucher 50%" },
  { option: "Giảm 10k" },
  { option: "Free Ship" },
  { option: "Giảm 30k" },
  { option: "Voucher 5%" },
  { option: "Voucher 15%" },
  { option: "Voucher 25%" },
];

export default function VoucherWheel() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    setResult(null); // reset khi bắt đầu quay mới
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Link to="/">
        <Button variant="default" className="mt-5">
          Trở về trang chủ
        </Button>
      </Link>

      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        backgroundColors={[
          "#FFDDC1",
          "#FFABAB",
          "#FFC3A0",
          "#D5AAFF",
          "#85E3FF",
        ]}
        textColors={["#333"]}
        outerBorderColor="#000"
        outerBorderWidth={3}
        radiusLineColor="#000"
        radiusLineWidth={2}
        onStopSpinning={() => {
          setMustSpin(false);
          setResult(data[prizeNumber].option);
        }}
      />

      <button
        onClick={handleSpinClick}
        disabled={mustSpin}
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
      >
        {mustSpin ? "Đang quay..." : "Quay Ngay "}
      </button>

      {result && (
        <div className="mt-4 text-xl font-bold text-green-600">
          Bạn đã trúng: {result}
        </div>
      )}
    </div>
  );
}
