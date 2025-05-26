import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { LuAsterisk } from "react-icons/lu";

// Interface untuk data dari controller
interface Package {
  id: number;
  title: string;
  image: string;
  package_category_id: number;
  category?: Category;
}

interface Category {
  id?: number;
  name: string;
  type?: CategoryType;
}

interface CategoryType {
  id?: number;
  name: string;
}

interface Hotel {
  id: number;
  name: string;
}

interface Airport {
  id: number;
  name: string;
  code: string;
}

interface Airline {
  id: number;
  name: string;
}

interface PackageSchedule {
  id: number;
  package_id: number;
  departure_date: string;
  price: number;
  seat_available: number;
  hotel_makkah_id: number;
  hotel_madinah_id: number;
  airport_id: number;
  airline_id: number;
  hotelMakkah?: Hotel;
  hotelMadinah?: Hotel;
  airport?: Airport;
  airline?: Airline;
  package?: Package;
}

// Interface untuk data yang sudah diformat
interface UmrahPackageData {
  id: number;
  namaPaket: string;
  paket: string;
  airline: string;
  airport: string;
  codeAirport: string;
  price: string;
  hotelMakkah: string;
  hotelMadinah: string;
  tipePaket: string;
  tanggal: string;
  sisaSeat: string;
  image: string;
  originalPrice: number;
}

export default function UmrahPackages() {
  const { packageSchedules, packages, hotels, airports, airlines } = usePage<{
    packageSchedules: PackageSchedule[],
    packages: Package[],
    hotels: Hotel[],
    airports: Airport[],
    airlines: Airline[]
  }>().props;

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [umrahPackages, setUmrahPackages] = useState<UmrahPackageData[]>([]);
  
  // Effect untuk mendeteksi ukuran layar
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

  // Effect untuk mengkonversi data dari controller ke format yang dibutuhkan
  useEffect(() => {
    if (packageSchedules && packageSchedules.length > 0) {
      // Filter hanya paket dengan seat_available > 0
      const availableSchedules = packageSchedules.filter(schedule => schedule.seat_available > 0);
      
      const formattedData: UmrahPackageData[] = availableSchedules.map(schedule => {
        // Mencari data paket, hotel, dll berdasarkan ID
        const packageData = packages.find(p => p.id === schedule.package_id);
        const category = packageData?.category || { name: "Paket Reguler" };
        const type = category?.type || { name: "Umrah Reguler" };
        const hotelMakkah = schedule.hotelMakkah || hotels.find(h => h.id === schedule.hotel_makkah_id);
        const hotelMadinah = schedule.hotelMadinah || hotels.find(h => h.id === schedule.hotel_madinah_id);
        const airport = schedule.airport || airports.find(a => a.id === schedule.airport_id);
        const airline = schedule.airline || airlines.find(a => a.id === schedule.airline_id);
        
        // Format harga sesuai dengan format original
        const formattedPrice = `IDR ${new Intl.NumberFormat('id-ID').format(schedule.price)}`;
        
        // Format tanggal
        const formattedDate = new Date(schedule.departure_date).toLocaleDateString('id-ID', { 
          day: '2-digit', 
          month: 'long', 
          year: 'numeric' 
        });

        return {
          id: schedule.id,
          namaPaket: packageData?.title || "PAKET UMRAH",
          paket: category?.name || "Paket Umrah Reguler",
          airline: airline?.name || "Airline",
          airport: airport?.name || "Airport",
          codeAirport: airport?.code || "Airport Code",
          price: formattedPrice,
          hotelMakkah: hotelMakkah?.name || "Hotel Makkah",
          hotelMadinah: hotelMadinah?.name || "Hotel Madinah", 
          tipePaket: type?.name || "Umrah Reguler",
          tanggal: formattedDate,
          sisaSeat: `${schedule.seat_available} Seat Tersedia`,
          image: packageData?.image || "/img/no-image.jpg",
          originalPrice: schedule.price
        };
      });
      
      setUmrahPackages(formattedData);
    }
  }, [packageSchedules, packages, hotels, airports, airlines]);

  // Fungsi untuk mengirim pesan WhatsApp
  const handlePesanSekarang = (umrahPackage: UmrahPackageData) => {
    const phoneNumber = "6281329196100";
    const message = `Assalamu'alaikum Warahmatullahi Wabarakatuh,

Saya tertarik dengan paket umrah yang Al Habsa tawarkan dan ingin mendapatkan informasi lebih lanjut mengenai:

📋 *Detail Paket:*
• Nama Paket: ${umrahPackage.namaPaket}
• Kategori: ${umrahPackage.paket}
• Tanggal Keberangkatan: ${umrahPackage.tanggal}
• Harga: ${umrahPackage.price}

✈️ *Detail Penerbangan:*
• Maskapai: ${umrahPackage.airline}
• Bandara: ${umrahPackage.airport}

🏨 *Detail Akomodasi:*
• Hotel Makkah: ${umrahPackage.hotelMakkah}
• Hotel Madinah: ${umrahPackage.hotelMadinah}

📊 *Ketersediaan:*
• ${umrahPackage.sisaSeat}

Mohon dapat dijelaskan lebih detail mengenai:
1. Fasilitas yang termasuk dalam paket
2. Rundown perjalanan ibadah umrah
3. Persyaratan dan dokumen yang diperlukan
4. Proses pembayaran dan cicilan (jika ada)

Terima kasih atas perhatian dan pelayanannya. Saya menunggu informasi lebih lanjut dari Bapak/Ibu.

Wassalamu'alaikum Warahmatullahi Wabarakatuh`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Buka WhatsApp di tab baru
    window.open(whatsappUrl, '_blank');
  };
  
  // Jumlah card per halaman: 4 untuk desktop, 2 untuk mobile
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
  
  // Menampilkan card yang utuh sesuai dengan halaman aktif dan jenis perangkat
  const visibleUmrahPackage = umrahPackages.slice(
    currentPage * cardsPerPage, 
    Math.min(currentPage * cardsPerPage + cardsPerPage, umrahPackages.length)
  );
  
  // Loading state atau jika tidak ada paket yang tersedia
  if (!packageSchedules || packageSchedules.length === 0) {
    return (
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="font-semibold text-gray-900 text-2xl mb-8">
          Harga Spesial Untuk Paket Umrah
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">Sedang memuat data paket umrah...</p>
        </div>
      </main>
    );
  }

  // Jika tidak ada paket dengan seat tersedia
  if (umrahPackages.length === 0) {
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
        {/* Left arrow - hanya ditampilkan jika bukan halaman pertama dan bukan mobile */}
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
        
        {/* Cards container - responsive grid: 4 kolom untuk desktop, 2 kolom untuk mobile */}
        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4 md:gap-6`}>
          {visibleUmrahPackage.map((umrahPackage, index) => (
            <article 
              key={umrahPackage.id} 
              className="cursor-pointer relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-md">
                <img 
                  alt={`Package Umrah image for ${umrahPackage.namaPaket}`}
                  className="w-full h-48 md:h-64 object-cover rounded-2xl" 
                  src={umrahPackage.image}
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
                    {umrahPackage.paket}
                </span>
                
                {/* Overlay dengan animasi yang muncul saat hover - berbeda untuk mobile dan desktop */}
                <div 
                  className={`absolute inset-0 bg-[#222636]/90 text-white p-3 md:p-4 transition-transform duration-300 ease-in-out flex flex-col justify-between rounded-2xl 
                    ${hoveredIndex === index ? 'translate-y-0' : 'translate-y-full'}`}
                >
                  <div>
                    {/* Header berbeda untuk mobile dan desktop */}
                    {isMobile ? (
                      // Header mobile
                      <h4 className="text-[10px] font-bold mb-2">
                        {umrahPackage.tipePaket} | {umrahPackage.tanggal}
                      </h4>
                    ) : (
                      // Header desktop
                      <h4 className="text-base font-bold mb-2">
                        {umrahPackage.tipePaket} | {umrahPackage.tanggal}
                      </h4>
                    )}
                    
                    {/* Tampilan berbeda untuk mobile dan desktop */}
                    {isMobile ? (
                      // Tampilan mobile - 2 kolom seperti desktop tapi font lebih kecil
                      <>
                        <p className="text-[10px] mb-2">
                          {umrahPackage.airport.length > 30
                              ? `${umrahPackage.airport.substring(0, 30)}...` 
                              : umrahPackage.airport 
                            } ({umrahPackage.codeAirport})
                        </p>
                        
                        {/* Garis Pemisah */}
                        <div className="border-t border-white/80 my-2"></div>

                        <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[10px]">
                          <div className="text-gray-300 text-[10px]">Sisa Seat</div>
                          <div className="font-semibold text-[10px]">
                            {umrahPackage.sisaSeat.replace(" Tersedia", "")}
                          </div>

                          <div className="text-gray-300 text-[10px]">Hotel Makkah</div>
                          <div className="font-semibold text-[10px] leading-tight">
                            {umrahPackage.hotelMakkah.length > 20 
                              ? `${umrahPackage.hotelMakkah.substring(0, 20)}...` 
                              : umrahPackage.hotelMakkah
                            }
                          </div>

                          <div className="text-gray-300 text-[10px]">Hotel Madinah</div>
                          <div className="font-semibold text-[10px] leading-tight">
                            {umrahPackage.hotelMadinah.length > 20 
                              ? `${umrahPackage.hotelMadinah.substring(0, 20)}...` 
                              : umrahPackage.hotelMadinah
                            }
                          </div>
                        </div>
                      </>
                    ) : (
                      // Tampilan desktop - menampilkan semua data
                      <>
                        <p className="text-xs mb-3">{umrahPackage.airport} ({umrahPackage.codeAirport})</p>
                        
                        {/* Garis Pemisah */}
                        <div className="border-t border-white/80 my-2"></div>

                        <div className="grid grid-cols-2 gap-y-2 text-xs">
                          <div className="text-gray-300">Sisa Seat</div>
                          <div className="font-semibold">{umrahPackage.sisaSeat}</div>

                          <div className="text-gray-300">Hotel Makkah</div>
                          <div className="font-semibold">
                            {umrahPackage.hotelMakkah.length > 25
                              ? `${umrahPackage.hotelMakkah.substring(0, 25)}...` 
                              : umrahPackage.hotelMakkah
                            }
                          </div>

                          <div className="text-gray-300">Hotel Madinah</div>
                          <div className="font-semibold">
                            {umrahPackage.hotelMadinah.length > 25
                              ? `${umrahPackage.hotelMadinah.substring(0, 25)}...` 
                              : umrahPackage.hotelMadinah
                            }
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {isMobile ? (
                      // button pesan mobile
                      <button 
                        onClick={() => handlePesanSekarang(umrahPackage)}
                        className="bg-white text-[#222636] py-1 md:py-2 px-3 md:px-4 rounded-full font-semibold text-xs md:text-sm mt-2 hover:bg-gray-100 transition-colors"
                      >
                        Pesan Sekarang
                      </button>
                    ) : (
                      // button pesan desktop
                      <button 
                        onClick={() => handlePesanSekarang(umrahPackage)}
                        className="bg-white text-[#222636] py-1 md:py-2 px-3 md:px-4 rounded-full font-semibold text-xs md:text-sm mt-4 hover:bg-gray-100 transition-colors"
                      >
                        Pesan Sekarang
                      </button>
                    )}
                </div>
              </div>
              <h3 className="mt-3 md:mt-4 font-semibold text-gray-900 text-base md:text-lg leading-tight md:leading-5">
                {umrahPackage.namaPaket}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">
                {umrahPackage.airline}
              </p>
              <p className="flex items-center text-sm md:text-md font-semibold text-[#2E3650] mt-1 md:mt-2">
                {umrahPackage.price}<LuAsterisk className='text-md' />
              </p>
            </article>
          ))}
        </div>
        
        {/* Right arrow - hanya ditampilkan jika bukan halaman terakhir dan bukan mobile */}
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
        
        {/* Indikator titik untuk mobile */}
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
          className="bg-[#222636] text-white text-sm font-semibold rounded-full px-8 py-3 hover:bg-[#2E3650] focus:outline-none transition-colors" 
          type="button"
        >
          Lebih banyak
        </a>
      </div>
    </main>
  );
}