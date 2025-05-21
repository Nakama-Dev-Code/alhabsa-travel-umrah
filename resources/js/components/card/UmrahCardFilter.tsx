import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { FaCalendarAlt, FaHotel, FaMapMarkerAlt, FaPlaneDeparture } from 'react-icons/fa';
import { FaPlaneCircleCheck } from "react-icons/fa6";
import { RiFilterLine } from "react-icons/ri";
import { SelectValue, SelectTrigger, SelectContent, SelectItem, Select } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Definisi interface untuk data yang diambil dari controller
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

interface Property {
  id: number;
  title: string;
  builder: string;
  category: string;
  status: string;
  availability: string;
  image: string;
  harga: string;
  date: string;
  sisaSeat: string;
  priceValue: number;
  hotelMakkah: string;
  hotelMadinah: string;
  airport: string;
  airline: string;
}

interface FilterState {
  category: string;
  availability: string;
  airline: string;
  priceRange: {
    min: number;
    max: number;
  };
}

const UmrahCardFilter = () => {
  const { packageSchedules, packages, hotels, airports, airlines } = usePage<{
    packageSchedules: PackageSchedule[],
    packages: Package[],
    hotels: Hotel[],
    airports: Airport[],
    airlines: Airline[]
  }>().props;
  
  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    availability: "all",
    airline: "all",
    priceRange: { min: 0, max: 30000000 }
  });

  // Sorting state
  const [sortBy, setSortBy] = useState<string>("default");

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(2);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>([]);
  
  // Mengubah data yang diterima dari controller menjadi format yang dibutuhkan komponen
  const [allProperties, setAllProperties] = useState<Property[]>([]);

  useEffect(() => {
    // Mengubah data dari controller ke format yang dibutuhkan komponen
    if (packageSchedules && packageSchedules.length > 0) {
      const formattedData: Property[] = packageSchedules.map(schedule => {
        // Mencari data paket, hotel, dll berdasarkan ID
        const packageData = packages.find(p => p.id === schedule.package_id);
        const category = packageData?.category || { name: "" };
        const type = category?.type || { name: "" };
        const hotelMakkah = schedule.hotelMakkah || hotels.find(h => h.id === schedule.hotel_makkah_id);
        const hotelMadinah = schedule.hotelMadinah || hotels.find(h => h.id === schedule.hotel_madinah_id);
        const airport = schedule.airport || airports.find(a => a.id === schedule.airport_id);
        const airline = schedule.airline || airlines.find(a => a.id === schedule.airline_id);
        
        // Format harga
        const harga = `IDR ${new Intl.NumberFormat('id-ID').format(schedule.price)},00`;
        
        // Menentukan status ketersediaan
        const availability = schedule.seat_available > 0 ? "Tersedia" : "Habis";
        
        return {
          id: schedule.id,
          title: packageData?.title || "PAKET UMRAH",
          builder: type?.name || "Umroh Reguler",
          category: category?.name || "Paket Reguler",
          status: "Unfurnished",
          availability: availability,
          image: packageData?.image || "/img/no-image.jpg",
          harga: harga,
          date: new Date(schedule.departure_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
          sisaSeat: `${schedule.seat_available ? `${schedule.seat_available} Seat Tersedia` : 'Seat Habis'}`,
          hotelMakkah: hotelMakkah?.name || "Hotel di Makkah",
          hotelMadinah: hotelMadinah?.name || "Hotel di Madinah",
          airport: airport?.name || "Airport",
          airline: airline?.name || "Airline",
          priceValue: schedule.price
        };
      });
      
      setAllProperties(formattedData);
    }
  }, [packageSchedules, packages, hotels, airports, airlines]);
  
  // Extract unique values for filter options
  const categoryOptions = [...new Set(allProperties.map(item => item.category))];
  const availabilityOptions = [...new Set(allProperties.map(item => item.availability))];
  const airlineOptions = [...new Set(allProperties.map(item => item.airline))];

  // Filter and sort function
  useEffect(() => {
    let result = [...allProperties];
    
    // Apply filters
    if (filters.category && filters.category !== "all") {
      result = result.filter(item => item.category === filters.category);
    }
    
    if (filters.availability && filters.availability !== "all") {
      result = result.filter(item => item.availability === filters.availability);
    }
    
    if (filters.airline && filters.airline !== "all") {
      result = result.filter(item => item.airline === filters.airline);
    }
    
    // Apply price range filter
    result = result.filter(item => 
      item.priceValue >= filters.priceRange.min && 
      item.priceValue <= filters.priceRange.max
    );
    
    // Apply sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.priceValue - b.priceValue);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.priceValue - a.priceValue);
    } else if (sortBy === "date-asc") {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === "date-desc") {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    setFilteredProperties(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, sortBy, allProperties]);

  // Calculate pagination
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setDisplayedProperties(filteredProperties.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, itemsPerPage, filteredProperties]);

  // Handle filter changes
  const handleFilterChange = (filterName: keyof FilterState, value: string): void => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Handle price range changes
  const handlePriceRangeChange = (type: 'min' | 'max', value: string): void => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: parseInt(value) || 0
      }
    }));
  };

  // Handle reset filters
  const resetFilters = (): void => {
    setFilters({
      category: "all",
      availability: "all",
      airline: "all",
      priceRange: { min: 0, max: 30000000 }
    });
    setSortBy("default");
  };

  // Pagination controls
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  
  const goToPage = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Price formatter
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // image
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  return (
    <div className="px-4 md:px-20 lg:px-32 py-8 bg-gray-50">
      <div className="text-start mb-6">
        <h2 className="font-bold text-3xl md:text-4xl text-gray-800 mb-2">Paket Umrah Terbaik</h2>
        <p className="font-medium text-gray-600 text-lg">Fasilitas lengkap & harga bersahabat</p>
      </div>

      {/* Filter toggle button (visible on mobile) */}
      <div className="md:hidden mb-4">
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center justify-center w-full bg-[#222636] text-white py-2 px-4 rounded-lg"
        >
          <RiFilterLine className="mr-2" /> 
          {isFilterOpen ? "Tutup Filter" : "Buka Filter"}
        </button>
      </div>

      {/* Filter section */}
      <div className={`bg-white shadow-md rounded-lg p-4 mb-6 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <RiFilterLine className="mr-2" /> Filter Paket Umrah
          </h3>
          <button 
            onClick={resetFilters}
            className="text-sm text-[#2a3d66] hover:text-blue-800"
          >
            Reset Filter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Kategori Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <Select 
              value={filters.category} 
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categoryOptions.map((option, index) => (
                  <SelectItem key={index} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Availability Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ketersediaan</label>
            <Select 
              value={filters.availability} 
              onValueChange={(value) => handleFilterChange('availability', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {availabilityOptions.map((option, index) => (
                  <SelectItem key={index} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Airline Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maskapai</label>
            <Select 
              value={filters.airline} 
              onValueChange={(value) => handleFilterChange('airline', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Semua Maskapai" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Maskapai</SelectItem>
                {airlineOptions.map((option, index) => (
                  <SelectItem key={index} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urutkan</label>
            <Select 
              value={sortBy} 
              onValueChange={(value) => setSortBy(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-asc">Harga: Rendah ke Tinggi</SelectItem>
                <SelectItem value="price-desc">Harga: Tinggi ke Rendah</SelectItem>
                <SelectItem value="date-asc">Tanggal: Terdekat</SelectItem>
                <SelectItem value="date-desc">Tanggal: Terjauh</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Rentang Harga: {formatPrice(filters.priceRange.min)} - {formatPrice(filters.priceRange.max)}</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input 
                type="range" 
                min="0" 
                max="30000000" 
                step="500000"
                value={filters.priceRange.min} 
                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>30jt</span>
              </div>
            </div>
            <div>
              <input 
                type="range" 
                min="0" 
                max="30000000" 
                step="500000"
                value={filters.priceRange.max} 
                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>30jt</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results summary */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600">
          Menampilkan {displayedProperties.length} dari {filteredProperties.length} paket umrah
        </p>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Tampilkan:</label>
          <Select 
            value={itemsPerPage.toString()} 
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="2" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Property Cards */}
      <div className="grid grid-cols-1 gap-8">
        {displayedProperties.length > 0 ? (
          displayedProperties.map((property, index) => (
            <div key={index} className="max-w-full rounded-xl overflow-hidden shadow-lg bg-white transition-all duration-300 hover:shadow-xl">
              <div className="bg-[#2E3650] p-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">{property.title}</h3>
                <div className="flex space-x-3">
                  <button className="w-10 h-4 flex items-center justify-center bg-[#222636] text-white rounded-lg transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="md:flex">
              <div className="md:w-1/2 relative max-h-full xl:h-[400px]">
                {/* Gambar dengan fitur zoom saat diklik */}
                <div onClick={() => setZoomImage(property.image)} className="cursor-zoom-in">
                    <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "/img/no-image.jpg";
                    }}
                    />

                    {property.sisaSeat === 'Seat Habis' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">S O L D</span>
                        </div>
                    )}
                </div>

                {/* Label kategori di kiri atas */}
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md">
                    <span className="text-sm font-semibold text-blue-700">
                    {property.category}
                    </span>
                </div>

                {/* Modal zoom gambar */}
                {zoomImage && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <div className="relative">
                        <img
                        src={zoomImage}
                        alt="Preview"
                        className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-xl"
                        />
                        <button
                        onClick={() => setZoomImage(null)}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition"
                        aria-label="Tutup Zoom"
                        >
                        ❌
                        </button>
                    </div>
                    </div>
                )}
                </div>

                <div className="md:w-1/2 p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-gray-600">{property.builder}</p>
                      <span className={`inline-block ${property.availability === 'Tersedia' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'} text-xs font-semibold px-2.5 py-0.5 rounded mt-1`}>
                        {property.availability}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaCalendarAlt className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Tanggal</p>
                        <p className="font-semibold text-sm">{property.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaPlaneCircleCheck className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Sisa Seat</p>
                        <p className="font-semibold text-sm">{property.sisaSeat}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaHotel className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Hotel Makkah</p>
                        <p className="font-semibold text-sm">{property.hotelMakkah}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaHotel className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Hotel Madinah</p>
                        <p className="font-semibold text-sm">{property.hotelMadinah}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaMapMarkerAlt className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Bandara</p>
                        <p className="font-semibold text-sm">{property.airport}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaPlaneDeparture className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Maskapai</p>
                        <p className="font-semibold text-sm">{property.airline}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 py-4 px-2 rounded-lg mt-4">
                    <div className="flex justify-between">
                      <div className="text-start">
                        <p className="text-[19px] text-gray-500">Harga : </p>
                        <p className="font-bold text-[25px] text-rose-500">{property.harga}</p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-[#2E3650] text-white font-medium py-1 px-4 rounded-lg transition-colors duration-300 mt-4 hover:bg-[#1e2438]">
                    Pesan Sekarang
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 text-lg">Tidak ada paket umrah yang sesuai dengan filter yang dipilih.</p>
            <button 
              onClick={resetFilters}
              className="mt-4 bg-[#2a3d66] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 hover:bg-blue-700"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
            {/* Keterangan tampil */}
            <div className="text-sm text-gray-700 dark:text-gray-300">
                Menampilkan <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> hingga{" "}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredProperties.length)}</span> dari{" "}
                <span className="font-medium">{filteredProperties.length}</span> data
            </div>

            {/* Tombol navigasi */}
            <div className="flex space-x-2">
            {/* Tombol prev */}
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
            >
                <ChevronLeft size={16} />
            </button>

            {/* Nomor halaman */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
                ) {
                return (
                    <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded-lg ${
                        currentPage === page
                        ? "bg-[#2E3650] text-white"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                    }`}
                    >
                    {page}
                    </button>
                );
                } else if (
                (page === currentPage - 3 && currentPage > 3) ||
                (page === currentPage + 3 && currentPage < totalPages - 2)
                ) {
                return <span key={page} className="px-2">...</span>;
                }
                return null;
            })}

            {/* Tombol next */}
            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
            >
                <ChevronRight size={16} />
            </button>
            </div>
        </div>
      )}

      <div className="text-center mt-12">
        <button className="bg-white border border-[#2a3d66] text-[#2a3d66] hover:bg-blue-50 font-medium py-3 px-8 rounded-lg transition-colors duration-300 shadow-md">
          Lihat selengkapnya
        </button>
      </div>
    </div>
  );
};

export default UmrahCardFilter;