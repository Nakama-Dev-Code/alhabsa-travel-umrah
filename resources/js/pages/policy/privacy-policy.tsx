import Navbar from '@/components/navbar'
import { Head } from '@inertiajs/react';
import HeaderCard from '@/components/card/HeaderCard'
import CookieConsent from '@/components/CookieConsent';
import Footer from '@/components/Footer'
import SocialIcons from '@/components/SocialIcons'

const PrivacyPolicy: React.FC = () => {
  return (
    <>
    <Head title="Privacy Policy" />
    <Navbar/>
    <HeaderCard/>
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Privacy Policy</h1>
      <p className="text-gray-700 mb-4">
        At Al Habsa, we are committed to protecting your personal information
        and your right to privacy. This Privacy Policy explains what information
        we collect, how we use it, and what rights you have in relation to it.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
        Information We Collect
      </h2>
      <p className="text-gray-700 mb-4">
        We collect personal information that you voluntarily provide to us when
        you register on the website, express an interest in obtaining
        information about us or our services, or otherwise contact us.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
        How We Use Your Information
      </h2>
      <p className="text-gray-700 mb-4">
        We use the information we collect or receive to communicate with you,
        fulfill our services, respond to inquiries, and improve our platform.
        We may also use your information for security, fraud prevention, and
        legal compliance.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
        Sharing Your Information
      </h2>
      <p className="text-gray-700 mb-4">
        We do not share your personal information with third parties except to
        comply with laws, provide you with services, or fulfill business
        obligations. We may share data with service providers, contractors, or
        affiliates to help us operate the website.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
        Your Privacy Rights
      </h2>
      <p className="text-gray-700 mb-4">
        You may review, change, or terminate your account at any time. If you
        have questions or concerns about your data, please contact us.
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

export default PrivacyPolicy;
