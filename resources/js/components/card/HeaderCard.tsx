import { FaInstagram, FaTiktok } from 'react-icons/fa';
import React from 'react';

const HeaderCard: React.FC = () => {
  return (
    <div className="relative w-full h-[430px] overflow-hidden">
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out z-10"
        style={{
          backgroundImage: `url('/img/banner2.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay dan Konten Utama */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 bg-opacity-50 flex items-center px-4 md:px-20 lg:px-32">
          <div className="text-white">
            <h1 className="text-5xl font-bold">Transaksi Paket Umrah</h1>
          </div>
        </div>

        {/* Social Media - Kanan Bawah */}
        <div className="absolute bottom-4 right-4 flex flex-col items-start gap-2 pb-4 px-4 md:px-20 lg:px-32">
          <p className="text-white font-semibold text-[20px]">Sosial Media</p>
          <div className="flex gap-3">
            <a href="https://www.instagram.com/alhabsa.travel/" target='_blank' className="text-white hover:text-pink-500 transition-colors">
              <FaInstagram size={24} />
            </a>
            <a href="https://www.tiktok.com/@alhabsatravel?_t=ZS-8wXNpd9Onjk&_r=1" target='_blank' className="text-white hover:text-pink-500 transition-colors">
              <FaTiktok size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderCard;
