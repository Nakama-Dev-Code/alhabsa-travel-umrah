import { useState, useRef } from 'react';

import { Link } from '@inertiajs/react';

const Galeri = () => {
  const [hovered, setHovered] = useState<number | null>(null);
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

  return (
    <div className="container mx-auto px-4 py-8" id="Galeri">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        GALERI PERJALANAN UMRAH
      </h2>

      <div className="flex flex-col gap-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {galleryImages.slice(0, 3).map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-md group cursor-zoom-in"
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
                className={`w-full h-64 object-cover rounded-lg transition-all duration-300 ${
                  hovered === index ? 'scale-150' : 'scale-100'
                } ${
                  hovered !== null && hovered !== index ? 'scale-[0.98]' : ''
                }`}
              />
              <div className="absolute inset-0 bg-opacity-20 opacity-0  transition-opacity flex items-end group-hover:opacity-100">
                <p className="text-white p-2 text-sm font-medium">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:px-16">
          {galleryImages.slice(3, 5).map((image, index) => (
            <div
              key={index + 3}
              className="relative overflow-hidden rounded-lg shadow-md group cursor-zoom-in"
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
              <div className="absolute inset-0  bg-opacity-20 opacity-0  transition-opacity flex items-end group-hover:opacity-100">
                <p className="text-white p-2 text-sm font-medium">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <Link href={'/umrah-package'} className="bg-[#222636] text-white py-3 px-4 rounded-md hover:bg-[#2E3650] transition-colors">
          Lihat Paket Umrah
        </Link>
      </div>
    </div>
  );
};

export default Galeri;
