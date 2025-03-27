import { FaAngleRight } from "react-icons/fa";
import { IoCallSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { AiFillTikTok } from "react-icons/ai";
import { FaSquareInstagram } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-[#222636] text-gray-300 py-12">
      <div className="container mx-auto px-6 lg:px-36">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Tentang Kami */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Tentang Kami</h3>
            <p className="text-sm leading-relaxed">
              Al Habsa Travel adalah perusahaan perjalanan profesional yang menghadirkan pengalaman umrah yang nyaman dan berkesan
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm">
                <IoCallSharp className="mr-2 text-yellow-500" />
                +62 813-2919-6100
              </div>
              <div className="flex items-center text-sm">
                <MdEmail className="mr-2 text-yellow-500" />
                alhabsa.travel@gmail.com
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-red-500 transition">
                <FaSquareInstagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition">
                <AiFillTikTok className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Informasi */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Informasi</h3>
            <ul className="text-sm space-y-2">
              {["Metode Pembayaran", "Kebijakan Privasi", "Syarat & Ketentuan"].map((item, index) => (
                <li key={index} className="flex items-center hover:text-yellow-400 transition">
                  <FaAngleRight className="mr-2 text-yellow-500" />
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Layanan</h3>
            <ul className="text-sm space-y-2">
              {["Layanan Paket Umrah", ].map((item, index) => (
                <li key={index} className="flex items-center hover:text-yellow-400 transition">
                  <FaAngleRight className="mr-2 text-yellow-500" />
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Jam Operasional & Alamat */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Jam Operasional</h3>
            <p className="text-sm leading-relaxed">
              Senin – Jumat, 08:00 – 17:00 <br />
              (By Appointment via WhatsApp)
            </p>
            <h3 className="text-xl font-semibold text-white mt-6 mb-4">Alamat</h3>
            <p className="text-sm leading-relaxed">
              Jl. Lettu Ismail No.20, Gawanan, <br />
              Kabupaten Sukoharjo, Jawa Tengah 57512
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-10 border-t border-gray-700 pt-6">
          <p className="text-sm">&copy; {new Date().getFullYear()} Al Habsa. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
