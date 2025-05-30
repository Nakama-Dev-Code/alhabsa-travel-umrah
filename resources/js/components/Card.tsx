import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { LuAsterisk } from "react-icons/lu";

type UmrahPackageData = [
  string,  // namaPaket
  string,  // paket
  string,  // airline
  string,  // airport
  string,  // codeAirport
  string,  // price
  string,  // hotelMakkah
  string,  // hotelMadinah
  string,  // tipePaket
  string,  // tanggal
  string,  // sisaSeat
  string,  // image
  number   // originalPrice
];

export default function UmrahPackages() {
  const { umrahPackages } = usePage<{
    umrahPackages: UmrahPackageData[]
  }>().props;

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handlePesanSekarang = (umrahPackage: UmrahPackageData) => {
    const phoneNumber = "6281329196100";
    const message = `Assalamu'alaikum Warahmatullahi Wabarakatuh,

Saya tertarik dengan paket umrah yang Al Habsa tawarkan dan ingin mendapatkan informasi lebih lanjut mengenai:

📋 *Detail Paket:*
• Nama Paket: ${umrahPackage[0]}
• Kategori: ${umrahPackage[1]}
• Tanggal Keberangkatan: ${umrahPackage[9]}
• Harga: ${umrahPackage[5]}

✈️ *Detail Penerbangan:*
• Maskapai: ${umrahPackage[2]}
• Bandara: ${umrahPackage[3]}

🏨 *Detail Akomodasi:*
• Hotel Makkah: ${umrahPackage[6]}
• Hotel Madinah: ${umrahPackage[7]}

📊 *Ketersediaan:*
• ${umrahPackage[10]}

Mohon dapat dijelaskan lebih detail mengenai:
1. Fasilitas yang termasuk dalam paket
2. Rundown perjalanan ibadah umrah
3. Persyaratan dan dokumen yang diperlukan
4. Proses pembayaran dan cicilan (jika ada)

Terima kasih atas perhatian dan pelayanannya. Saya menunggu informasi lebih lanjut dari Bapak/Ibu.

Wassalamu'alaikum Warahmatullahi Wabarakatuh`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };
  
  const cardsPerPage = isMobile ? 2 : 4;
  const maxPage = Math.ceil(umrahPackages.length / cardsPerPage) - 1;
  
  const scrollLeft = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const scrollRight = () => {
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const visibleUmrahPackage = umrahPackages.slice(
    currentPage * cardsPerPage, 
    Math.min(currentPage * cardsPerPage + cardsPerPage, umrahPackages.length)
  );
  
  if (!umrahPackages || umrahPackages.length === 0) {
    return (
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="font-semibold text-gray-900 text-2xl mb-8">
          Harga Spesial Untuk Paket Umrah
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">Maaf, saat ini tidak ada paket umrah yang tersedia.</p>
          <p className="text-gray-400 text-sm mt-2">Silakan cek kembali nanti atau hubungi kami untuk informasi lebih lanjut.</p>
        </div>
      </main>
    );
  }
  
  return (
    <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="font-semibold text-gray-900 text-2xl mb-8">
        Harga Spesial Untuk Paket Umrah
      </h2>
      <div className="relative">
        {!isMobile && currentPage > 0 && (
          <button 
            aria-label="Scroll left" 
            className="absolute top-1/3 -translate-y-1/2 -left-5 z-10 bg-[#222636] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#2E3650] focus:outline-none border-4 border-white"
            onClick={scrollLeft}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4 md:gap-6`}>
          {visibleUmrahPackage.map((umrahPackage, index) => (
            <article 
              key={`package-${index}-${umrahPackage[0]}`} // Menggunakan kombinasi index dan nama paket sebagai key
              className="cursor-pointer relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-md">
                <img 
                  alt={`Package Umrah image for ${umrahPackage[0]}`} // index 0 untuk namaPaket
                  className="w-full h-48 md:h-64 object-cover rounded-2xl" 
                  src={umrahPackage[11]} // index 11 untuk image
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/img/no-image.jpg";
                  }}
                />
                <span
                    className="absolute top-3 left-3 bg-black/30 text-white font-medium rounded-full px-2 py-1 md:px-3 md:py-1"
                    style={{ fontSize: '10px' }}
                    >
                    {umrahPackage[1]} {/* index 1 untuk paket */}
                </span>
                
                <div 
                  className={`absolute inset-0 bg-[#222636]/90 text-white p-3 md:p-4 transition-transform duration-300 ease-in-out flex flex-col justify-between rounded-2xl 
                    ${hoveredIndex === index ? 'translate-y-0' : 'translate-y-full'}`}
                >
                  <div>
                    {isMobile ? (
                      <h4 className="text-[10px] font-bold mb-2">
                        {umrahPackage[8]} | {umrahPackage[9]} {/* tipePaket | tanggal */}
                      </h4>
                    ) : (
                      <h4 className="text-base font-bold mb-2">
                        {umrahPackage[8]} | {umrahPackage[9]} {/* tipePaket | tanggal */}
                      </h4>
                    )}
                    
                    {isMobile ? (
                      <>
                        <p className="text-[10px] mb-2">
                          {umrahPackage[3].length > 30 // airport
                              ? `${umrahPackage[3].substring(0, 30)}...` 
                              : umrahPackage[3] 
                            } ({umrahPackage[4]}) {/* codeAirport */}
                        </p>
                        
                        <div className="border-t border-white/80 my-2"></div>

                        <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[10px]">
                          <div className="text-gray-300 text-[10px]">Sisa Seat</div>
                          <div className="font-semibold text-[10px]">
                            {umrahPackage[10].replace(" Tersedia", "")} {/* sisaSeat */}
                          </div>

                          <div className="text-gray-300 text-[10px]">Hotel Makkah</div>
                          <div className="font-semibold text-[10px] leading-tight">
                            {umrahPackage[6].length > 20  // hotelMakkah
                              ? `${umrahPackage[6].substring(0, 20)}...` 
                              : umrahPackage[6]
                            }
                          </div>

                          <div className="text-gray-300 text-[10px]">Hotel Madinah</div>
                          <div className="font-semibold text-[10px] leading-tight">
                            {umrahPackage[7].length > 20  // hotelMadinah
                              ? `${umrahPackage[7].substring(0, 20)}...` 
                              : umrahPackage[7]
                            }
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-xs mb-3">{umrahPackage[3]} ({umrahPackage[4]})</p> {/* airport (codeAirport) */}
                        
                        <div className="border-t border-white/80 my-2"></div>

                        <div className="grid grid-cols-2 gap-y-2 text-xs">
                          <div className="text-gray-300">Sisa Seat</div>
                          <div className="font-semibold">{umrahPackage[10]}</div> {/* sisaSeat */}

                          <div className="text-gray-300">Hotel Makkah</div>
                          <div className="font-semibold">
                            {umrahPackage[6].length > 25 // hotelMakkah
                              ? `${umrahPackage[6].substring(0, 25)}...` 
                              : umrahPackage[6]
                            }
                          </div>

                          <div className="text-gray-300">Hotel Madinah</div>
                          <div className="font-semibold">
                            {umrahPackage[7].length > 25 // hotelMadinah
                              ? `${umrahPackage[7].substring(0, 25)}...` 
                              : umrahPackage[7]
                            }
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <button 
                    onClick={() => handlePesanSekarang(umrahPackage)}
                    className={`bg-white text-[#222636] py-1 md:py-2 px-3 md:px-4 rounded-full font-semibold text-xs md:text-sm hover:bg-gray-100 transition-colors ${isMobile ? 'mt-2' : 'mt-4'}`}
                  >
                    Pesan Sekarang
                  </button>
                </div>
              </div>
              <h3 className="mt-3 md:mt-4 font-semibold text-gray-900 text-base md:text-lg leading-tight md:leading-5">
                {umrahPackage[0]} {/* namaPaket */}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">
                {umrahPackage[2]} {/* airline */}
              </p>
              <p className="flex items-center text-sm md:text-md font-semibold text-[#2E3650] mt-1 md:mt-2">
                {umrahPackage[5]}<LuAsterisk className='text-md' /> {/* price */}
              </p>
            </article>
          ))}
        </div>
        
        {!isMobile && currentPage < maxPage && (
          <button 
            aria-label="Scroll right" 
            className="absolute top-1/3 -translate-y-1/2 -right-5 z-10 bg-[#222636] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#2E3650] focus:outline-none border-4 border-white" 
            onClick={scrollRight}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        <p className="text-xs text-gray-500 mt-4 text-left">*Syarat dan ketentuan berlaku</p>
        
        {isMobile && maxPage > 0 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxPage + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                aria-label={`Halaman ${index + 1}`}
                className={`w-3 h-3 rounded-full ${
                  currentPage === index ? 'bg-[#222636]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-center mt-8">
        <a 
          href="/umrah-packages"
          className="bg-[#222636] text-white text-sm font-semibold rounded-md px-8 py-3 hover:bg-[#2E3650] focus:outline-none transition-colors" 
          type="button"
        >
          LEBIH BANYAK
        </a>
      </div>
    </main>
  );
}
