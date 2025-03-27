// import React from 'react'; React 19 Tidak Lagi Membutuhkan import React

const Contact = () => {
  return (
    <div className="container mx-auto px-6 md:px-10 lg:px-16 py-12" id='Contact'>
      <h1 className="text-4xl font-bold text-center text-[#222636] mb-12">HUBUNGI KAMI</h1>
      
      <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto">
        {/* Kiri pada desktop */}
        <div className="px-2">
          <div className="mb-8 h-96 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.0303456871693!2d110.83779247482998!3d-7.679886376027635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a3c71d54c0001%3A0x96bffb6473beb531!2sAl%20Habsa%20Tour%20%26%20Travel!5e0!3m2!1sid!2sid!4v1740679367283!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-[#222636] mb-6">KANTOR PUSAT</h2>
            <div className="space-y-4 text-gray-700">
              <p className="flex items-start">
                📍 Jl. Lettu Ismail No.20, Gawanan, Sukoharjo, Jawa Tengah 57512
              </p>
              <p className="flex items-center">📞 +62 813-2919-6100</p>
              <p className="flex items-center">✉️ alhabsa.travel@gmail.com</p>
              <p className="flex items-start">
                🕒 Jam Operasional <br/> 08:00 - 17:00 WIB
              </p>
            </div>
          </div>
        </div>
        
        {/* Kanan pada desktop - Terintegrasi Google Form */}
        <div className="px-2">
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            {/* Container untuk iframe Google Form dengan ukuran responsif */}
            <div className="relative w-full overflow-hidden pt-8" style={{ height: "720px" }}>
              <iframe 
                src="https://docs.google.com/forms/d/e/1FAIpQLSepiloTNgOJNfwmGX6j-Y7C3sZ_IlNGD74PkREnh0PoOVgWoA/viewform?embedded=true" 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                marginHeight="0" 
                marginWidth="0"
                className="absolute top-0 left-0 w-full h-full"
                title="Kuesioner Kepuasan Jamaah PT. ALHABSA MABRURO TOUR"
              >
                Memuat...
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;