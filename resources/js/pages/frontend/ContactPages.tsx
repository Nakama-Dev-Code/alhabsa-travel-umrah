import { Head } from '@inertiajs/react';
import Navbar from '@/components/navbar'
import Contact from '@/components/Contact'
import HeaderCard from '@/components/card/HeaderCard'
import CookieConsent from '@/components/CookieConsent'
import Footer from '@/components/Footer'
import SocialIcons from '@/components/SocialIcons'

const ContactPages = () => {
  return (
    <>
    <Head title="Kontak" />
    <Navbar/>
    <HeaderCard/>
    <Contact/>
    <CookieConsent />
    <Footer/>
    <SocialIcons/>
    </>
  )
}

export default ContactPages
