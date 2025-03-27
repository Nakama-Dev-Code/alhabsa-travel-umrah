import React from 'react';
import { FaInstagram, FaTiktok } from 'react-icons/fa';

const HeaderCard = () => {
  return (
    <div className='relative w-full h-[430px] overflow-hidden'>
      <div
        className='absolute inset-0 transition-opacity duration-1000 ease-in-out z-10'
        style={{
          backgroundImage: "url('/img/banner2.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>

        {/* Overlay dan Konten Utama */}
        <div className="absolute inset-0 bg-black bg-gradient-to-b from-transparent to-black/55 bg-opacity-50 flex items-center px-4 md:px-20 lg:px-32">
          <div className='text-white'>
            <h1 className='text-5xl font-bold'>Let's Book now bro</h1>
          </div>
        </div>

        {/* Social Media - Kanan Bawah */}
        <div className='absolute bottom-4 right-4 flex flex-col items-start gap-2 pb-4 px-4 md:px-20 lg:px-32'>
          <p className='text-white font-semibold text-[20px]'>Social Media</p>
          <div className='flex gap-3'>
            <a href="#" className='text-white hover:text-pink-500 transition-colors'>
              <FaInstagram size={24} />
            </a>
            <a href="#" className='text-white hover:text-pink-500 transition-colors'>
              <FaTiktok size={24} />
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}

export default HeaderCard;
