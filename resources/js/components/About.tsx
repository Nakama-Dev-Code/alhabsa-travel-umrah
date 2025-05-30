import { FC } from "react";
import { motion } from "framer-motion";

const About: FC = () => {
  return (
    <div id="About" className="py-12 md:py-16 lg:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 lg:gap-12">
        <div className="relative w-full lg:w-1/2">
          {/* Background dekoratif - Hide on mobile for cleaner look */}
          <div className="hidden sm:block absolute top-1/2 -left-[60%] transform -translate-y-1/2 w-[140%] h-[140%] sm:w-[140%] sm:h-[140%] lg:w-[160%] lg:h-[160%] z-0">
            <img
              src="/img/brand-circles.png"
              alt="Dekorasi"
              className="w-full h-full object-contain filter brightness-0 saturate-100 sepia hue-rotate-[220deg] transform translate-x-6 sm:translate-x-0"
            />
          </div>

          {/* Gambar utama */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div className="overflow-hidden rounded-lg md:rounded-xl shadow-md md:shadow-lg border border-gray-100 transform transition-transform hover:shadow-xl duration-300">
              <img
                src="/img/tentang-kami.jpg"
                alt="Kaabah at Masjidil Haram"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Bagian Kanan - Text Content */}
        <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white p-4 sm:p-6 md:p-8 rounded-lg md:rounded-xl shadow-md md:shadow-lg border border-gray-100"
          >
            <div className="inline-block px-3 py-1 mb-3 text-xs sm:text-sm font-medium text-white bg-[#222636] rounded-full">
              Tentang Kami
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-800 leading-tight">
              Memberikan Pelayanan Umrah Yang <span className="text-[#7fc9ff]">Terbaik</span> Untuk Para Jamaah
            </h2>

            <div className="mt-4 sm:mt-6 text-gray-600 space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                Berdiri sejak tahun 2019, <span className="font-semibold">PT. ALHABSA MABRURO TOUR</span> memiliki pengalaman di bidang pelayanan jasa Tour & Travel, khususnya di pelayanan jasa UMRAH. Kualitas pelayanan dan kepercayaan jamaah menjadi prioritas utama kami dari awal berdiri sampai saat ini, dan akan terus meningkatkan kualitas pelayanan.
              </p>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="/img/company-profile.pdf"
                download="Company Profile - Al Habsa.pdf"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-[#222636] text-white font-medium hover:bg-[#2E3650] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-sm sm:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden xs:inline">Unduh Profile Al Habsa</span>
                <span className="xs:hidden">Unduh Profile</span>
              </a>
              <a
                href="#Contact"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-white text-[#222636] border border-[#222636] font-medium hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-sm sm:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Hubungi Kami
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tambahan Fakta Singkat */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
        className="mt-8 sm:mt-10 md:mt-12 relative"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 z-10 relative">
          {/* Kartu fakta singkat */}
          <div className="p-3 sm:p-4 md:p-6 bg-white rounded-lg md:rounded-xl shadow-md border border-gray-100 text-center">
            <div className="text-[#222636] font-bold text-2xl sm:text-3xl md:text-4xl">2019</div>
            <div className="mt-1 sm:mt-2 text-gray-600 text-xs sm:text-sm md:text-base">Tahun Berdiri</div>
          </div>
          <div className="p-3 sm:p-4 md:p-6 bg-white rounded-lg md:rounded-xl shadow-md border border-gray-100 text-center">
            <div className="text-[#222636] font-bold text-2xl sm:text-3xl md:text-4xl">1000+</div>
            <div className="mt-1 sm:mt-2 text-gray-600 text-xs sm:text-sm md:text-base">Jamaah Terlayani</div>
          </div>
          <div className="p-3 sm:p-4 md:p-6 bg-white rounded-lg md:rounded-xl shadow-md border border-gray-100 text-center">
            <div className="text-[#222636] font-bold text-2xl sm:text-3xl md:text-4xl">50+</div>
            <div className="mt-1 sm:mt-2 text-gray-600 text-xs sm:text-sm md:text-base">Mitra Kerjasama</div>
          </div>
          <div className="p-3 sm:p-4 md:p-6 bg-white rounded-lg md:rounded-xl shadow-md border border-gray-100 text-center">
            <div className="text-[#222636] font-bold text-2xl sm:text-3xl md:text-4xl">100%</div>
            <div className="mt-1 sm:mt-2 text-gray-600 text-xs sm:text-sm md:text-base">Kepuasan Jamaah</div>
          </div>
        </div>

        {/* Dekorasi kanan bawah - Hidden on mobile, adjusted for tablets */}
        <div className="hidden md:block absolute -bottom-20 -right-40 w-62 h-62
                md:-bottom-30 md:-right-50 md:w-82 md:h-82
                lg:-bottom-40 lg:-right-50 lg:w-82 lg:h-82">
          <img
            src="/img/brand-circles.png"
            alt="Dekorasi Fakta"
            className="w-full h-full object-contain filter brightness-0 saturate-100 sepia hue-rotate-[220deg]"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default About;