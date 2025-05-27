import { FaHotel, FaMapMarkerAlt, FaPlaneDeparture, FaTimes, FaStar, FaGlobe } from 'react-icons/fa';
import { Rating, Star } from "@smastrom/react-rating";

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
  link_website?: string;
}

interface Airline {
  name: string;
  link_website?: string;
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'hotel' | 'airport' | 'airline';
  data: Hotel | Airport | Airline | null;
}

// Definisi warna dan keterangan untuk setiap tingkat rating
const ratingLabels: { [key: number]: { label: string; color: string } } = {
    1: { label: "Buruk", color: "#FF5252" },
    2: { label: "Kurang", color: "#FF9800" },
    3: { label: "Cukup", color: "#FFC107" },
    4: { label: "Sangat Baik", color: "#8BC34A" },
    5: { label: "Luar Biasa", color: "#4CAF50" }
  };

const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, type, data }) => {
  if (!isOpen || !data) return null;

  const renderHotelContent = (hotel: Hotel) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="bg-blue-100 p-3 rounded-full">
          <FaHotel className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{hotel.name}</h3>
          <p className="text-gray-600">{hotel.city}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaStar className="w-4 h-4 text-yellow-500 mr-2" />
            <span className="font-semibold">Rating</span>
          </div>
          <div className="text-gray-700">
            {hotel.rating ? (
                            <div className="flex flex-col space-y-1 mt-1">
                              {/* Tampilkan rating dalam bentuk bintang */}
                              <Rating
                                style={{ maxWidth: 100 }}
                                value={parseFloat(hotel.rating) || 0}
                                itemStyles={{
                                  itemShapes: Star,
                                  activeFillColor: ratingLabels[Math.round(parseFloat(hotel.rating) || 0)]?.color || "#FFC107",
                                  inactiveFillColor: "#f0f0f0"
                                }}
                                readOnly={true}
                              />
                              
                              {/* Tampilkan keterangan rating dengan warna sesuai */}
                              <div className="flex items-center">
                                <div 
                                  className="w-2 h-2 rounded-full mr-1" 
                                  style={{ backgroundColor: ratingLabels[Math.round(parseFloat(hotel.rating) || 0)]?.color || "#FFC107" }}
                                ></div>
                                <span className="text-xs">
                                  {hotel.rating} - {ratingLabels[Math.round(parseFloat(hotel.rating) || 0)]?.label || ""}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span style={{ color: 'gray' }}>
                              404 Not Found
                            </span>
                          )}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaMapMarkerAlt className="w-4 h-4 text-red-500 mr-2" />
            <span className="font-semibold">Lokasi</span>
          </div>
            <div className="text-gray-700 hover:underline">
                <a
                    href={`https://www.google.com/maps/search/?q=${encodeURIComponent(hotel.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={hotel.location}
                    style={{ color: 'black' }}
                    >
                    {hotel.location}
                </a>
            </div>
        </div>
      </div>
      
      {hotel.description && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Deskripsi</h4>
          <p className="text-gray-700">{hotel.description}</p>
        </div>
      )}
      
      {(hotel.latitude && hotel.longitude) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Koordinat</h4>
          <p className="text-gray-700">Lat: {hotel.latitude}, Long: {hotel.longitude}</p>
        </div>
      )}
    </div>
  );

  const renderAirportContent = (airport: Airport) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="bg-green-100 p-3 rounded-full">
          <FaMapMarkerAlt className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{airport.name}</h3>
          <p className="text-gray-600">Kode: ({airport.code})</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaMapMarkerAlt className="w-4 h-4 text-red-500 mr-2" />
            <span className="font-semibold">Lokasi</span>
          </div>
          <div className="text-gray-700 hover:underline">
                <a
                    href={`https://www.google.com/maps/search/?q=${encodeURIComponent(airport.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={airport.location}
                    style={{ color: 'black' }}
                    >
                    {airport.location}
                </a>
            </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="font-semibold">Kode Bandara</span>
          </div>
          <p className="text-gray-700 text-lg font-mono">({airport.code})</p>
        </div>
      </div>

      {airport.link_website && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaGlobe className="w-4 h-4 text-blue-500 mr-2" />
            <span className="font-semibold">Website</span>
          </div>
          <a 
            href={airport.link_website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-black hover:underline"
          >
            {airport.link_website}
          </a>
        </div>
      )}
      
      {airport.description && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Deskripsi</h4>
          <p className="text-gray-700">{airport.description}</p>
        </div>
      )}
      
      {(airport.latitude && airport.longitude) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Koordinat</h4>
          <p className="text-gray-700">Lat: {airport.latitude}, Long: {airport.longitude}</p>
        </div>
      )}
    </div>
  );

  const renderAirlineContent = (airline: Airline) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="bg-purple-100 p-3 rounded-full">
          <FaPlaneDeparture className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{airline.name}</h3>
          <p className="text-gray-600">Maskapai Penerbangan</p>
        </div>
      </div>
      
      {airline.link_website && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaGlobe className="w-4 h-4 text-blue-500 mr-2" />
            <span className="font-semibold">Website</span>
          </div>
          <a 
            href={airline.link_website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-black hover:underline"
          >
            {airline.link_website}
          </a>
        </div>
      )}
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Informasi</h4>
        <p className="text-gray-700">
          {airline.name} adalah maskapai yang digunakan untuk penerbangan umrah ini. 
          Pastikan untuk memeriksa persyaratan bagasi dan dokumen perjalanan yang diperlukan.
        </p>
      </div>
    </div>
  );

  const getTitle = () => {
    switch (type) {
      case 'hotel': return 'Detail Hotel';
      case 'airport': return 'Detail Bandara';
      case 'airline': return 'Detail Maskapai';
      default: return 'Detail';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#222636] bg-opacity-90 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="w-5 h-5 text-[#222636]" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {type === 'hotel' && renderHotelContent(data as Hotel)}
          {type === 'airport' && renderAirportContent(data as Airport)}
          {type === 'airline' && renderAirlineContent(data as Airline)}
        </div>
        
        {/* Footer */}
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="bg-[#222636] hover:bg-[#2E3650] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;