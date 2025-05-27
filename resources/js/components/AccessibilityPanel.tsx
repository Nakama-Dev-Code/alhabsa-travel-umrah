import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Languages, ZoomIn, ZoomOut, RotateCcw, X, Accessibility, Pause, Play } from 'lucide-react';

interface AccessibilityPanelProps {
  onLanguageChange?: (language: 'id' | 'en') => void;
}

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'id' | 'en'>('id');
  const [fontSize, setFontSize] = useState(16);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(0.8);

  const translations = {
    id: {
      accessibility: 'Aksesibilitas',
      language: 'Bahasa',
      indonesian: 'Indonesia',
      english: 'English',
      voiceSettings: 'Pengaturan Suara',
      voiceMode: 'Mode Suara',
      voiceOn: 'Suara Aktif',
      voiceOff: 'Suara Nonaktif',
      readingSpeed: 'Kecepatan Baca',
      pauseReading: 'Jeda Baca',
      resumeReading: 'Lanjut Baca',
      visualSettings: 'Pengaturan Visual',
      fontSize: 'Ukuran Teks',
      increase: 'Perbesar',
      decrease: 'Perkecil',
      reset: 'Reset Semua',
      close: 'Tutup',
      slow: 'Lambat',
      normal: 'Normal',
      fast: 'Cepat',
      greetingSettings: 'Ucapan Salam',
      professionalGreeting: 'Salam Profesional',
      playGreeting: 'Putar Salam',
      greetingText: 'Assalamu\'alaikum warahmatullahi wabarakatuh. Selamat datang di layanan Umrah Al Habsa. Kami siap membantu Anda dalam perjalanan ibadah yang mulia ini.',
    },
    en: {
      accessibility: 'Accessibility',
      language: 'Language',
      indonesian: 'Indonesia',
      english: 'English',
      voiceSettings: 'Voice Settings',
      voiceMode: 'Voice Mode',
      voiceOn: 'Voice On',
      voiceOff: 'Voice Off',
      readingSpeed: 'Reading Speed',
      pauseReading: 'Pause Reading',
      resumeReading: 'Resume Reading',
      visualSettings: 'Visual Settings',
      fontSize: 'Font Size',
      increase: 'Increase',
      decrease: 'Decrease',
      reset: 'Reset All',
      close: 'Close',
      slow: 'Slow',
      normal: 'Normal',
      fast: 'Fast',
      greetingSettings: 'Professional Greeting',
      professionalGreeting: 'Professional Greeting',
      playGreeting: 'Play Greeting',
      greetingText: 'Assalamu\'alaikum warahmatullahi wabarakatuh. Welcome to Al Habsa Umrah services. We are ready to assist you in this noble pilgrimage journey with our best service and comfortable facilities. May Allah Subahahu wata\'ala, grant ease in every step of your spiritual journey with us.'
    }
  };

  const t = translations[currentLanguage];

  // Apply font size to root element
  useEffect(() => {
    const rootElement = document.documentElement;
    rootElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  // Get available voices with better Indonesian voice detection
  const getVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    
    // Cari suara Indonesia dengan berbagai cara
    const indonesianVoices = voices.filter((voice: SpeechSynthesisVoice) => {
      const name = voice.name.toLowerCase();
      const lang = voice.lang.toLowerCase();
      
      return (
        lang.includes('id') || 
        lang.includes('indonesia') ||
        name.includes('indonesia') ||
        name.includes('bahasa') ||
        lang === 'id-id' ||
        voice.lang.startsWith('id')
      );
    });
    
    const englishVoices = voices.filter((voice: SpeechSynthesisVoice) => 
      voice.lang.includes('en') || voice.lang.includes('EN')
    );
    
    return { indonesianVoices, englishVoices, allVoices: voices };
  };

  // Voice functionality with improved Indonesian voice selection
  const speakText = (text: string) => {
    if (!isVoiceEnabled && !text.includes('Assalamu\'alaikum')) {
      // Jika voice tidak aktif tapi ini bukan greeting, return
      return;
    }
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const { indonesianVoices, englishVoices, allVoices } = getVoices();
    
    // Set language and voice based on current language
    if (currentLanguage === 'id') {
      utterance.lang = 'id-ID';
      
      // Jika ada suara Indonesia, gunakan yang pertama
      if (indonesianVoices.length > 0) {
        utterance.voice = indonesianVoices[0];
        console.log('Menggunakan suara Indonesia:', indonesianVoices[0].name);
      } else {
        // Jika tidak ada suara Indonesia, coba cari suara yang mendukung bahasa Indonesia
        const fallbackVoice = allVoices.find((voice: SpeechSynthesisVoice) => 
          voice.lang.toLowerCase().includes('id') || 
          voice.name.toLowerCase().includes('google')
        );
        if (fallbackVoice) {
          utterance.voice = fallbackVoice;
          console.log('Menggunakan suara pengganti:', fallbackVoice.name);
        }
      }
    } else {
      utterance.lang = 'en-US';
      if (englishVoices.length > 0) {
        utterance.voice = englishVoices[0];
      }
    }
    
    utterance.rate = readingSpeed;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => {
      setIsReading(true);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsReading(false);
      setIsPaused(false);
    };
    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      setIsReading(false);
      setIsPaused(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // Pause/Resume speech
  const togglePauseResume = () => {
    if (window.speechSynthesis.speaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  };

  // Add hover listeners for voice mode
  useEffect(() => {
    if (!isVoiceEnabled) return;

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.textContent && target.textContent.trim() && !isPaused) {
        speakText(target.textContent.trim());
      }
    };

    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, li');
    elements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter);
    });

    return () => {
      elements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter);
      });
      window.speechSynthesis.cancel();
    };
  }, [isVoiceEnabled, currentLanguage, readingSpeed, isPaused]);

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const { indonesianVoices } = getVoices();
      if (indonesianVoices.length > 0) {
        console.log('Suara Indonesia tersedia:', indonesianVoices.map(v => v.name));
      } else {
        console.log('Tidak ada suara Indonesia yang ditemukan');
      }
    };

    // Load voices immediately if already available
    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      // Wait for voices to load
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Translate page content
  const translatePageContent = (targetLang: 'id' | 'en') => {
    const translationsMap = {
      id: {
        'Home': 'Beranda',
        'About Us': 'Tentang Kami',
        'Booking': 'Pemesanan',
        'Services': 'Layanan',
        'Gallery': 'Galeri',
        'Contact': 'Kontak',
        'Book Now': 'Pesan Sekarang',
        'Learn More': 'Pelajari Lebih',
        'Welcome': 'Selamat Datang',
        'Umrah Package': 'Paket Umrah',
        'Best Price': 'Harga Terbaik',
        'Facilities': 'Fasilitas',
        'LOGIN': 'MASUK'
      },
      en: {
        'Beranda': 'Home',
        'Tentang Kami': 'About Us',
        'Pemesanan': 'Booking',
        'Layanan': 'Services',
        'Galeri': 'Gallery',
        'Kontak': 'Contact',
        'Pesan Sekarang': 'Book Now',
        'Pelajari Lebih': 'Learn More',
        'Selamat Datang': 'Welcome',
        'Paket Umrah': 'Umrah Package',
        'Harga Terbaik': 'Best Price',
        'Fasilitas': 'Facilities',
        'MASUK': 'LOGIN'
      }
    };

    const targetTranslations = translationsMap[targetLang];
    
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textNodes: Node[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    textNodes.forEach(textNode => {
      if (textNode.textContent) {
        let newText = textNode.textContent;
        Object.entries(targetTranslations).forEach(([key, value]) => {
          const regex = new RegExp(`\\b${key}\\b`, 'gi');
          newText = newText.replace(regex, value);
        });
        if (newText !== textNode.textContent) {
          textNode.textContent = newText;
        }
      }
    });
  };

  const handleLanguageChange = (lang: 'id' | 'en') => {
    setCurrentLanguage(lang);
    translatePageContent(lang);
    onLanguageChange?.(lang);
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  const resetSettings = () => {
    setFontSize(16);
    setIsVoiceEnabled(false);
    setReadingSpeed(0.8);
    setIsPaused(false);
    window.speechSynthesis.cancel();
    document.documentElement.style.fontSize = '16px';
  };

  const toggleVoiceMode = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    if (isVoiceEnabled) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      setIsPaused(false);
    }
  };

  return (
    <>
      {/* Accessibility Panel */}
      <div className={`umrah-accessibility-panel-wrapper ${isOpen ? 'umrah-panel-open' : 'umrah-panel-closed'}`}>
        <div className="umrah-accessibility-panel-main">
          <div className="umrah-panel-header">
            <h3 className="umrah-panel-title">
              <Accessibility className="umrah-icon-accessibility" />
              {t.accessibility}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="umrah-close-button"
              aria-label={t.close}
            >
              <X className="umrah-icon-close" />
            </button>
          </div>

          <div className="umrah-panel-content">
            {/* Language Settings */}
            <div className="umrah-setting-section">
              <div className="umrah-section-title">
                <Languages className="umrah-icon-lang" />
                <span>{t.language}</span>
              </div>
              <div className="umrah-language-buttons">
                <button
                  onClick={() => handleLanguageChange('id')}
                  className={`umrah-lang-btn ${currentLanguage === 'id' ? 'umrah-lang-active' : ''}`}
                >
                  🇮🇩 ID
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`umrah-lang-btn ${currentLanguage === 'en' ? 'umrah-lang-active' : ''}`}
                >
                  🇺🇸 EN
                </button>
              </div>
            </div>

            {/* Voice Settings */}
            <div className="umrah-setting-section">
              <div className="umrah-section-title">
                <Volume2 className="umrah-icon-voice" />
                <span>{t.voiceSettings}</span>
              </div>
              
              <div className="umrah-setting-group">
                <button
                  onClick={toggleVoiceMode}
                  className={`umrah-voice-toggle ${isVoiceEnabled ? 'umrah-voice-active' : ''}`}
                >
                  {isVoiceEnabled ? <Volume2 className="umrah-toggle-icon" /> : <VolumeX className="umrah-toggle-icon" />}
                  {isVoiceEnabled ? t.voiceOn : t.voiceOff}
                  {isReading && <span className="umrah-reading-indicator"></span>}
                </button>
              </div>

              {isVoiceEnabled && (
                <>
                  <div className="umrah-setting-group">
                    <label className="umrah-setting-label">{t.readingSpeed}</label>
                    <div className="umrah-speed-controls">
                      <button
                        onClick={() => setReadingSpeed(0.5)}
                        className={`umrah-speed-btn ${readingSpeed === 0.5 ? 'active' : ''}`}
                      >
                        {t.slow}
                      </button>
                      <button
                        onClick={() => setReadingSpeed(0.8)}
                        className={`umrah-speed-btn ${readingSpeed === 0.8 ? 'active' : ''}`}
                      >
                        {t.normal}
                      </button>
                      <button
                        onClick={() => setReadingSpeed(1.2)}
                        className={`umrah-speed-btn ${readingSpeed === 1.2 ? 'active' : ''}`}
                      >
                        {t.fast}
                      </button>
                    </div>
                  </div>

                  {(isReading || isPaused) && (
                    <div className="umrah-setting-group">
                      <button
                        onClick={togglePauseResume}
                        className="umrah-pause-btn"
                      >
                        {isPaused ? <Play className="umrah-toggle-icon" /> : <Pause className="umrah-toggle-icon" />}
                        {isPaused ? t.resumeReading : t.pauseReading}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Visual Settings */}
            <div className="umrah-setting-section">
              <div className="umrah-section-title">
                <ZoomIn className="umrah-icon-visual" />
                <span>{t.visualSettings}</span>
              </div>
              
              <div className="umrah-setting-group">
                <label className="umrah-setting-label">{t.fontSize}</label>
                <div className="umrah-font-controls">
                  <button
                    onClick={decreaseFontSize}
                    className="umrah-font-btn"
                    aria-label={t.decrease}
                  >
                    <ZoomOut className="umrah-icon-zoom" />
                  </button>
                  <span className="umrah-font-size-display">{fontSize}px</span>
                  <button
                    onClick={increaseFontSize}
                    className="umrah-font-btn"
                    aria-label={t.increase}
                  >
                    <ZoomIn className="umrah-icon-zoom" />
                  </button>
                </div>
              </div>
            </div>

            {/* Greeting Settings */}
            <div className="umrah-setting-section">
              <div className="umrah-section-title">
                <Volume2 className="umrah-icon-greeting" />
                <span>{t.greetingSettings}</span>
              </div>
              
              <div className="umrah-setting-group">
                <div className="umrah-greeting-buttons">
                  <button
                    onClick={() => speakText(t.greetingText)}
                    className="umrah-greeting-button umrah-play-greeting"
                  >
                    <Play className="umrah-toggle-icon" />
                    {t.playGreeting}
                  </button>
                </div>
                
                <div className="umrah-greeting-preview">
                  <p className="umrah-greeting-text">
                    {t.greetingText.length > 100 
                      ? `${t.greetingText.substring(0, 100)}...` 
                      : t.greetingText
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetSettings}
              className="umrah-reset-button"
            >
              <RotateCcw className="umrah-icon-reset" />
              {t.reset}
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Button - Tanpa navigasi kiri/kanan */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`umrah-accessibility-toggle ${isOpen ? 'umrah-toggle-open' : ''}`}
        aria-label={isOpen ? t.close : t.accessibility}
      >
        <Accessibility className="umrah-toggle-main-icon" />
      </button>
    </>
  );
};

export default AccessibilityPanel;