// src/components/RevenueChart.tsx
import { useEffect, useState } from "react";
import { getRevenue } from "@/api/statistic";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function RevenueChart() {
  const [data, setData] = useState<
    { label: string; revenue: number; orders: number }[]
  >([]);
  const [type, setType] = useState<"day" | "month" | "year">("day");

  // Chỉ chọn 1 kỳ
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // startDate & endDate
  const [startDateStr, setStartDateStr] = useState<string>("");
  const [endDateStr, setEndDateStr] = useState<string>("");

  // Tính start/end theo type
  useEffect(() => {
    if (!selectedDate) {
      setStartDateStr("");
      setEndDateStr("");
      return;
    }

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();

    let start = "";
    let end = "";

    switch (type) {
      case "day":
        start = end = `${year}-${String(month + 1).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`;
        break;
      case "month": {
        start = `${year}-${String(month + 1).padStart(2, "0")}-01`;
        const lastDay = new Date(year, month + 1, 0).getDate();
        end = `${year}-${String(month + 1).padStart(2, "0")}-${String(
          lastDay
        ).padStart(2, "0")}`;
        break;
      }
      case "year":
        start = `${year}-01-01`;
        end = `${year}-12-31`;
        break;
    }

    setStartDateStr(start);
    setEndDateStr(end);

    console.log("Selected → range:", { type, start, end });
  }, [selectedDate, type]);

  // GỌI API: DÙNG ĐÚNG TYPE
  useEffect(() => {
    if (!startDateStr || !endDateStr) {
      setData([]);
      return;
    }

    (async () => {
      try {
        const payload = {
          startDate: startDateStr,
          endDate: endDateStr,
          all: false,
        };

        // DÙNG ĐÚNG TYPE CHO API
        const apiType: "day" | "month" | "year" = type;

        // "Tháng" → nhóm theo tháng
        // "Năm" → nhóm theo tháng
        // "Ngày" → nhóm theo ngày

        console.log("Calling getRevenue with API TYPE:", apiType, payload);
        const res = await getRevenue(apiType, payload);

        if (!res || res.length === 0) {
          console.log("API trả về rỗng");
          setData([]);
          return;
        }

        // === CHỈ HIỂN THỊ NHỮNG GÌ CÓ DỮ LIỆU ===
        const mapped = res.map((item: any) => {
          let label = item.label || "";

          if (type === "day") {
            label = label.split("-").slice(1).join("/"); // 2025-11-10 → 11/10
          } else if (type === "month") {
            const monthNum = parseInt(label.split("-")[1]);
            const monthNames = [
              "Tháng 1",
              "Tháng 2",
              "Tháng 3",
              "Tháng 4",
              "Tháng 5",
              "Tháng 6",
              "Tháng 7",
              "Tháng 8",
              "Tháng 9",
              "Tháng 10",
              "Tháng 11",
              "Tháng 12",
            ];
            label = monthNames[monthNum - 1] || label;
          } else if (type === "year") {
            const monthNum = parseInt(label.split("-")[1]);
            const monthNames = [
              "Tháng 1",
              "Tháng 2",
              "Tháng 3",
              "Tháng 4",
              "Tháng 5",
              "Tháng 6",
              "Tháng 7",
              "Tháng 8",
              "Tháng 9",
              "Tháng 10",
              "Tháng 11",
              "Tháng 12",
            ];
            label = monthNames[monthNum - 1] || label;
          }

          return {
            label,
            revenue: Number(item.TongDoanhThu || 0),
            orders: Number(item.SoDon || 0),
          };
        });

        // Sắp xếp
        if (type === "year") {
          const monthOrder = [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
          ];
          mapped.sort(
            (a, b) => monthOrder.indexOf(a.label) - monthOrder.indexOf(b.label)
          );
        } else {
          mapped.sort((a, b) => a.label.localeCompare(b.label));
        }

        console.log("Mapped data:", mapped);
        setData(mapped);
      } catch (err: any) {
        console.error("Lỗi API:", err);
        setData([]);
      }
    })();
  }, [type, startDateStr, endDateStr]);

  // Reset
  const resetFilter = () => {
    setSelectedDate(null);
  };

  // Tiêu đề kỳ
  const getPeriodTitle = () => {
    if (!selectedDate) return "";
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth() + 1;
    const d = selectedDate.getDate();

    switch (type) {
      case "day":
        return `${String(d).padStart(2, "0")}/${String(m).padStart(
          2,
          "0"
        )}/${y}`;
      case "month":
        return `${m}/${y}`;
      case "year":
        return `${y}`;
      default:
        return "";
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-2xl">
      {/* Header + Bộ lọc */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h2 className="text-xl font-semibold">
          Thống kê doanh thu theo{" "}
          {type === "day" ? "ngày" : type === "month" ? "tháng" : "năm"}
          {selectedDate && (
            <span className="text-base font-normal text-gray-600 ml-2">
              ({getPeriodTitle()})
            </span>
          )}
        </h2>

        <div className="flex flex-wrap gap-2 items-center">
          <select
            className="border px-3 py-1.5 rounded-md text-sm"
            value={type}
            onChange={(e) => {
              const newType = e.target.value as "day" | "month" | "year";
              setType(newType);
              resetFilter();
            }}
          >
            <option value="day">Ngày</option>
            <option value="month">Tháng</option>
            <option value="year">Năm</option>
          </select>

          <button
            onClick={resetFilter}
            className="border px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200 transition"
          >
            Reset
          </button>

          {type === "day" && (
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              placeholderText="Chọn ngày"
              dateFormat="dd/MM/yyyy"
              className="border px-3 py-1.5 rounded-md text-sm w-40"
              isClearable
            />
          )}

          {type === "month" && (
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              placeholderText="Chọn tháng"
              className="border px-3 py-1.5 rounded-md text-sm w-32"
              isClearable
            />
          )}

          {type === "year" && (
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy"
              showYearPicker
              placeholderText="Chọn năm"
              className="border px-3 py-1.5 rounded-md text-sm w-28"
              isClearable
            />
          )}
        </div>
      </div>

      {/* Biểu đồ */}
      {data.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          {selectedDate ? (
            <>Không có dữ liệu cho kỳ đã chọn</>
          ) : (
            <>Vui lòng chọn một kỳ để xem thống kê</>
          )}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={550}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis
              yAxisId="left"
              tickFormatter={(v) => v.toLocaleString("vi-VN")}
              label={{
                value: "Doanh thu (₫)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
              width={100}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: "Số đơn",
                angle: 90,
                position: "insideRight",
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip
              formatter={(value: number, name: string) =>
                name === "Doanh thu"
                  ? [`${value.toLocaleString("vi-VN")} ₫`, name]
                  : [value, name]
              }
              contentStyle={{ borderRadius: "8px", fontSize: "14px" }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="revenue"
              name="Doanh thu"
              fill="#8884d8"
            />
            <Bar
              yAxisId="right"
              dataKey="orders"
              name="Số đơn"
              fill="#82ca9d"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
