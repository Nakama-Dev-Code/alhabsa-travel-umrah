import { FaUtensils, FaPassport, FaSuitcaseRolling, FaUserAlt, FaHotel, FaBus, FaUsers, FaPlaneDeparture, FaCamera } from "react-icons/fa";
import { ReactNode } from "react";

// Tipe untuk setiap fasilitas
interface Facility {
  icon: ReactNode;
  title: string;
  description: string;
}

// Tipe props untuk komponen FacilityCard
interface FacilityCardProps {
  facility: Facility;
  index: number;
}

const Fasilitas = () => {
  const facilities: Facility[] = [
    { icon: <FaUtensils />, title: "Konsumsi", description: "Konsumsi yang terjamin dari memulai perjalanan sampai selesai" },
    { icon: <FaPassport />, title: "Visa Umrah", description: "Pengurusan visa umrah untuk keperluan ibadah di tanah suci" },
    { icon: <FaSuitcaseRolling />, title: "Perlengkapan Umrah", description: "Paket umrah dengan perlengkapan kebutuhan ibadah yang lengkap" },
    { icon: <FaUserAlt />, title: "TL/ Mutawwif", description: "Umrah ditemani dengan leader dan Muthawif yang tersertifikasi" },
    { icon: <FaHotel />, title: "Hotel Penginapan", description: "Akomodasi hotel / penginapan terbaik dan termyaman" },
    { icon: <FaBus />, title: "Transportasi", description: "Transportasi untuk memudahkan perjalanan jamaah" },
    { icon: <FaUsers />, title: "Tim Professional Saudi", description: "Tim professional dari Saudi untuk melancarkan kegiatan para jamaah" },
    { icon: <FaPlaneDeparture />, title: "Tiket Pesawat", description: "Tiket pesawat PP untuk keperluan berangkat ke tanah suci" },
    { icon: <FaCamera />, title: "Dokumentasi", description: "Dokumentasi untuk jamaah selama ibadah di tanah suci" },
  ];

  // const facilitiesGroupOne = facilities.slice(0, 2);
  // const facilitiesGroupTwo = facilities.slice(2, 4);
  // const facilitiesGroupThree = facilities.slice(4, 6);
  // const facilitiesGroupFour = facilities.slice(6, 8);
  // const facilitiesGroupFive = facilities.slice(8);

  const FacilityCard: React.FC<FacilityCardProps> = ({ facility }) => (
    <div
      className="group relative bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 mt-2"
      data-aos="fade-up"
    >
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#222636] p-4 rounded-full shadow-md">
        <span className="text-white text-4xl sm:text-3xl">{facility.icon}</span>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl sm:text-xl font-bold text-gray-800 mb-2">{facility.title}</h3>
        <p className="text-lg sm:text-base text-gray-600">{facility.description}</p>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#222636] from-blue-500 to-indigo-500 scale-x-0 group-hover:scale-x-50 transition-transform duration-300"></div>
    </div>
  );

  return (
    <div className="text-center p-4 sm:p-6 md:p-10 bg-[#f8f9fa]" id="Fasilitas">
      <div className="flex items-center justify-center mb-2">
       <div className="flex-grow h-px bg-[#222636] mx-4 md:mx-6"></div>
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-[#222636] whitespace-nowrap">
            FASILITAS JAMAAH
          </h2>
       <div className="flex-grow h-px bg-[#222636] mx-4 md:mx-6"></div>
      </div>

      <p className="text-[#222636] mb-6 sm:mb-8 text-lg md:text-xl">
        Fasilitas yang kami sediakan untuk kenyamanan ibadah Anda
      </p>

      {/* Tampilan Desktop */}
      <div className="hidden md:grid grid-cols-3 gap-8 px-4 lg:px-6 xl:px-20">
        {facilities.map((facility, index) => (
          <FacilityCard facility={facility} index={index} key={index} />
        ))}
      </div>

      <div className="md:hidden space-y-8">
        {facilities.map((facility, index) => (
          <FacilityCard facility={facility} index={index} key={index} />
        ))}
      </div>

      {/* Tampilan Mobile */}
      {/* <div className="md:hidden space-y-8">
        {[facilitiesGroupOne, facilitiesGroupTwo, facilitiesGroupThree, facilitiesGroupFour].map(
          (group, groupIndex) => (
            <div className="grid grid-cols-2 gap-4 sm:gap-6" key={groupIndex}>
              {group.map((facility, index) => (
                <FacilityCard facility={facility} index={index + groupIndex * 2} key={index + groupIndex * 2} />
              ))}
            </div>
          )
        )}

        <div className="mx-auto max-w-xs">
          {facilitiesGroupFive.map((facility, index) => (
            <FacilityCard facility={facility} index={index + 8} key={index + 8} />
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Fasilitas;