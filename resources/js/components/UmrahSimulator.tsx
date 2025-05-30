import { FC } from "react";
import { Link } from "@inertiajs/react";

const UmrahSimulator: FC = () => {
  return (
    <div className="relative w-full bg-white overflow-hidden px-6 py-10 md:py-12">
      {/* Background motif */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://bb71d2eac085c69b0.nos.wjv-1.neo.id/1638869882-890430/16595174792478-f0HbmGb2SfRoTZUyFj3nWWtubIPWgv9FsgjcVcXI.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: 0.08,
        }}
      />

      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 z-10">
        {/* Gambar Ka'bah */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src="https://www.freeiconspng.com/uploads/al-haram-kaaba-picture-9.png"
            alt="Ka'bah Illustration"
            className="w-full max-w-xs md:max-w-md object-contain drop-shadow-lg"
          />
        </div>

        {/* Teks & Tombol */}
        <div className="md:w-1/2 text-gray-800 text-center md:text-left">
          <p className="text-xl md:text-2xl font-semibold text-[#222636]">
            Bingung menghitung biaya umrah?
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold leading-snug my-3">
            Simulasikan perjalanan suci Anda sejak sekarang
          </h2>

          <Link href="/umrah-savings-simulator">
            <button className="bg-[#222636] text-white font-semibold px-6 py-3 rounded-md shadow-lg hover:bg-[#2E3650] transition mt-4">
              KLIK DISINI
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UmrahSimulator;
