import { FC } from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

interface Airline {
  src: string;
  alt: string;
}

const Mitra: FC = () => {
  const airlines: Airline[] = [
    { src: "/img/mitra/etihad.svg", alt: "Etihad Air" },
    { src: "/img/mitra/emirates-airlanes.svg", alt: "Emirates" },
    { src: "/img/mitra/garuda-indonesia.svg", alt: "Garuda Indonesia" },
    { src: "/img/mitra/oman-air.svg", alt: "Oman Air" },
    { src: "/img/mitra/qatar.svg", alt: "Qatar Airways" },
    { src: "/img/mitra/saudi.svg", alt: "Saudi Arabian Airlines" },
    { src: "/img/mitra/turkish.png", alt: "Turkish Airlines" },
    { src: "/img/mitra/ampuh.png", alt: "Afiliasi Mandiri Penyelenggara Umrah & Haji" },
  ];

  return (
    <div className="w-full py-16 bg-cover bg-center" style={{ backgroundImage: "url('/img/pattern.png')" }}>
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
          SUPPORT BY
          <span className="block h-1 w-24 bg-[#222636] mx-auto mt-2"></span>
        </h2>
        <p className="text-[#222636] text-sm md:text-base max-w-xl mx-auto">
          Kami didukung oleh berbagai mitra profesional demi kenyamanan ibadah Anda
        </p>
      </div>

      <div className="py-6 bg-white/20 border-gray-100 shadow-lg">
        <InfiniteMovingCards
          items={airlines}
          direction="right"
          speed="normal"
          imageClassName="w-50 md:w-48 h-16 md:h-20 object-contain mx-3 md:mx-6 grayscale hover:grayscale-0 transition duration-300 ease-in-out"
        />
      </div>
    </div>
  );
};

export default Mitra;
