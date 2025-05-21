import { useState, useEffect } from 'react';
import { SelectValue, SelectTrigger, SelectContent, SelectItem, Select } from "@/components/ui/select";

import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalTrigger,
  } from "./ui/animated-modal";

// Definisi tipe untuk jenis perjalanan
type TravelType = 'umroh-reguler' | 'umroh-plus';

// Definisi tipe untuk passengers
interface PassengersType {
  adults: number;
  children: number;
}

// Definisi tipe untuk packageData
interface PackageDataType {
  [key: string]: string[];
}

const Book: React.FC = () => {
  // State untuk jenis perjalanan
  const [travelType, setTravelType] = useState<TravelType>('umroh-reguler');

  // State untuk keberangkatan
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  // State untuk jenis paket
  const [selectedPackage, setSelectedPackage] = useState<string>('');

  // State untuk daftar paket berdasarkan jenis perjalanan
  const [packageOptions, setPackageOptions] = useState<string[]>([]);

  // State untuk jumlah penumpang
  const [passengers, setPassengers] = useState<PassengersType>({
    adults: 1,
    children: 0
  });

  // State untuk menampilkan dropdown penumpang
  const [showPassengerDropdown, setShowPassengerDropdown] = useState<boolean>(false);

  // State untuk kode promo
  const [promoCode, setPromoCode] = useState<string>('');

  // Data dummy
  const months: string[] = [
    'Januari 2025', 'Februari 2025', 'Maret 2025', 'April 2025', 'Mei 2025', 'Juni 2025',
    'Juli 2025', 'Agustus 2025', 'September 2025', 'Oktober 2025', 'November 2025', 'Desember 2025'
  ];

  // Data paket untuk setiap jenis perjalanan
  const packageData: PackageDataType = {
    'umroh-reguler': [
      'Paket Umrah Ramadhan',
      'Paket Umrah Syawal',
      'Paket Umrah Private'
    ],
    'umroh-plus': [
      'Paket Plus Turki',
      'Paket Plus Dubai',
      'Paket Plus Palestina',
      'Paket Plus Mesir'
    ],
  };

  // Update daftar paket ketika jenis perjalanan berubah
  useEffect(() => {
    setPackageOptions(packageData[travelType]);
    setSelectedPackage(''); // Reset paket yang dipilih
  }, [travelType]);

  // Fungsi untuk mengubah jumlah penumpang
  const updatePassengers = (type: keyof PassengersType, action: 'increase' | 'decrease'): void => {
    setPassengers(prev => {
      if (action === 'increase') {
        return { ...prev, [type]: prev[type] + 1 };
      } else if (action === 'decrease' && prev[type] > (type === 'adults' ? 1 : 0)) {
        return { ...prev, [type]: prev[type] - 1 };
      }
      return prev;
    });
  };

  // Fungsi untuk mengubah jenis perjalanan
  const handleTravelTypeChange = (newType: TravelType): void => {
    setTravelType(newType);
  };

  // Fungsi untuk menangani perubahan bulan
  const handleMonthChange = (value: string): void => {
    setSelectedMonth(value);
  };

  // Fungsi untuk menangani perubahan paket
  const handlePackageChange = (value: string): void => {
    setSelectedPackage(value);
  };

  // Fungsi untuk mengirim pesan ke WhatsApp
  const sendToWhatsApp = (): void => {
    // Validasi form
    if (!selectedMonth) {
      alert('Silakan pilih bulan keberangkatan');
      return;
    }

    if (!selectedPackage) {
      alert('Silakan pilih jenis paket');
      return;
    }

    // Terjemahan jenis perjalanan
    const travelTypeText: Record<TravelType, string> = {
      'umroh-reguler': 'Umrah Reguler',
      'umroh-plus': 'Umrah Plus',
    };

   // Format pesan Islami
const message = `*Permintaan Informasi Keberangkatan*

Assalamu'alaikum warahmatullahi wabarakatuh,

Bismillahirrahmanirrahim,

Saya ingin mengajukan permintaan informasi terkait perjalanan yang direncanakan sebagai berikut:

Jenis Perjalanan: ${travelTypeText[travelType]}
Bulan Keberangkatan: ${selectedMonth}
Jenis Paket: ${selectedPackage}
Jumlah Penumpang: ${passengers.adults} Dewasa, ${passengers.children} Anak
${promoCode ? `Kode Promo: ${promoCode}` : ''}

Mohon kiranya dapat memberikan informasi lebih lanjut terkait ketersediaan dan harga untuk paket perjalanan ini. Jazakumullahu khairan atas perhatian dan bantuannya.

Wassalamu'alaikum warahmatullahi wabarakatuh.
`;

    // Format pesan untuk URL (encode)
    const encodedMessage = encodeURIComponent(message);

    // Nomor WhatsApp
    const phoneNumber = '6281329196100';

    // URL WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Buka URL WhatsApp
    window.open(whatsappURL, '_blank');
  };

  return (
    <div className="max-w-5xl relative mt-[-170px] z-20 p-4 md:p-6 mx-6 lg:mx-auto bg-white rounded-lg shadow-md shadow-slate-500" id='Book'>
      <h1 className="text-2xl font-bold mb-6">Pemesanan</h1>

      {/* Pilihan Perjalanan */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <label className="flex items-center">
          <input
            type="radio"
            name="travel-type"
            value="umroh-reguler"
            checked={travelType === 'umroh-reguler'}
            onChange={() => handleTravelTypeChange('umroh-reguler')}
            className="mr-2"
          />
          Umrah Reguler
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="travel-type"
            value="umroh-plus"
            checked={travelType === 'umroh-plus'}
            onChange={() => handleTravelTypeChange('umroh-plus')}
            className="mr-2"
          />
          Umrah Plus
        </label>
      </div>

      {/* Pilihan Keberangkatan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-2">Keberangkatan</label>
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Jenis Paket */}
        <div>
          <label className="block mb-2">Jenis Paket</label>
          <Select value={selectedPackage} onValueChange={handlePackageChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Paket" />
            </SelectTrigger>
            <SelectContent>
              {packageOptions.map((pkg, index) => (
                <SelectItem key={index} value={pkg}>
                  {pkg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Jumlah Penumpang */}
        <div className="relative">
          <label className="block mb-2">Pax</label>
          <div
            onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
            className="w-full p-2 border rounded cursor-pointer"
          >
            {passengers.adults} Dewasa, {passengers.children} Anak
          </div>

          {/* Dropdown Penumpang */}
          {showPassengerDropdown && (
            <div className="absolute top-full left-0 w-full bg-white rounded-lg border shadow-lg p-4 z-10 mt-1">
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Dewasa</h3>
                    <p className="text-gray-500 text-sm">12 tahun ke atas</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePassengers('adults', 'decrease');
                      }}
                      disabled={passengers.adults <= 1}
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        ${passengers.adults > 1
                          ? 'bg-gray-200 text-black'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                      `}
                    >
                      -
                    </button>
                    <span className="w-4 text-center">{passengers.adults}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePassengers('adults', 'increase');
                      }}
                      className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Anak</h3>
                    <p className="text-gray-500 text-sm">Umur 2-11 tahun</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePassengers('children', 'decrease');
                      }}
                      disabled={passengers.children <= 0}
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        ${passengers.children > 0
                          ? 'bg-gray-200 text-black'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                      `}
                    >
                      -
                    </button>
                    <span className="w-4 text-center">{passengers.children}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePassengers('children', 'increase');
                      }}
                      className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Promo Code */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full">
          <div className="flex items-center w-full md:w-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-[#2a3d66]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-[#2a3d66]">Tambahkan kode promo</span>
          </div>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Masukkan kode promo"
            className="flex-grow p-2 border rounded w-full md:w-auto"
          />
          <Modal>
            <ModalTrigger className="cursor-pointer bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
                <span className="group-hover/modal-btn:translate-x-50 text-center transition duration-500">
                Cari Keberangkatan
                </span>
                <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
                ✈️
                </div>
            </ModalTrigger>

            <ModalBody>
                <ModalContent>
                <p>Apakah Anda yakin ingin mengirim permintaan ini?</p>
                </ModalContent>
                <ModalFooter>
                <button
                    onClick={sendToWhatsApp}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Kirim ke WhatsApp
                </button>
                </ModalFooter>
            </ModalBody>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Book;