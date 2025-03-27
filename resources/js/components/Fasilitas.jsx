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

    return (
      <div className="text-center p-10 ">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">FASILITAS JAMAAH</h2>
        <p className="text-gray-600 mb-8 text-lg">Fasilitas yang kami sediakan untuk kenyamanan ibadah Anda</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 xl:px-20">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="group relative bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#222636] from-blue-500 to-indigo-500 p-4 rounded-full shadow-md">
                <span className="text-white text-3xl">{facility.icon}</span>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{facility.title}</h3>
                <p className="text-gray-600 text-sm">{facility.description}</p>
              </div>

              {/* Animasi garis di bawah saat hover */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#222636] from-blue-500 to-indigo-500 scale-x-0 group-hover:scale-x-50 transition-transform duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default Fasilitas;
