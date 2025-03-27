import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref untuk tracking beam
  const tracingBeamRef = useRef(null);
  
  // Mencegah navbar tidak menutup ketika di scroll
  useEffect(() => {
    if (showMobileMenu || showSearchModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showMobileMenu, showSearchModal]);

  // Simulasi loading saat halaman pertama kali dibuka
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // scroll effect & tracing beam
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update tracing beam position
      updateTracingBeam();
    };
    
    const updateTracingBeam = () => {
      if (!tracingBeamRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const windowHeight = scrollHeight - clientHeight;
      const progress = scrollTop / windowHeight;
      
      // Update tracing beam width based on scroll progress (0% to 100%)
      tracingBeamRef.current.style.width = `${progress * 100}%`;
      
      // Only show beam when scrolling has begun
      tracingBeamRef.current.style.opacity = scrollTop > 5 ? '1' : '0';
    };
    
    // Tambah scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial position
    updateTracingBeam();
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Array pada navbar link
  const navItems = [
    { label: 'Beranda', href: '#Home' },
    { label: 'Pemesanan', href: '#Book' },
    { label: 'Tentang Kami', href: '#About' },
    { label: 'Galeri', href: '#Galeri' },
    { label: 'Kontak', href: '#Contact' },
  ];

  return (
    <div className="relative z-50">
      {/* Desktop Navbar */}
      <div 
        className={`
          hidden md:block fixed top-0 left-0 w-full transition-all duration-300
          ${isScrolled 
            ? 'bg-[#D3D3D3] shadow-md text-white' 
            : 'bg-transparent text-white bg-gradient-to-t from-transparent to-black/50'
          }
        `}
      >
        {/* Tracing Beam - inspired by aceternity UI */}
        <div 
          className="absolute top-0 left-0 right-0 h-0.5 bg-transparent overflow-hidden"
        >
          <div 
            ref={tracingBeamRef}
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 w-0 transition-opacity duration-300 opacity-0"
            style={{
              boxShadow: '0 0 8px 1px rgba(76, 175, 80, 0.5)'
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/img/alhabsalogo.png" 
              alt="Logo" 
              className="h-8 mr-8"
            />
          </div>

          {/* Desktop navbar Links */}
          <nav className="flex space-x-6">
            {navItems.map((item, index) => (
              <a 
                key={index} 
                href={item.href} 
                className={`
                  transition-colors 
                  ${isScrolled 
                    ? 'text-[#222636] hover:text-white' 
                    : 'text-white hover:text-gray-200'
                  }
                `}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Kanan mode desktop */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button 
              onClick={() => setShowSearchModal(true)}
              className={`p-2 rounded-full 
                ${isScrolled 
                  ? 'hover:bg-gray-700 text-white' 
                  : 'hover:bg-white/20 text-white'
                }
              `}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </button>

            {/* Login Button */}
            <button 
              className={`px-4 py-2 rounded-md transition-colors 
                ${isScrolled 
                  ? 'bg-[#222636] text-white hover:bg-[#2E3650]' 
                  : 'bg-white text-black hover:bg-white/90'
                }
              `}
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {/* modal untuk search mode Desktop */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-white z-50 flex items-start">
          <div className="w-full p-4">
            <div className="flex items-center max-w-4xl mx-auto">
              <img 
                src="/img/alhabsalogo.png" 
                alt="Logo" 
                className="h-8 mr-4" 
              />
              <div className="flex-grow relative">
                <input 
                  type="text" 
                  placeholder="Search for any keyword e.g. Refund" 
                  className="w-full border-b border-gray-300 px-2 py-2 text-xl focus:outline-none focus:border-green-500"
                  autoFocus
                />
              </div>
              <button 
                onClick={() => setShowSearchModal(false)}
                className="ml-4 text-gray-700 hover:text-gray-900"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle untuk Mobile Navbar */}
      <div 
        className="md:hidden fixed top-0 left-0 w-full bg-white shadow-md z-40"
      >
        {/* Tracing Beam untuk Mobile */}
        <div 
          className="absolute top-0 left-0 right-0 h-0.5 bg-transparent overflow-hidden"
        >
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300"
            style={{
              width: `${isLoading ? '100%' : '0%'}`,
              boxShadow: '0 0 8px 1px rgba(76, 175, 80, 0.5)'
            }}
          />
        </div>
        
        <div className="flex justify-between items-center p-4">
          <img 
            src="/img/alhabsalogo.png" 
            alt="Logo" 
            className="h-8" 
          />
          <button 
            onClick={() => setShowMobileMenu(true)}
            className="p-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-gray-700" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto md:hidden">
          <div className="p-4">
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center mb-4">
              <img 
                src="/img/alhabsalogo.png" 
                alt="Saudia Logo" 
                className="h-8" 
              />
              <button 
                onClick={() => setShowMobileMenu(false)}
                className="p-2"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-gray-700" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>

            {/* pencarian inputan */}
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </button>
            </div>

            {/* Mode mobile untuk nav link */}
            <nav className="space-y-4 mb-6">
              {navItems.map((item, index) => (
                <a 
                  key={index} 
                  href={item.href} 
                  onClick={() => setShowMobileMenu(false)}
                  className="block py-3 text-gray-700 border-b"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Send Feedback Button */}
            <div className="fixed bottom-4 center-4 m-2 sm:m-4">
              <button className="bg-[#2E3650] text-white px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg">
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;