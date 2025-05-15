import { FaUtensils, FaPassport, FaSuitcaseRolling, FaUserAlt, FaHotel, FaBus, FaUsers, FaPlaneDeparture, FaCamera } from "react-icons/fa";

const Fasilitas = () => {
  const facilities = [
    { icon: <FaUtensils />, title: "Konsumsi", description: "Konsumsi yang terjamin dari memulai perjalanan sampai selesai" },
    { icon: <FaPassport />, title: "Visa Umrah", description: "Pengurusan visa umrah untuk keperluan ibadah di tanah suci" },
    { icon: <FaSuitcaseRolling />, title: "Perlengkapan Umrah", description: "Paket umrah dengan perlengkapan kebutuhan ibadah yang lengkap" },
    { icon: <FaUserAlt />, title: "TL/ Mutawwif", description: "Umrah ditemani dengan leader dan Muthawif yang tersertifikasi" },
    { icon: <FaHotel />, title: "Hotel Penginapan", description: "Akomodasi hotel / penginapan terbaik dan termyaman" },
    { icon: <FaBus />, title: "Transportasi", description: "Transportasi untuk memudahkan perjalanan jamaah" },
    { icon: <FaUsers />, title: "Tim Professional Saudi", description: "Tim professional dari Saudi untuk melancarkan kegiatan para jamaah" },
    { icon: <FaPlaneDeparture />, title: "Tiket Pesawat", description: "Tiket pesawat PP untuk keperluan berangkat ke tanah suci" },
    { icon: <FaCamera />, title: "Dokumentasi", description: "Dokumentasi untuk jamaah selama ibadah di tanah suci" }
  ];

  // Grup fasilitas untuk tampilan mobile
  const facilitiesGroupOne = facilities.slice(0, 2); // 2 fasilitas pertama
  const facilitiesGroupTwo = facilities.slice(2, 4); // 2 fasilitas berikutnya
  const facilitiesGroupThree = facilities.slice(4, 6); // 2 fasilitas berikutnya
  const facilitiesGroupFour = facilities.slice(6, 8); // 2 fasilitas berikutnya
  const facilitiesGroupFive = facilities.slice(8); // 1 fasilitas terakhir

  // Komponen kartu fasilitas
  const FacilityCard = ({ facility, index }) => (
    <div
      key={index}
      className="group relative bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
    >
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#222636] p-3 sm:p-4 rounded-full shadow-md">
        <span className="text-white text-2xl sm:text-3xl">{facility.icon}</span>
      </div>

      <div className="mt-8 sm:mt-10">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">{facility.title}</h3>
        <p className="text-gray-600 text-xs sm:text-sm">{facility.description}</p>
      </div>

      {/* Animasi garis di bawah saat hover */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#222636] from-blue-500 to-indigo-500 scale-x-0 group-hover:scale-x-50 transition-transform duration-300"></div>
    </div>
  );

  return (
    <div className="text-center p-4 sm:p-6 md:p-10 bg-[#f8f9fa]" id="Fasilitas">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
        FASILITAS JAMAAH 
        <span className="block h-1 w-24 bg-[#222636] mx-auto mt-2"></span>
      </h2>
      <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">
        Fasilitas yang kami sediakan untuk kenyamanan ibadah Anda
      </p>

      {/* Tampilan Desktop: 3 kolom */}
      <div className="hidden md:grid grid-cols-3 gap-8 px-4 lg:px-6 xl:px-20">
        {facilities.map((facility, index) => (
          <FacilityCard facility={facility} index={index} key={index} />
        ))}
      </div>

      {/* Tampilan Mobile: Format 2-2-2-2-1 */}
      <div className="md:hidden space-y-8">
        {/* Grup 1: 2 kolom */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {facilitiesGroupOne.map((facility, index) => (
            <FacilityCard facility={facility} index={index} key={index} />
          ))}
        </div>

        {/* Grup 2: 2 kolom */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {facilitiesGroupTwo.map((facility, index) => (
            <FacilityCard facility={facility} index={index + 2} key={index + 2} />
          ))}
        </div>

        {/* Grup 3: 2 kolom */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {facilitiesGroupThree.map((facility, index) => (
            <FacilityCard facility={facility} index={index + 4} key={index + 4} />
          ))}
        </div>

        {/* Grup 4: 2 kolom */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {facilitiesGroupFour.map((facility, index) => (
            <FacilityCard facility={facility} index={index + 6} key={index + 6} />
          ))}
        </div>

        {/* Grup 5: 1 kolom (tengah) */}
        <div className="mx-auto max-w-xs">
          {facilitiesGroupFive.map((facility, index) => (
            <FacilityCard facility={facility} index={index + 8} key={index + 8} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Fasilitas;