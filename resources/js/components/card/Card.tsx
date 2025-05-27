import { FC } from 'react';
import { Head } from '@inertiajs/react';
import UmrahCardFilter from '@/components/card/UmrahCardFilter';
import Footer from '@/components/Footer'

const CardPages: FC = () => {
  return (
    <>
      <Head title="Paket Umrah" />
        <div className="min-h-screen bg-gray-50">
          <UmrahCardFilter />
        </div>
      <Footer/>
    </>
  );
};

export default CardPages;
