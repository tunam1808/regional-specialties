import { Card, CardContent } from "@/components/card";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaShoppingBag, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Button } from "@/components/button";

export default function AboutStore() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section className="w-full py-12 px-6 md:px-16 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-5xl mx-auto text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center text-4xl mb-6 mt-2 font-bold"
          style={{ fontFamily: "'Baloo 2', cursive" }}
        >
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div>VỀ CHÚNG TÔI</div>
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
          </div>
        </motion.div>

        <motion.p
          className="mt-4 text-lg text-gray-600"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="mt-4 text-lg text-gray-600">
            Chúng tôi chuyên buôn bán và quảng bá{" "}
            <span className="font-semibold text-orange-600">
              đặc sản vùng miền
            </span>
            , là một thương hiệu mới xuất hiện trên thị trường nhưng được xây
            dựng như một không gian hội tụ những tinh hoa đặc sản từ khắp mọi
            miền đất nước. Tại đây, khách hàng có thể dễ dàng tìm thấy những
            hương vị quen thuộc gợi nhớ quê hương, hay khám phá những món ngon
            độc đáo mà trước đây chưa từng trải nghiệm. Không chỉ là nơi mua
            sắm, cửa hàng còn là điểm đến để kết nối văn hoá ẩm thực, nơi mỗi
            sản phẩm đều kể một câu chuyện về vùng đất, con người và truyền
            thống đã tạo nên nó. Với không gian thân thiện và dịch vụ tận tâm,
            chúng tôi mong muốn biến mỗi lần ghé thăm thành một hành trình trải
            nghiệm đầy ý nghĩa.
          </p>
        </motion.p>
      </div>

      {/* 2 card */}
      <div className="mt-10 grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Card 1 - trượt từ trái sang */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <Card className="rounded-2xl shadow-lg border-none bg-white">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <FaShoppingBag className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">
                Cửa hàng đặc sản
              </h3>
              <p className="mt-3 text-gray-600 text-justify">
                Với hệ thống cửa hàng trải đều 3 miền Bắc - Trung - Nam, mỗi sản
                phẩm đều được tuyển chọn kỹ lưỡng từ nhiều địa phương trên khắp
                cả nước, từ đồng bằng, miền núi cho đến hải đảo. Với hàng trăm
                mặt hàng đặc sản phong phú, chúng tôi luôn đặt chất lượng lên
                hàng đầu, đảm bảo giữ trọn vẹn hương vị tự nhiên cũng như giá
                trị dinh dưỡng vốn có. Không chỉ dừng lại ở việc mang đến những
                món ăn đặc trưng, chúng tôi còn chú trọng đến trải nghiệm mua
                sắm của khách hàng, từ không gian trưng bày đến dịch vụ chăm sóc
                tận tình. Chúng tôi tin rằng, mỗi sản phẩm khi đến tay người
                tiêu dùng sẽ không chỉ là một món quà quê, mà còn là cầu nối gắn
                kết văn hoá và tình cảm từ khắp các vùng miền Việt Nam.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 2 - trượt từ phải sang */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <Card className="rounded-2xl shadow-lg border-none bg-white">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <FaMapMarkerAlt className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">
                Sứ mệnh của chúng tôi
              </h3>
              <p className="mt-3 text-gray-600 text-justify">
                Sứ mệnh của chúng tôi là không ngừng nỗ lực góp phần quảng bá
                rộng rãi văn hoá ẩm thực Việt Nam đến với mọi người, từ trong
                nước cho đến bạn bè quốc tế. Chúng tôi mong muốn nâng cao giá
                trị nông sản và đặc sản vùng miền thông qua việc xây dựng thương
                hiệu uy tín, đảm bảo chất lượng và gìn giữ hương vị truyền
                thống. Bên cạnh đó, cửa hàng còn hướng đến việc tạo ra cầu nối
                bền chặt giữa người sản xuất địa phương và người tiêu dùng, để
                mỗi sản phẩm không chỉ là món ăn, mà còn là câu chuyện về quê
                hương, con người và bản sắc văn hoá dân tộc. Chúng tôi tin rằng,
                khi đặc sản vùng miền được trân trọng và lan tỏa, thì giá trị
                văn hoá Việt Nam cũng sẽ ngày càng được khẳng định và gìn giữ
                cho các thế hệ mai sau.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Nút CTA */}
      <div className="flex justify-center ">
        <Link to="/products">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.08 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              type: "spring",
              stiffness: 300,
              damping: 10,
            }}
            viewport={{ once: true }}
            className="inline-block mt-10"
          >
            <Button className="rounded-2xl px-6 py-2 text-lg bg-orange-600 hover:bg-orange-700 text-white">
              Khám phá ngay
            </Button>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}
