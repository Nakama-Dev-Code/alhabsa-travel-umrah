import { Head } from '@inertiajs/react';
import Navbar from '@/components/navbar'
import Process from '@/components/process-step/ProcessSteps'
import HeaderCard from '@/components/card/HeaderCard'
import CookieConsent from '@/components/CookieConsent';
import Footer from '@/components/Footer'
import SocialIcons from '@/components/SocialIcons'

const ProcessSteps = () => {
  return (
    <>
    <Head title="Proses Pemesanan" />
    <Navbar/>
    <HeaderCard/>
    <Process/>
    <CookieConsent />
    <Footer/>
    <SocialIcons/>
    </>
  )
}

export default ProcessSteps
