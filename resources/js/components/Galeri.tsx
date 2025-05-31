import React from 'react';

interface GalleryImage {
  src: string;
  alt: string;
}

const galleryImages: GalleryImage[] = [
  {
    src: '/img/foto4.jpg',
    alt: 'Jamaah Umrah',
  },
  {
    src: '/img/foto2.jpg',
    alt: 'Masjidil Haram',
  },
  {
    src: '/img/foto5.jpg',
    alt: 'Turkey',
  },
];

const Galeri: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">

      <div className="text-center mb-10">
      <div className="flex items-center justify-center mb-4">
        <div className="flex-grow h-px bg-[#222636] mx-4 md:mx-6"></div>
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-[#222636] whitespace-nowrap">
            GALERI PERJALANAN <span className="underline underline-offset-4">UMRAH</span>
          </h2>
        <div className="flex-grow h-px bg-[#222636] mx-4 md:mx-6"></div>
      </div>
  
        <p className="text-[#222636] text-lg md:text-xl max-w-xl mx-auto mb-2">
          Potret momen suci bersama Al Habsa Travel
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {galleryImages.map((image, index) => (
          <div key={index} className="flex flex-col items-start">
            <div className="relative rounded-lg rounded-bl-none overflow-hidden group w-full">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-105 object-cover transform transition duration-300 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 w-60 bg-white py-3 px-4 rounded-tr-sm shadow-sm flex flex-col items-start">
                <h2 className="text-black font-extrabold text-xl uppercase">
                  {image.alt}
                </h2>
              </div>
            </div>

            {/* Line moved outside */}
            <div className="w-50 h-1 bg-[#222636]" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Galeri;
