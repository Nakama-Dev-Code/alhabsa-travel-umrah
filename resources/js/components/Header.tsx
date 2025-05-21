import React, { useState, useEffect } from 'react';
import Navbar from './navbar';

interface Slide {
  title: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

const Header: React.FC = () => {
  // Status slide saat ini
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Data slide carousel
  const slides: Slide[] = [
    {
      title: 'Perjalanan Umrah Bersama Al Habsa',
      backgroundImage: '/img/banner1.jpg',
      ctaText: 'Daftar Sekarang',
      ctaLink: '#Book',
    },
    {
      title: 'Daftar Paket Umrah Ramadhan - Segera',
      backgroundImage: '/img/banner2.jpg',
      ctaText: 'Daftar Sekarang',
      ctaLink: '#Book',
    },
  ];

  // Otomatis berganti slide
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Ganti slide setiap 5 detik

    return () => clearInterval(slideInterval);
  }, [slides.length]);

  return (
    <>
      <Navbar />
      <div className="relative w-full h-screen overflow-hidden z-10" id="Home">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`
              absolute inset-0 transition-opacity duration-1000 ease-in-out
              ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}
            `}
            style={{
              backgroundImage: `url(${slide.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black bg-opacity-40 flex items-center px-4 lg:px-32">
              <div className="max-w-5xl text-white lg:mx-auto mx-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  {slide.title}
                </h1>
                <a
                  href={slide.ctaLink}
                  className="inline-block bg-[#222636] text-white px-6 py-3 rounded-md hover:bg-[#2E3650] transition-colors relative z-20 cursor-pointer"
                  onClick={(e) => {
                    console.log('Tombol diklik', e.currentTarget);
                    // tambahan kode yang ingin dijalankan saat tombol diklik nantinya
                  }}
                >
                  {slide.ctaText}
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Indikator Slide */}
        <div className="absolute bottom-56 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`
                w-3 h-1 rounded-full transition-colors
                ${index === currentSlide ? 'bg-[#2a3d66]' : 'bg-white bg-opacity-50'}
              `}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;
