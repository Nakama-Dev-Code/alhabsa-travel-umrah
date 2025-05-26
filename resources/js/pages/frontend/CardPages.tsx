import { Head } from '@inertiajs/react';
import Navbar from '@/components/navbar'
import Card from '@/components/card/Card'
import HeaderCard from '@/components/card/HeaderCard'
import CookieConsent from '@/components/CookieConsent';
import SocialIcons from '@/components/SocialIcons'

const CardPages = () => {
  return (
    <>
    <Head title="Paket Umrah" />
    <Navbar/>
    <HeaderCard/>
    <Card/>
    <CookieConsent />
    <SocialIcons/>
    </>
  )
}

export default CardPages
