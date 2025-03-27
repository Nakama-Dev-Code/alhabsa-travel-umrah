import { FaCalendarAlt, FaHotel, FaPlane, FaMapMarkerAlt } from 'react-icons/fa';

const PropertyCards = () => {
  const properties = [
    {
      title: "Paket mewah VVIP limit",
      builder: "Ashana Housing",
      lokasi: "Mekkah",
      status: "Unfurnished",
      availability: "Immediately Available",
      image: "/img/banner2.jpg",
      harga: '150.0000'
    },
    {
      title: "2 BHK Luxury Flats",
      builder: "Premium Builders",
      lokasi: "Madinah",
      status: "Semi-Furnished",
      availability: "Ready to Move",
      image: "/img/foto3.jpg",
      harga: '150.0000'
    },
  ];

  return (
    <div className="px-4 md:px-20 lg:px-32 py-8 bg-gray-50">
      <div className="text-start mb-6">
        <h2 className="font-bold text-3xl md:text-4xl text-gray-800 mb-2">Featured Properties</h2>
        <p className="font-medium text-gray-600 text-lg">Lorem ipsum dolor sit amet consectetur.</p>
      </div>

      <div className="grid grid-cols-1  gap-8">
        {properties.map((property, index) => (
          <div key={index} className="max-w-full rounded-xl overflow-hidden shadow-lg bg-white transition-all duration-300 hover:shadow-xl">

            <div className="bg-[#2E3650] p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{property.title}</h3>
              <div className="flex space-x-3">

                <button className="w-10 h-10 flex items-center justify-center bg-[#222636] text-white rounded-lg transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="md:flex">
              <div className="md:w-1/2 relative max-h-full xl:h-[440px]">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/img/placeholder.jpg";
                  }}
                />

                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md">
                  <span className="text-sm font-semibold text-blue-700">{property.lokasi}</span>
                </div>
              </div>

              <div className="md:w-1/2 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600">{property.builder}</p>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded mt-1">
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
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-semibold">03 April 2025</p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaHotel className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                        <p className="text-xs text-gray-500">Hotels</p>
                        <p className="font-semibold">Nama Hotel, Makkah</p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaHotel className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                        <p className="text-xs text-gray-500">Hotels</p>
                        <p className="font-semibold">Nama Hotel, Madinah</p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaPlane className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                        <p className="text-xs text-gray-500">Airline</p>
                        <p className="font-semibold">Garuda Indonesia</p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaMapMarkerAlt className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                        <p className="text-xs text-gray-500">Airport</p>
                        <p className="font-semibold">Soekarno-Hatta (CGK)</p>
                        </div>
                    </div>

                </div>

                <div className="bg-gray-50 py-4 px-2 rounded-lg">
                  <div className="flex justify-between">
                      <div  className="text-start">
                        <p className="text-[19px] text-gray-500">Price : </p>
                        <p className="font-bold text-[35px] text-rose-500">{property.harga}</p>
                      </div>

                  </div>
                </div>

                <button className="w-full bg-[#2E3650] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300">
                 Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg transition-colors duration-300 shadow-md">
          Lihat selengkapnya
        </button>
      </div>
    </div>
  );
};

export default PropertyCards;
