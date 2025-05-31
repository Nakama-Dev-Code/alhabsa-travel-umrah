import { motion } from "framer-motion";

const stepsTop = [
  {
    icon: (
      <div className="relative text-2xl md:text-4xl">
        <i className="fas fa-globe"></i>
        <i className="fas fa-heart absolute -top-1 -right-2 text-xs md:text-sm"></i>
      </div>
    ),
    step: "01",
    label: "BUKA WEBSITE AL HABSA",
  },
  {
    icon: <i className="fas fa-home text-2xl md:text-4xl"></i>,
    step: "02",
    label: "JELAJAHI HALAMAN UTAMA",
  },
  {
    icon: <i className="fas fa-list text-2xl md:text-4xl"></i>,
    step: "03",
    label: "MASUK KE DAFTAR PAKET UMRAH",
  },
  {
    icon: <i className="fas fa-clipboard-list text-2xl md:text-4xl"></i>,
    step: "04",
    label: "LIHAT OPSI PAKET YANG TERSEDIA",
  },
  {
    icon: (
      <div className="relative text-2xl md:text-4xl">
        <i className="fas fa-balance-scale"></i>
        <i className="fas fa-heart absolute -top-1 -right-2 text-xs md:text-sm"></i>
      </div>
    ),
    step: "05",
    label: "BANDINGKAN FASILITAS DAN JADWAL",
  },
];

const stepsBottom = [
  {
    icon: (
      <div className="relative text-2xl md:text-4xl">
        <i className="fas fa-star"></i>
        <i className="fas fa-heart absolute -top-1 -right-2 text-xs md:text-sm"></i>
      </div>
    ),
    step: "06",
    label: "PILIH PAKET YANG SESUAI",
  },
  {
    icon: (
      <div className="relative text-2xl md:text-4xl">
        <i className="fas fa-paper-plane"></i>
        <i className="absolute -top-1 -right-2 text-xs md:text-sm"></i>
      </div>
    ),
    step: "07",
    label: "KLIK TOMBOL PESAN",
  },
  {
    icon: <i className="fab fa-whatsapp text-2xl md:text-4xl"></i>,
    step: "08",
    label: "PESAN OTOMATIS KE WHATSAPP",
  },
  {
    icon: <i className="fas fa-circle-info text-2xl md:text-4xl"></i>,
    step: "09",
    label: "TERIMA BALASAN DAN\nINFO LENGKAP",
  },
  {
    icon: (
      <div className="relative text-2xl md:text-4xl">
        <i className="fas fa-check-circle"></i>
        <i className="fas fa-heart absolute -top-1 -right-2 text-xs md:text-sm"></i>
      </div>
    ),
    step: "10",
    label: "LANJUTKAN PEMESANAN",
  },
];

const ProcessSteps = () => {
  // Gabungkan semua steps untuk mobile (vertikal) dengan urutan yang benar
  const allSteps = [...stepsTop, ...stepsBottom];

  return (
    <div className="bg-gradient-to-b from-[#222636] via-[#22292f] to-[#222636] flex justify-center items-center min-h-screen p-4 font-[MedievalSharp] relative overflow-hidden">
      <div className="max-w-[1200px] w-full relative">
        
        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* Connecting Lines dengan animasi mengular */}
          {/* Line horizontal atas (kiri ke kanan) */}
          <motion.div
            className="absolute top-[12px] left-[120px] right-[115px] h-[1.5px] bg-white z-10"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            style={{ transformOrigin: "left" }}
          />
          
          {/* Curve melengkung dari atas ke bawah */}
          <motion.svg
            className="absolute pointer-events-none z-10"
            style={{
              top: '12px',
              right: '-55px',
              width: '172px',
              height: '343px',
            }}
            viewBox="0 0 172 340"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M0,1c94.5,0,170.9,72.3,170.9,162.8c0,90.5-76.3,163.8-170.9,163.8"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 2.5 }}
            />
          </motion.svg>
          
          {/* Line horizontal bawah (kanan ke kiri) */}
          <motion.div
            className="absolute left-[120px] right-[115px] h-[1.5px] bg-white z-10"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 2, delay: 4.5 }}
            style={{ transformOrigin: "right", top: "calc(100% - 240px)" }}
          />

          {/* Top Row - Desktop */}
          <div className="flex justify-between items-start px-8 relative z-30">
            {stepsTop.map((item, idx) => (
              <motion.div
                className="flex flex-col items-center relative"
                key={idx}
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: idx * 0.5, 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.div 
                  className="dot w-5 h-5 bg-white border border-white rounded-full z-20 shrink-0 shadow-[0_0_12px_4px_rgba(191,163,111,0.5)]"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: idx * 0.5 + 0.3, duration: 0.3 }}
                  whileHover={{ scale: 1.2 }}
                />
                
                <motion.div 
                  className="mt-8 w-[180px] border border-white rounded-md py-8 flex flex-col items-center gap-4 text-white text-center cursor-pointer"
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 10px 30px rgba(191, 163, 111, 0.3)",
                    borderColor: "#fff"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {item.icon}
                  </motion.div>
                  <div className="text-3xl font-semibold">{item.step}</div>
                  <div className="text-xs leading-tight tracking-wide whitespace-pre-line">
                    {item.label}
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute -top-8 w-full h-1 bg-gradient-to-r from-white to-transparent rounded"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: idx * 0.5 + 0.8, duration: 0.5 }}
                  style={{ transformOrigin: "left" }}
                />
              </motion.div>
            ))}
          </div>

          {/* Bottom Row - Desktop */}
          <div className="flex justify-between items-start px-8 mt-18 relative z-30">
            {[...stepsBottom].reverse().map((item, idx) => (
              <motion.div
                className="flex flex-col items-center relative"
                key={idx}
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: 4.2 + (stepsBottom.length - 1 - idx) * 0.2,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.div 
                  className="dot w-5 h-5 bg-white border border-white rounded-full z-20 shrink-0 shadow-[0_0_12px_6px_rgba(191,163,111,0.4)]"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 4.2 + (stepsBottom.length - 1 - idx) * 0.2 }}
                  whileHover={{ scale: 1.2 }}
                />
                
                <motion.div 
                  className="mt-8 w-[180px] border border-white rounded-md py-8 flex flex-col items-center gap-4 text-white text-center cursor-pointer"
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 10px 30px rgba(191, 163, 111, 0.3)",
                    borderColor: "#fff"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {item.icon}
                  </motion.div>
                  <div className="text-3xl font-semibold">{item.step}</div>
                  <div className="text-xs leading-tight tracking-wide whitespace-pre-line">
                    {item.label}
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute -top-8 w-full h-1 bg-gradient-to-l from-white to-transparent rounded"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 5 + idx * 0.5 + 0.8, duration: 0.5 }}
                  style={{ transformOrigin: "right" }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden">
          {/* Vertical connecting line untuk mobile */}
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[1.5px] bg-white z-10"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 3, delay: 0.5 }}
            style={{ transformOrigin: "top" }}
          />

          {/* Mobile Steps - Vertikal */}
          <div className="flex flex-col items-center space-y-8 px-4 py-8 relative z-30">
            {allSteps.map((item, idx) => (
              <motion.div
                className="flex items-center w-full relative"
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: idx * 0.2, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true, amount: 0.3 }}
              >
                {/* Layout kiri-kanan bergantian */}
                <div className={`flex items-center w-full ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Card */}
                  <motion.div 
                    className="w-[140px] border border-white rounded-md py-4 px-3 flex flex-col items-center gap-2 text-white text-center cursor-pointer"
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 8px 25px rgba(191, 163, 111, 0.3)",
                      borderColor: "#fff"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {item.icon}
                    </motion.div>
                    <div className="text-xl font-semibold">{item.step}</div>
                    <div className="text-[10px] leading-tight tracking-wide whitespace-pre-line">
                      {item.label}
                    </div>
                  </motion.div>
                  
                  {/* Spacer untuk dot di tengah */}
                  <div className="flex-1 flex justify-center">
                    <motion.div 
                      className="dot w-4 h-4 bg-white border-2 border-white rounded-full z-20 shadow-[0_0_10px_3px_rgba(191,163,111,0.5)]"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: idx * 0.2 + 0.3, duration: 0.3 }}
                      whileHover={{ scale: 1.3 }}
                    />
                  </div>
                  
                  {/* Spacer untuk balance layout */}
                  <div className="w-[140px]"></div>
                </div>
                
                {/* Progress indicator samping */}
                <motion.div
                  className={`absolute top-1/2 w-16 h-0.5 rounded ${
                    idx % 2 === 0 
                      ? 'left-[140px] bg-gradient-to-r from-white to-transparent' 
                      : 'right-[140px] bg-gradient-to-l from-white to-transparent'
                  }`}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: idx * 0.2 + 0.6, duration: 0.4 }}
                  style={{ transformOrigin: idx % 2 === 0 ? "left" : "right" }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating particles untuk efek tambahan */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProcessSteps;