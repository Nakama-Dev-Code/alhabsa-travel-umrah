import { Head } from '@inertiajs/react';
import Navbar from '@/components/navbar'
import HeaderCard from '@/components/card/HeaderCard'
import TabunganUmrahSimulator from '@/components/TabunganUmrahSimulator';
import SocialIcons from '@/components/SocialIcons'
import CookieConsent from "@/components/CookieConsent";
import Footer from '@/components/Footer'

interface Props {
    umrahPackages: any[][];
}

const TabunganUmrahPage: React.FC<Props> = ({ umrahPackages }) => {
    return (
        <div>
            <Head title="Simulator Tabungan Umrah" />
            <Navbar/>
            <HeaderCard/>
            <TabunganUmrahSimulator umrahPackages={umrahPackages} />
            <CookieConsent />
            <SocialIcons/>
            <CookieConsent />
            <Footer/>
        </div>
    );
};

export default TabunganUmrahPage;