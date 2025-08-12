import { FaUtensils, FaMapMarkedAlt, FaLeaf, FaSmile } from "react-icons/fa";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";

export default function FunFacts() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const facts = [
    {
      icon: <FaUtensils className="text-4xl text-yellow-500" />,
      number: 3000,
      suffix: "+",
      text: "Món ăn truyền thống trên khắp Việt Nam",
    },
    {
      icon: <FaMapMarkedAlt className="text-4xl text-green-500" />,
      number: 63,
      suffix: "",
      text: "Tỉnh thành với đặc sản riêng",
    },
    {
      icon: <FaLeaf className="text-4xl text-emerald-500" />,
      number: 70,
      suffix: "%",
      text: "Món ăn sử dụng nguyên liệu tươi theo mùa",
    },
    {
      icon: <FaSmile className="text-4xl text-pink-500" />,
      number: 100,
      suffix: "%",
      text: "Người Việt yêu thích ẩm thực",
    },
  ];

  return (
    <section className=" py-12 px-6">
      <div className="max-w-6xl mx-auto text-center" ref={ref}>
        {/* Tiêu đề */}
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex justify-center text-yellow-500 text-2xl mt-2"
          style={{ fontFamily: "'Ga Maamli', sans-serif" }}
        >
          MTN Fun Facts
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center text-4xl mb-6 mt-2 font-bold"
          style={{ fontFamily: "'Baloo 2', cursive" }}
        >
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div>SỐ LIỆU THỐNG KÊ</div>
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {facts.map((fact, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 flex flex-col items-center bg-gradient-to-r from-orange-100 to-yellow-50"
            >
              <div className="mb-3">{fact.icon}</div>

              {/* Số và mô tả gần nhau */}
              <div className="flex flex-col items-center text-center">
                <h3 className="text-2xl font-bold text-gray-800">
                  {inView && (
                    <CountUp
                      start={0}
                      end={fact.number}
                      duration={2}
                      suffix={fact.suffix}
                    />
                  )}
                </h3>
                <p className="text-gray-600 mt-1">{fact.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
