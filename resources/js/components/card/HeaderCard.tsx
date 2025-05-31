import { FaInstagram, FaTiktok } from 'react-icons/fa';
import { usePage } from '@inertiajs/react';

const HeaderCard: React.FC = () => {
  const { url } = usePage();

  let title = 'Transaksi Paket Umrah';
  if (url === '/umrah-savings-simulator') {
    title = 'Simulator Tabungan Umrah';
  } else if (url === '/umrah-packages') {
    title = 'Transaksi Paket Umrah';
  } else if (url === '/cookie-policy') {
    title = 'Cookie Policy';
  } else if (url === '/privacy-policy') {
    title = 'Privacy Policy';
  } else if (url === '/contact') {
    title = 'Kontak Al Habsa';
  } else if (url === '/process-steps') {
    title = '10 Langkah Menuju Umrah';
  }
  return (
    <div className="relative w-full h-[430px] overflow-hidden">
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out z-10"
        style={{
          backgroundImage: `url('/img/banner2.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay dan Konten Utama */}
        
        {/* lama */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 bg-opacity-50 flex items-center px-4 md:px-20 lg:px-32">
          <div className="text-white">
            <h1 className="text-5xl font-bold">{title}</h1>
          </div>
        </div> */}

        {/* baru */}
        <div
          className={`absolute inset-0 bg-gradient-to-b from-transparent ${
              url === '/process-steps' ? 'to-black/100' : 'to-black/80'
            } bg-opacity-50 flex items-end px-4 md:px-20 lg:px-32 pb-12`}
          >
          <div className="text-white">
            <h1 className="text-5xl font-bold">{title}</h1>
          </div>
        </div>

        {/* Social Media - Kanan Bawah */}
        <div className="absolute bottom-4 right-4 flex flex-col items-start gap-2 pb-4 px-4 md:px-20 lg:px-32">
          <p className="text-white font-semibold text-[20px]">Sosial Media</p>
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/alhabsa.travel/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#B49164] transition-colors"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://www.tiktok.com/@alhabsatravel?_t=ZS-8wXNpd9Onjk&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#B49164] transition-colors"
            >
              <FaTiktok size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderCard;
