import { useState, useEffect } from 'react';

import Navbar from './navbar';

const Header = () => {
  // Status slide saat ini
  const [currentSlide, setCurrentSlide] = useState(0);

  // Data slide carousel
  const slides = [
    {
      title: 'Perjalanan Umrah Bersama Al Habsa',
      backgroundImage: '/img/banner1.jpg',
      ctaText: 'Daftar Sekarang',
      ctaLink: '#Book'
    },
    // Tambahkan slide lainnya sesuai kebutuhan
    {
      title: 'Daftar Paket Umrah Ramadhan - Segera',
      backgroundImage: '/img/banner2.jpg',
      ctaText: 'Daftar Sekarang',
      ctaLink: '#Book'
    }
  ];

  // Otomatis berganti slide
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Ganti slide setiap 5 detik

    return () => clearInterval(slideInterval);
  }, []);

  // Tangani slide berikutnya
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Tangani slide sebelumnya
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <>
    <Navbar/>
    <div className="relative w-full h-screen overflow-hidden z-10" id='Home'>
      
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
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-gradient-to-b from-transparent to-black bg-opacity-40 flex items-center px-4 md:px-20 lg:px-32">
            <div className="text-white max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {slide.title}
              </h1>
              <a 
                href={slide.ctaLink}
                className="inline-block bg-[#222636] text-white px-6 py-3 rounded-md hover:bg-[#2E3650] transition-colors relative z-20 cursor-pointer"
                onClick={(e) => {
                  console.log("Tombol diklik", e.target);
                  //tambahan kode yang ingin dijalankan saat tombol diklik nantinya
                }}
              >
                {slide.ctaText}
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Tombol Navigasi */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-2 transition-colors z-30"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-white" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 19l-7-7 7-7" 
          />
        </svg>
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-2 transition-colors z-30"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-white" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </button>

      {/* Indikator Slide */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`
              w-3 h-1 rounded-full transition-colors
              ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'}
            `}
          />
        ))}
      </div>
    </div>
    </>
  );
};

export default Header;