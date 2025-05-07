import { Head } from '@inertiajs/react';
import Navbar from '@/components/navbar'
import Card from '@/components/card/Card'
import HeaderCard from '@/components/card/HeaderCard'

const CardPages = () => {
  return (
    <>
    <Head title="Paket Umrah" />
    <Navbar/>
    <HeaderCard/>
    <Card/>
    </>
  )
}

export default CardPages
