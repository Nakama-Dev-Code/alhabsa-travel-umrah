import Navbar from '@/components/navbar'
import { Head } from '@inertiajs/react';
import HeaderCard from '@/components/policy/HeaderCardCookie'
import CookieConsent from '@/components/CookieConsent';
import Footer from '@/components/Footer'
import SocialIcons from '@/components/SocialIcons'

const CookiePolicy: React.FC = () => {
  return (
    <>    
        <Head title="Cookie Policy" />
        <Navbar/>
        <HeaderCard/>
        <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Cookie Policy</h1>
        <p className="text-gray-700 mb-4">
            This Cookie Policy explains how Al Habsa uses cookies and similar
            technologies to recognize you when you visit our website. It explains
            what these technologies are and why we use them, as well as your rights
            to control our use of them.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
            What are cookies?
        </h2>
        <p className="text-gray-700 mb-4">
            Cookies are small data files that are placed on your computer or mobile
            device when you visit a website. Cookies are widely used by website
            owners to make their websites work, or to work more efficiently, as well
            as to provide reporting information.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
            Why do we use cookies?
        </h2>
        <p className="text-gray-700 mb-4">
            We use first and third-party cookies for several reasons. Some cookies
            are required for technical reasons in order for our website to operate,
            and we refer to these as “essential” cookies. Other cookies enable us to
            track and target the interests of our users to enhance the experience on
            our website.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
            Managing cookies
        </h2>
        <p className="text-gray-700 mb-4">
            You have the right to decide whether to accept or reject cookies. You
            can set or amend your web browser controls to accept or refuse cookies.
            If you choose to reject cookies, you may still use our website though
            your access to some functionality and areas of our website may be
            restricted.
        </p>

        <p className="text-gray-600 mt-8 text-sm">
            Last updated: {new Date().toLocaleDateString()}
        </p>
        </div>
        <CookieConsent />
        <Footer/>
        <SocialIcons/>
    </>
  );
};

export default CookiePolicy;
