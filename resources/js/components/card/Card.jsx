import { Head } from '@inertiajs/react';
import UmrahCardFiltersAndPagination from '@/components/card/UmrahCardFilter'; 

const CardPages = () => {
  return (
    <>
      <Head title="Paket Umrah" />
      <div className="min-h-screen bg-gray-50">
        {/* Page Content */}
        <UmrahCardFiltersAndPagination />
      </div>
    </>
  );
};

export default CardPages;