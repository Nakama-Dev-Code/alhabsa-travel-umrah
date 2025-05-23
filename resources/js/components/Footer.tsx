import React from "react";
import { FaAngleRight } from "react-icons/fa";
import { IoCallSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { AiFillTikTok } from "react-icons/ai";
import { FaSquareInstagram } from "react-icons/fa6";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1d2233] text-gray-300 py-14 text-sm">
      <div className="container mx-auto px-6 lg:px-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Tentang Kami */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Tentang Kami</h3>
            <p className="leading-relaxed mb-4">
              Al Habsa Travel adalah perusahaan perjalanan profesional yang menghadirkan pengalaman umrah yang nyaman dan berkesan.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <IoCallSharp className="mr-2 text-yellow-500" />
                <span>+62 813-2919-6100</span>
              </div>
              <a
                href="mailto:alhabsa.travel@gmail.com"
                className="flex items-center hover:underline"
              >
                <MdEmail className="mr-2 text-yellow-500" />
                alhabsa.travel@gmail.com
              </a>
            </div>
            <div className="flex gap-4 mt-4">
              <a
                href="https://www.instagram.com/alhabsa.travel/" 
                target='_blank'
                className="text-gray-400 hover:text-pink-500 transition"
                aria-label="Instagram"
              >
                <FaSquareInstagram className="w-6 h-6" />
              </a>
              <a
                href="https://www.tiktok.com/@alhabsatravel?_t=ZS-8wXNpd9Onjk&_r=1"
                target='_blank'
                className="text-gray-400 hover:text-white transition"
                aria-label="TikTok"
              >
                <AiFillTikTok className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Informasi */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Informasi</h3>
            <ul className="space-y-3">
              {["Metode Pembayaran", "Kebijakan Privasi", "Syarat & Ketentuan"].map(
                (item, index) => (
                  <li
                    key={index}
                    className="flex items-center group transition-all"
                  >
                    <FaAngleRight className="mr-2 text-yellow-500" />
                    <a href="#" className="group-hover:text-white hover:underline">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Layanan</h3>
            <ul className="space-y-3">
              {["Layanan Paket Umrah"].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center group transition-all"
                >
                  <FaAngleRight className="mr-2 text-yellow-500" />
                  <a
                    href="/umrah-packages"
                    className="group-hover:text-white hover:underline"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Jam Operasional & Alamat */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Jam Operasional</h3>
            <p className="leading-relaxed">
              Senin – Jumat
              <br />
              08:00 – 17:00
              <br />
              (By Appointment via WhatsApp)
            </p>
            <h3 className="text-xl font-semibold text-white mt-6 mb-4">Alamat</h3>
            <p className="leading-relaxed">
              Jl. Lettu Ismail No.20, Gawanan,
              <br />
              Kabupaten Sukoharjo, Jawa Tengah 57512
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-12 border-t border-gray-700 pt-6 text-gray-400 text-sm">
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-white">Al Habsa Travel</span>. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
