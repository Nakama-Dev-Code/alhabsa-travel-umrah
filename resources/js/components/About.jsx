// import React from 'react';
import { CardContainer, CardItem } from "./ui/3d-card";

const About = () => {
  return (
    <div id='About' className="mt-8 max-w-5xl mx-10 lg:mx-auto flex flex-col lg:flex-row items-center justify-center lg:overflow-visible">
      {/* Kiri pada mode Desktop*/}
      <div className="lg:w-1/2 w-full mb-6 lg:mb-0 lg:mr-8">
      <CardContainer className='w-full'>
      <CardItem translateZ="100">
        <img
          src="/img/tentang-kami.jpg"
          alt="Kaabah at Masjidil Haram"
          className="w-full h-auto object-cover rounded-lg shadow-lg md:px-4 lg:px-0 px-0"
        />
        </CardItem>
      </CardContainer>
      </div>

      {/* Kana pada mode Desktop */}
      <div className="lg:w-1/2 w-full p-2 md:p-6 bg-white">
        <h3 className="text-2xl lg:text-3xl font-reguler mb-4 text-gray-800">
            Tentang Kami
        </h3>
        <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-800">
          Memberikan Pelayanan Umrah Yang Terbaik Untuk Para Jamaah
        </h2>
        
        <div className="text-gray-600 space-y-4">
          <p className="text-base">
          Berdiri sejak tahun 2019, PT. ALHABSA MABRURO TOUR memiliki pengalaman di bidang pelayanan jasa Tour & Travel, khususnya di pelayanan jasa UMRAH, oleh karena itu kualitas pelayanan dan kepercayaan jamaah menjadi prioritas utama kami dari awal berdiri sampai saat ini, dan akan terus meningkatkan kualitas pelayanan.
          </p>
        </div>
        
        <a 
          href="/img/company-profile.pdf" 
          download="Company Profile - Al Habsa.pdf"
        >
          <button className="mt-6 bg-[#222636] text-white py-2 px-4 rounded-md hover:bg-[#2E3650] transition-colors">
            Profile Al Habsa
          </button>
        </a>

      </div>
    </div>
  );
};

export default About;