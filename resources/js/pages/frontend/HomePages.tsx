import { Head } from '@inertiajs/react';
import Header from '@/components/Header'
import Book from '@/components/Book'
import About from '@/components/About'
import Card from '@/components/Card'
import Galeri from '@/components/Galeri'
import UmrahSimulator from '@/components/UmrahSimulator';
import Footer from '@/components/Footer'
import '../../../css/app.css'
import SocialIcons from '@/components/SocialIcons'
import Mitra from '@/components/Mitra'
import Fasilitas from '@/components/Fasilitas'
import CookieConsent from "@/components/CookieConsent";
import AccessibilityPanel from '@/components/AccessibilityPanel';
// import PhotoBooth from '@/components/PhotoBooth'

function HomePages() {

  return (
    <>
      <Head title="Beranda" />
      <AccessibilityPanel />
      <Header/>
      <Book/>
      <About/>
      <Card/>
      <Fasilitas/>
      <Galeri/>
      <Mitra/>
      <UmrahSimulator />
      {/* <PhotoBooth/> */}
      <CookieConsent />
      <Footer/>
      <SocialIcons/>
    </>
  )
}

export default HomePages
