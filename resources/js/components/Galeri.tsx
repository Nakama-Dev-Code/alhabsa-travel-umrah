import { useState, useRef } from 'react';
import { Link } from '@inertiajs/react';

const Galeri = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  const galleryImages = [
    { src: "/img/foto4.jpg", alt: "Rombongan Jamaah Umrah" },
    { src: "/img/foto2.jpg", alt: "Pelaksanaan Ibadah di Masjidil Haram" },
    { src: "/img/foto3.jpg", alt: "Jamaah Umrah Al Habsa" },
    { src: "/img/foto1.jpg", alt: "Hudaibiyyah" },
    { src: "/img/foto5.jpg", alt: "City Tour - Turkey" }
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (hovered === index) {
      const image = imageRefs.current[index];
      if (!image) return;

      const rect = image.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      const x = (offsetX / rect.width) * 100;
      const y = (offsetY / rect.height) * 100;

      image.style.transformOrigin = `${x}% ${y}%`;
    }
  };

  const handleMouseEnter = (index: number) => setHovered(index);
  const handleMouseLeave = () => setHovered(null);

  const openModal = (image: { src: string; alt: string }, e: React.MouseEvent) => {
    // Hanya membuka modal di tampilan mobile (deteksi dengan window.innerWidth)
    if (window.innerWidth < 768) {
      setSelectedImage(image);
      document.body.style.overflow = 'hidden'; // Mencegah scrolling saat modal terbuka
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Mengembalikan scrolling
  };

  return (
    <div className="container mx-auto px-4 py-8" id="Galeri">
      <div className="text-center mb-10">
        <h3 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
          GALERI PERJALANAN UMRAH
          <span className="block h-1 w-24 bg-[#222636] mx-auto mt-2"></span>
        </h3>
        <p className="text-[#222636] text-sm md:text-base max-w-xl mx-auto">
          Dokumentasi momen selama perjalanan ibadah Umrah bersama para jamaah Al Habsa
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-5xl mx-auto">
        {/* Row 1: 2 gambar untuk mobile, 3 gambar untuk desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* 2 gambar pertama untuk mobile */}
          {galleryImages.slice(0, 2).map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-md group"
              onClick={(e) => openModal(image, e)}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <img
                ref={(el) => {
                  if (el) imageRefs.current[index] = el;
                }}
                src={image.src}
                alt={image.alt}
                className={`w-full h-32 md:h-64 object-cover rounded-lg transition-all duration-300 ${
                  hovered === index ? 'scale-150' : 'scale-100'
                } ${
                  hovered !== null && hovered !== index ? 'scale-[0.98]' : ''
                }`}
              />
              {/* Tampilan desktop tetap seperti aslinya */}
              <div className="absolute inset-0 bg-opacity-20 opacity-0 transition-opacity flex items-end group-hover:opacity-100">
                <p className="text-white p-2 text-sm font-medium">{image.alt}</p>
              </div>
              {/* Indikator untuk mobile bahwa gambar dapat diklik */}
              <div className="md:hidden absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>
            </div>
          ))}
          
          {/* Gambar ketiga hanya ditampilkan pada desktop */}
          <div className="hidden md:block relative overflow-hidden rounded-lg shadow-md group">
            <img
              ref={(el) => {
                if (el) imageRefs.current[2] = el;
              }}
              src={galleryImages[2].src}
              alt={galleryImages[2].alt}
              className={`w-full h-64 object-cover rounded-lg transition-all duration-300 ${
                hovered === 2 ? 'scale-150' : 'scale-100'
              } ${
                hovered !== null && hovered !== 2 ? 'scale-[0.98]' : ''
              }`}
              onMouseMove={(e) => handleMouseMove(e, 2)}
              onMouseEnter={() => handleMouseEnter(2)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => openModal(galleryImages[2], e)}
            />
            <div className="absolute inset-0 bg-opacity-20 opacity-0 transition-opacity flex items-end group-hover:opacity-100">
              <p className="text-white p-2 text-sm font-medium">{galleryImages[2].alt}</p>
            </div>
          </div>
        </div>

        {/* Row 2: 2 gambar untuk mobile */}
        <div className="grid grid-cols-2 md:hidden gap-4">
          {galleryImages.slice(2, 4).map((image, index) => (
            <div
              key={index + 2}
              className="relative overflow-hidden rounded-lg shadow-md group"
              onClick={(e) => openModal(image, e)}
              onMouseMove={(e) => handleMouseMove(e, index + 2)}
              onMouseEnter={() => handleMouseEnter(index + 2)}
              onMouseLeave={handleMouseLeave}
            >
              <img
                ref={(el) => {
                  if (el) imageRefs.current[index + 2] = el;
                }}
                src={image.src}
                alt={image.alt}
                className={`w-full h-32 object-cover rounded-lg transition-all duration-300 ${
                  hovered === index + 2 ? 'scale-150' : 'scale-100'
                } ${
                  hovered !== null && hovered !== index + 2 ? 'scale-[0.98]' : ''
                }`}
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Row 3: 1 gambar tengah untuk mobile */}
        <div className="grid grid-cols-1 md:hidden gap-4 px-16">
          <div
            className="relative overflow-hidden rounded-lg shadow-md group"
            onClick={(e) => openModal(galleryImages[4], e)}
            onMouseMove={(e) => handleMouseMove(e, 4)}
            onMouseEnter={() => handleMouseEnter(4)}
            onMouseLeave={handleMouseLeave}
          >
            <img
              ref={(el) => {
                if (el) imageRefs.current[4] = el;
              }}
              src={galleryImages[4].src}
              alt={galleryImages[4].alt}
              className={`w-full h-32 object-cover rounded-lg transition-all duration-300 ${
                hovered === 4 ? 'scale-150' : 'scale-100'
              } ${
                hovered !== null && hovered !== 4 ? 'scale-[0.98]' : ''
              }`}
            />
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Layout Desktop: 2 gambar di baris kedua (tetap seperti aslinya) */}
        <div className="hidden md:grid grid-cols-2 gap-4 md:px-16">
          {galleryImages.slice(3, 5).map((image, index) => (
            <div
              key={index + 3}
              className="relative overflow-hidden rounded-lg shadow-md group"
              onClick={(e) => openModal(image, e)}
              onMouseMove={(e) => handleMouseMove(e, index + 3)}
              onMouseEnter={() => handleMouseEnter(index + 3)}
              onMouseLeave={handleMouseLeave}
            >
              <img
                ref={(el) => {
                  if (el) imageRefs.current[index + 3] = el;
                }}
                src={image.src}
                alt={image.alt}
                className={`w-full h-64 object-cover rounded-lg transition-all duration-300 ${
                  hovered === index + 3 ? 'scale-150' : 'scale-100'
                } ${
                  hovered !== null && hovered !== index + 3 ? 'scale-[0.98]' : ''
                }`}
              />
              <div className="absolute inset-0 bg-opacity-20 opacity-0 transition-opacity flex items-end group-hover:opacity-100">
                <p className="text-white p-2 text-sm font-medium">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-12">
        <Link
          href={'/umrah-packages'}
          className="bg-[#222636] text-white py-3 px-6 rounded-md hover:bg-[#2E3650] transition-colors inline-flex items-center gap-2 justify-center"
        >
          <span>Lihat Paket Umrah</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7l5 5-5 5M6 12h12"
            />
          </svg>
        </Link>
      </div>

      {/* Modal untuk tampilan gambar penuh - hanya untuk mobile */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#222636] bg-opacity-90 p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Close */}
            <button 
              className="absolute -top-12 right-0 text-white p-2 rounded-full hover:bg-gray-800 transition-colors z-10"
              onClick={closeModal}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
            
            {/* Gambar dalam Modal */}
            <div className="bg-white p-2 rounded-lg">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.alt} 
                className="w-full h-auto max-h-[80vh] object-contain rounded"
              />
              <p className="text-center mt-4 text-lg font-medium py-2">{selectedImage.alt}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Galeri;