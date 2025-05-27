import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { FaCalendarAlt, FaHotel, FaMapMarkerAlt, FaPlaneDeparture, FaWhatsapp, FaInstagram, FaTiktok, FaDownload } from 'react-icons/fa';
import { toast, Toaster } from 'sonner';
import { FaPlaneCircleCheck } from "react-icons/fa6";
import { RiFilterLine } from "react-icons/ri";
import { SelectValue, SelectTrigger, SelectContent, SelectItem, Select } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import DetailModal from './DetailModal';

// Interface untuk data yang diterima dari controller
interface UmrahPackageData {
  0: string;  // title
  1: string;  // category name
  2: string;  // airline name
  3: string;  // airport name
  4: string;  // airport code
  5: string;  // formatted price
  6: string;  // hotel makkah name
  7: string;  // hotel madinah name
  8: string;  // type name
  9: string;  // formatted date
  10: string; // seat available text
  11: string; // image
  12: number; // raw price
  13: string; // hotel makkah city
  14: string; // hotel makkah rating
  15: string; // hotel makkah location
  16: string; // hotel makkah latitude
  17: string; // hotel makkah longitude
  18: string; // hotel makkah description
  19: string; // hotel madinah city
  20: string; // hotel madinah rating
  21: string; // hotel madinah location
  22: string; // hotel madinah latitude
  23: string; // hotel madinah longitude
  24: string; // hotel madinah description
  25: string; // airport location
  26: string; // airport latitude
  27: string; // airport longitude
  28: string; // airport description
  29: string; // airline link website
}

// Interface untuk data yang sudah diformat untuk tampilan
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
  // Data lengkap untuk modal
  hotelMakkahData?: Hotel;
  hotelMadinahData?: Hotel;
  airportData?: Airport;
  airlineData?: Airline;
  // Nama untuk tampilan
  hotelMakkah: string;
  hotelMadinah: string;
  airport: string;
  airline: string;
}

// Interface untuk modal detail (dummy data karena tidak ada data lengkap dari controller)
interface Hotel {
  name: string;
  city: string;
  rating: string;
  location: string;
  latitude?: string;
  longitude?: string;
  description?: string;
}

interface Airport {
  name: string;
  code: string;
  location: string;
  latitude?: string;
  longitude?: string;
  description?: string;
}

interface Airline {
  name: string;
  link_website?: string;
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
  // Mengambil data dari controller
  const { umrahPackages } = usePage<{ umrahPackages: UmrahPackageData[] }>().props;
  
  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    availability: "all",
    airline: "all",
    priceRange: { min: 0, max: 100000000 }
  });

  // Sorting state
  const [sortBy, setSortBy] = useState<string>("default");

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(2);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>([]);
  
  // State untuk data yang sudah diformat
  const [allProperties, setAllProperties] = useState<Property[]>([]);

  // Share menu state
  const [showShareMenu, setShowShareMenu] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
  if (umrahPackages && umrahPackages.length > 0) {
    const formattedData: Property[] = umrahPackages.map((packageData, index) => {
      const availability = packageData[10].includes('Seat Tersedia') ? "Tersedia" : "Habis";
      
      return {
        id: index + 1,
        title: packageData[0],
        builder: packageData[8],
        category: packageData[1],
        status: "Unfurnished",
        availability: availability,
        image: packageData[11],
        harga: packageData[5],
        date: packageData[9],
        sisaSeat: packageData[10],
        hotelMakkah: packageData[6],
        hotelMadinah: packageData[7],
        airport: packageData[3],
        airline: packageData[2],
        priceValue: packageData[12],
        
        // Data lengkap untuk modal
        hotelMakkahData: {
          name: packageData[6],
          city: packageData[13],
          rating: packageData[14],
          location: packageData[15],
          latitude: packageData[16],
          longitude: packageData[17],
          description: packageData[18]
        },
        hotelMadinahData: {
          name: packageData[7],
          city: packageData[19],
          rating: packageData[20],
          location: packageData[21],
          latitude: packageData[22],
          longitude: packageData[23],
          description: packageData[24]
        },
        airportData: {
          name: packageData[3],
          code: packageData[4],
          location: packageData[25],
          latitude: packageData[26],
          longitude: packageData[27],
          description: packageData[28]
        },
        airlineData: {
          name: packageData[2],
          link_website: packageData[29],
        }
      };
    });
    
    setAllProperties(formattedData);
  }
  }, [umrahPackages]);
  
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
      priceRange: { min: 0, max: 100000000 }
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

  // Toggle share menu
  const toggleShareMenu = (propertyId: number): void => {
    setShowShareMenu(prev => ({
      ...prev,
      [propertyId]: !prev[propertyId]
    }));
  };

  // Share handlers
  const websiteUrl = 'https://alhabsa.com/umrah-packages'; 

  const generateShareText = (property: Property): string => {
    return `🌟 Paket Umrah Terbaik!\n\n` +
          `🕌 ${property.title}\n` +
          `📅 Keberangkatan: ${property.date}\n` +
          `💰 Harga: ${property.harga}\n` +
          `🏨 Hotel Makkah: ${property.hotelMakkah}\n` +
          `🏨 Hotel Madinah: ${property.hotelMadinah}\n\n` +
          `🔗 Info lengkap & pendaftaran:\n${websiteUrl}`;
  };

  const shareToWhatsApp = (property: Property): void => {
    const text = generateShareText(property);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    toggleShareMenu(property.id);
  };

  const shareToInstagram = (property: Property): void => {
    const caption = generateShareText(property);
    navigator.clipboard.writeText(caption);
    toast.success('Caption berhasil disalin! Buka Instagram dan tempelkan saat membuat postingan');
    toggleShareMenu(property.id);
  };

  const shareToTikTok = (property: Property): void => {
    const caption = generateShareText(property);
    navigator.clipboard.writeText(caption);
    toast.success('Caption berhasil disalin! Buka TikTok dan tempelkan saat membuat postingan');
    toggleShareMenu(property.id);
  };

  const downloadImage = (property: Property): void => {
    // Kode untuk mengunduh gambar
    const link = document.createElement('a');
    link.href = property.image;
    link.download = `${property.title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toggleShareMenu(property.id);
  };

  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // image
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'hotel' | 'airport' | 'airline' | null;
    data: Hotel | Airport | Airline | null;
  }>({
    isOpen: false,
    type: null,
    data: null
  });

  const openModal = (type: 'hotel' | 'airport' | 'airline', data: Hotel | Airport | Airline) => {
    setModalState({
      isOpen: true,
      type,
      data
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      data: null
    });
  };

  return (
    <div className="px-4 md:px-20 lg:px-32 py-8 bg-gray-50">
      <div className="text-start mb-6">
        <h2 className="font-bold text-3xl md:text-4xl text-gray-800 mb-2">Paket Umrah Terbaik</h2>
        <p className="font-medium text-gray-600 text-lg">Fasilitas lengkap & harga bersahabat</p>
      </div>
      <Toaster position="top-right" richColors />
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
            className="text-sm text-[#2E3650] hover:text-blue-800"
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
                max="100000000" 
                step="500000"
                value={filters.priceRange.min} 
                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>100jt</span>
              </div>
            </div>
            <div>
              <input 
                type="range" 
                min="0" 
                max="100000000" 
                step="500000"
                value={filters.priceRange.max} 
                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>100jt</span>
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
              <div className="bg-[#222636] p-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">{property.title}</h3>
                <div className="flex space-x-1 relative">
                  <button 
                    onClick={() => toggleShareMenu(property.id)}
                    className="w-8 h-8 flex items-center justify-center bg-[#222636] text-white rounded-lg transition-colors duration-300"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  
                  {/* Share Menu Dropdown */}
                  {showShareMenu[property.id] && (
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg z-10 w-40">
                      <ul className="py-1">
                        <li>
                          <button 
                            onClick={() => shareToWhatsApp(property)}
                            className="flex items-center px-3 py-2 w-full text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FaWhatsapp className="w-4 h-4 mr-2 text-green-500" /> WhatsApp
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => shareToInstagram(property)}
                            className="flex items-center px-3 py-2 w-full text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FaInstagram className="w-4 h-4 mr-2 text-pink-600" /> Instagram
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => shareToTikTok(property)}
                            className="flex items-center px-3 py-2 w-full text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FaTiktok className="w-4 h-4 mr-2 text-black" /> TikTok
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => downloadImage(property)}
                            className="flex items-center px-3 py-2 w-full text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FaDownload className="w-4 h-4 mr-2 text-blue-500" /> Download
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
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
                    <span className="text-sm font-semibold text-[#2E3650]">
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
                      <span className={`inline-block ${property.availability === 'Tersedia' ? 'bg-blue-100 text-[#2E3650]' : 'bg-red-100 text-red-800'} text-xs font-semibold px-2.5 py-0.5 rounded mt-1`}>
                        {property.availability}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaCalendarAlt className="w-4 h-4 text-[#2E3650]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Tanggal</p>
                        <p className="font-semibold text-sm">{property.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaPlaneCircleCheck className="w-4 h-4 text-[#2E3650]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Sisa Seat</p>
                        <p className="font-semibold text-sm">{property.sisaSeat}</p>
                      </div>
                    </div>

                    <div className="flex items-center cursor-pointer" 
                        onClick={() => {
                          openModal('hotel', property.hotelMakkahData!);
                        }}>
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaHotel className="w-4 h-4 text-[#2E3650]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Hotel Makkah</p>
                        <p className="font-semibold text-sm hover:underline">{property.hotelMakkah}</p>
                      </div>
                    </div>

                    <div className="flex items-center cursor-pointer" 
                        onClick={() => {
                          openModal('hotel', property.hotelMadinahData!);
                        }}>
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaHotel className="w-4 h-4 text-[#2E3650]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Hotel Madinah</p>
                        <p className="font-semibold text-sm hover:underline">{property.hotelMadinah}</p>
                      </div>
                    </div>

                    <div className="flex items-center cursor-pointer" 
                        onClick={() => {
                          openModal('airport', property.airportData!);
                        }}>
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaMapMarkerAlt className="w-4 h-4 text-[#2E3650]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Bandara</p>
                        <p className="font-semibold text-sm hover:underline">{property.airport}</p>
                      </div>
                    </div>

                    <div className="flex items-center cursor-pointer" 
                        onClick={() => {
                          openModal('airline', property.airlineData!);
                        }}>
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaPlaneDeparture className="w-4 h-4 text-[#2E3650]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Maskapai</p>
                        <p className="font-semibold text-sm hover:underline">{property.airline}</p>
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

                  <button
                  className={`w-full font-medium py-1 px-4 rounded-lg mt-4 transition-colors duration-300
                    ${property.sisaSeat === 'Seat Habis' 
                      ? 'bg-[#222636] text-white cursor-not-allowed opacity-70' 
                      : 'bg-[#222636] text-white hover:bg-[#2E3650]'}`}
                  disabled={property.sisaSeat === 'Seat Habis'}
                >
                  {property.sisaSeat === 'Seat Habis' ? 'Seat Habis' : 'Pesan Sekarang'}
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
              className="mt-4 bg-[#2E3650] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 hover:bg-[#2a3d66]"
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
                        ? "bg-[#222636] text-white"
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

      <DetailModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type!}
        data={modalState.data}
      />

      <div className="text-center mt-12">
        <button className="bg-white border border-[#2E3650] text-[#2E3650] hover:bg-blue-50 font-medium py-3 px-8 rounded-lg transition-colors duration-300 shadow-md">
          Lihat selengkapnya
        </button>
      </div>
    </div>
  );
};

export default UmrahCardFilter;