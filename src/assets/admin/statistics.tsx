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
import * as XLSX from "xlsx";
import { showError } from "@/common/toast";

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

  // ======== XUẤT EXCEL =========
  const exportToExcel = () => {
    if (data.length === 0) {
      showError("Không có dữ liệu để xuất.");
      return;
    }

    const labelTitle =
      type === "day" ? "Ngày" : type === "month" ? "Tháng" : "Năm";

    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        [labelTitle]: item.label,
        "Doanh thu (₫)": item.revenue,
        "Số đơn": item.orders,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DoanhThu");

    const periodTitle = getPeriodTitle() || "ToanBo";
    XLSX.writeFile(workbook, `DoanhThu_${type}_${periodTitle}.xlsx`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 p-4">
      <div className="flex-1 flex flex-col bg-white shadow rounded-2xl overflow-hidden">
        {/* HEADER - Cố định, gọn gàng */}
        <div className="p-3 sm:p-4 border-b flex-shrink-0">
          <div className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-center sm:text-left">
              Thống kê doanh thu theo{" "}
              {type === "day" ? "ngày" : type === "month" ? "tháng" : "năm"}
              {selectedDate && (
                <span
                  className="block sm:inline text-sm font-normal text-gray-600 
                     mt-1 sm:mt-0 sm:ml-1"
                >
                  ({getPeriodTitle()})
                </span>
              )}
            </h2>

            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start text-xs">
              <button
                onClick={exportToExcel}
                className="px-3 py-1.5 rounded-md bg-green-100 hover:bg-green-200 transition whitespace-nowrap"
              >
                Xuất Excel
              </button>

              <select
                className="px-3 py-1.5 rounded-md border text-xs"
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
                className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition whitespace-nowrap"
              >
                Reset
              </button>

              {/* DatePicker responsive */}
              {type === "day" && (
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  placeholderText="Chọn ngày"
                  dateFormat="dd/MM/yyyy"
                  className="px-3 py-1.5 rounded-md border text-xs w-full sm:w-36"
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
                  className="px-3 py-1.5 rounded-md border text-xs w-full sm:w-32"
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
                  className="px-3 py-1.5 rounded-md border text-xs w-full sm:w-28"
                  isClearable
                />
              )}
            </div>
          </div>
        </div>

        {/* CHART - Full height, scroll ngang nếu cần */}
        <div className="flex-1 min-h-0 p-2 sm:p-4">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500 text-center px-4 text-sm">
              {selectedDate ? (
                <>Không có dữ liệu cho kỳ đã chọn</>
              ) : (
                <>Vui lòng chọn một kỳ để xem thống kê</>
              )}
            </div>
          ) : (
            <div className="h-full overflow-x-auto overflow-y-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 10, right: 15, left: 10, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 11 }}
                    interval={0}
                  />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(v) => v.toLocaleString("vi-VN")}
                    label={{
                      value: "Doanh thu (₫)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                    width={100}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "Số đơn",
                      angle: 90,
                      position: "insideRight",
                    }}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) =>
                      name === "Doanh thu"
                        ? [`${value.toLocaleString("vi-VN")} ₫`, name]
                        : [value, name]
                    }
                    contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
