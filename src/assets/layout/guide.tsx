import {
  FaPhoneAlt,
  FaShoppingBasket,
  FaMotorcycle,
  FaCreditCard,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function OrderProcess() {
  const steps = [
    { icon: <FaPhoneAlt size={36} />, bold: "Gọi 0345281795" },
    { icon: <FaShoppingBasket size={36} />, label: "Tạo đơn hàng" },
    { icon: <FaMotorcycle size={36} />, label: "Giao hàng" },
    { icon: <FaCreditCard size={36} />, label: "Thanh toán" },
  ];

  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <div className="relative py-16 px-4 overflow-hidden" ref={ref}>
      <div className="max-w-screen-xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <h2
            className="text-3xl font-bold text-gray-800"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-3xl font-bold text-black mb-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                CÁCH THỨC ĐẶT HÀNG
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
              </div>
            </motion.h2>
          </h2>
        </div>

        <div className="flex justify-center items-center gap-6 flex-wrap">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.3, duration: 0.6 }}
            >
              <div className="flex flex-col items-center w-40">
                <motion.div className="w-20 h-20 border-2 border-black rounded-full flex items-center justify-center bg-white shadow">
                  {step.icon}
                </motion.div>
                <div className="mt-3 text-base text-gray-700 font-medium">
                  {step.label}
                  {step.bold && (
                    <span className="block text-gray-700 mt-1">
                      {step.bold}
                    </span>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <motion.div className="mx-3 mb-10 text-3xl text-gray-500">
                  <FaArrowRight />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
