import React, { useState, useEffect } from 'react';
import { Calculator, Calendar, TrendingUp, Users, Clock, DollarSign, Target, CheckCircle, Star, MessageCircle, Plane, Hotel, Menu, X } from 'lucide-react';

interface TabunganData {
  targetBiaya: number;
  tabunganAwal: number;
  tabunganBulanan: number;
  targetWaktu: number;
  jenisUmrah: string;
}

interface HasilSimulasi {
  totalTabungan: number;
  waktuCapai: number;
  kekurangan: number;
  rekomendasi: string;
  jadwalTabungan: Array<{
    bulan: number;
    setoran: number;
    saldo: number;
    progress: number;
    tambahan: number;
    totalSetelahTambahan: number;
  }>;
}

interface PaketUmrah {
  title: string;
  category: string;
  airline: string;
  airport: string;
  airportCode: string;
  price: string;
  rawPrice: number;
  hotelMakkah: string;
  hotelMadinah: string;
  type: string;
  departureDate: string;
  seatAvailable: string;
  image: string;
  hotelMakkahRating: string;
  hotelMadinahRating: string;
}

interface TabunganUmrahSimulatorProps {
  umrahPackages?: any[][];
}

const TabunganUmrahSimulator: React.FC<TabunganUmrahSimulatorProps> = ({ umrahPackages = [] }) => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'paket' | 'tips'>('simulator');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState<TabunganData>({
    targetBiaya: 30000000,
    tabunganAwal: 0,
    tabunganBulanan: 1000000,
    targetWaktu:24,
    jenisUmrah: 'reguler'
  });
  const [hasil, setHasil] = useState<HasilSimulasi | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Convert backend data format to frontend format
  const paketUmrah: PaketUmrah[] = umrahPackages.map(pkg => ({
    title: pkg[0] || 'PAKET UMRAH',
    category: pkg[1] || 'Paket Umrah Reguler',
    airline: pkg[2] || 'Airline',
    airport: pkg[3] || 'Airport',
    airportCode: pkg[4] || 'Airport Code',
    price: pkg[5] || 'IDR 0',
    rawPrice: pkg[12] || 0,
    hotelMakkah: pkg[6] || 'Hotel Makkah',
    hotelMadinah: pkg[7] || 'Hotel Madinah',
    type: pkg[8] || 'Umrah Reguler',
    departureDate: pkg[9] || '',
    seatAvailable: pkg[10] || '0 Seat Tersedia',
    image: pkg[11] || '/img/no-image.jpg',
    hotelMakkahRating: pkg[14] || '4',
    hotelMadinahRating: pkg[20] || '4'
  }));

  // Filter paket berdasarkan budget hasil simulasi
  const getFilteredPackages = (): PaketUmrah[] => {
    if (!hasil) return [];
    
    const budget = hasil.totalTabungan;
    const tolerance = budget * 0.1;
    
    return paketUmrah.filter(paket => {
      const hargaPaket = paket.rawPrice;
      return hargaPaket <= (budget + tolerance) && hargaPaket >= (budget - tolerance * 2);
    }).sort((a, b) => {
      const selisihA = Math.abs(a.rawPrice - budget);
      const selisihB = Math.abs(b.rawPrice - budget);
      return selisihA - selisihB;
    });
  };

  const filteredPackages = getFilteredPackages();

  const formatRupiah = (angka: number): string => {
    return `Rp ${angka.toLocaleString('id-ID')}`;
  };

  const hitungSimulasi = (): void => {
    const { targetBiaya, tabunganAwal, tabunganBulanan, targetWaktu } = formData;
    
    let saldoSaatIni = tabunganAwal;
    const jadwalTabungan = [];
    
    const totalTabungan = tabunganAwal + (tabunganBulanan * targetWaktu);
    const kekurangan = Math.max(0, targetBiaya - totalTabungan);
    const tambahanPerBulan = kekurangan > 0 ? Math.ceil(kekurangan / targetWaktu) : 0;
    
    for (let bulan = 1; bulan <= targetWaktu; bulan++) {
      saldoSaatIni += tabunganBulanan;
      const totalSetelahTambahan = saldoSaatIni + (tambahanPerBulan * bulan);
      const progress = (saldoSaatIni / targetBiaya) * 100;
      
      jadwalTabungan.push({
        bulan,
        setoran: tabunganBulanan,
        saldo: saldoSaatIni,
        progress: Math.min(progress, 100),
        tambahan: tambahanPerBulan,
        totalSetelahTambahan: totalSetelahTambahan
      });
    }

    const waktuCapai = kekurangan === 0 ? 
      Math.ceil((targetBiaya - tabunganAwal) / tabunganBulanan) : 
      targetWaktu;

    let rekomendasi = "";
    if (kekurangan > 0) {
      rekomendasi = `Tambahkan ${formatRupiah(tambahanPerBulan)} per bulan untuk mencapai target tepat waktu.`;
    } else {
      rekomendasi = "Target Anda realistis dan dapat dicapai tepat waktu!";
    }

    setHasil({
      totalTabungan,
      waktuCapai,
      kekurangan,
      rekomendasi,
      jadwalTabungan
    });
  };

  useEffect(() => {
    hitungSimulasi();
  }, [formData]);

  const handleInputChange = (field: keyof TabunganData, value: number | string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaketChange = (harga: number, nama: string): void => {
    setFormData(prev => ({
      ...prev,
      targetBiaya: harga,
      jenisUmrah: nama.toLowerCase().replace(' ', '_')
    }));
    setActiveTab('simulator');
  };

  const handleWhatsAppContact = (paket: PaketUmrah): void => {
    const message = `Halo, saya tertarik dengan ${paket.title} seharga ${paket.price}. Mohon informasi lebih lanjut.`;
    const whatsappUrl = `https://wa.me/628821517812?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const TabButton = ({ tab, icon: Icon, label }: { tab: string, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveTab(tab as any);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
        activeTab === tab
          ? 'bg-[#222636] text-white shadow-md'
          : 'text-gray-600 hover:text-[#222636] hover:bg-[#F1F2F6]'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#222636] rounded-lg flex items-center justify-center">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Kalkulator Tabungan Umrah</h1>
                <p className="text-sm text-gray-600 hidden sm:block">Rencanakan perjalanan suci Anda dengan mudah</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <TabButton tab="simulator" icon={Calculator} label="Simulator" />
              <TabButton tab="paket" icon={Users} label="Paket Umrah" />
              <TabButton tab="tips" icon={TrendingUp} label="Tips Menabung" />
            </nav>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t flex flex-col gap-2">
              <TabButton tab="simulator" icon={Calculator} label="Simulator" />
              <TabButton tab="paket" icon={Users} label="Paket Umrah" />
              <TabButton tab="tips" icon={TrendingUp} label="Tips Menabung" />
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Simulator Tab */}
        {activeTab === 'simulator' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Form Input */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-[#E3E6F0] rounded-lg">
                  <Calculator className="h-6 w-6 text-[#222636]" />
                </div>
                Kalkulator Tabungan
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Target Biaya Umrah
                  </label>
                  <input
                    type="number"
                    value={formData.targetBiaya}
                    onChange={(e) => handleInputChange('targetBiaya', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-[#2a3d66] mt-1 font-medium">{formatRupiah(formData.targetBiaya)}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tabungan Awal
                  </label>
                  <input
                    type="number"
                    value={formData.tabunganAwal}
                    onChange={(e) => handleInputChange('tabunganAwal', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                  <p className="text-sm text-[#2a3d66] mt-1 font-medium">{formatRupiah(formData.tabunganAwal)}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tabungan per Bulan
                  </label>
                  <input
                    type="number"
                    value={formData.tabunganBulanan}
                    onChange={(e) => handleInputChange('tabunganBulanan', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1000000"
                  />
                  <p className="text-sm text-[#2a3d66] mt-1 font-medium">{formatRupiah(formData.tabunganBulanan)}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Target Waktu (Bulan)
                  </label>
                  <input
                    type="number"
                    value={formData.targetWaktu}
                    onChange={(e) => handleInputChange('targetWaktu', parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="24"
                    min="1"
                  />
                  <p className="text-sm text-[#2a3d66] mt-1 font-medium">
                    {formData.targetWaktu} bulan ({Math.round(formData.targetWaktu / 12 * 10) / 10} tahun)
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-left">*Silahkan sesuaikan dengan keuangan anda</p>
            </div>

            {/* Hasil Simulasi */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-[#E3E6F0] rounded-lg">
                  <Target className="h-6 w-6 text-[#222636]" />
                </div>
                Hasil Simulasi
              </h2>

              {hasil && (
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Progress Target</span>
                      <span className="text-lg font-bold text-[#222636]">
                        {Math.round((hasil.totalTabungan / formData.targetBiaya) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-[#222636] to-[#2a3d66] h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((hasil.totalTabungan / formData.targetBiaya) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Statistik */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#F1F2F6] border border-[#D1D3E2] p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-[#222636]" />
                        <span className="font-semibold text-gray-700">Total Tabungan</span>
                      </div>
                      <p className="text-xl font-bold text-[#222636]">{formatRupiah(hasil.totalTabungan)}</p>
                    </div>

                    <div className="bg-[#F1F2F6] border border-[#D1D3E2] p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-[#222636]" />
                        <span className="font-semibold text-gray-700">Waktu Capai</span>
                      </div>
                      <p className="text-xl font-bold text-[#222636]">{hasil.waktuCapai} bulan</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className={`p-4 rounded-lg border ${
                    hasil.kekurangan === 0 
                      ? 'bg-[#F1F2F6] border-[#D1D3E2]' 
                      : 'bg-orange-50 border-orange-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {hasil.kekurangan === 0 ? (
                        <CheckCircle className="h-5 w-5 text-[#222636]" />
                      ) : (
                        <Target className="h-5 w-5 text-orange-600" />
                      )}
                      <span className="font-semibold text-gray-900">
                        {hasil.kekurangan === 0 ? 'Target Tercapai!' : 'Perlu Penyesuaian'}
                      </span>
                    </div>
                    {hasil.kekurangan > 0 && (
                      <p className="text-orange-600 font-semibold mb-2">
                        Kekurangan: {formatRupiah(hasil.kekurangan)}
                      </p>
                    )}
                    <p className="text-gray-700">{hasil.rekomendasi}</p>
                  </div>

                  {/* Tombol Detail */}
                  <button
                    onClick={() => setShowDetail(!showDetail)}
                    className="w-full bg-[#222636] hover:bg-[#2E3650] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    {showDetail ? 'Sembunyikan' : 'Lihat'} Jadwal Detail
                  </button>

                  {/* Detail Jadwal - Mobile Optimized */}
                  {showDetail && (
                    <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto">
                      <h3 className="font-semibold text-gray-900 mb-4">Jadwal Tabungan Bulanan</h3>
                      <div className="space-y-3">
                        {hasil.jadwalTabungan.slice(0, 12).map((item, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-semibold text-gray-900">Bulan {item.bulan}</span>
                                <div className="text-sm text-gray-600">
                                  Setoran: {formatRupiah(item.setoran)}
                                </div>
                                {item.tambahan > 0 && (
                                  <div className="text-sm text-orange-600">
                                    Tambahan: {formatRupiah(item.tambahan)}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-gray-900">{formatRupiah(item.saldo)}</div>
                                <div className="text-[#222636] text-sm">{item.progress.toFixed(1)}%</div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {hasil.jadwalTabungan.length > 12 && (
                          <div className="text-center text-gray-500 text-sm">
                            Dan {hasil.jadwalTabungan.length - 12} bulan lainnya...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Paket Umrah Tab */}
        {activeTab === 'paket' && (
          <div className="space-y-6">
            {/* Budget Info */}
            {hasil && (
              <div className="bg-[#F1F2F6] border-[#D1D3E2] rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6 text-[#222636]" />
                  Rekomendasi Paket Sesuai Budget
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{formatRupiah(hasil.totalTabungan)}</div>
                    <div className="text-gray-600">Total Budget</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{hasil.waktuCapai} Bulan</div>
                    <div className="text-gray-600">Waktu Pencapaian</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{filteredPackages.length}</div>
                    <div className="text-gray-600">Paket Tersedia</div>
                  </div>
                </div>
              </div>
            )}

            {/* Paket Cards - Mobile Optimized */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hasil ? (
                filteredPackages.length > 0 ? filteredPackages.map((paket, index) => {
                  const selisihBudget = hasil.totalTabungan - paket.rawPrice;
                  const isAffordable = selisihBudget >= 0;
                  
                  return (
                    <div key={index} className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 border-2 ${
                      isAffordable ? 'border-[#D1D3E2]' : 'border-orange-200'
                    }`}>
                      <div className="relative">
                        <img 
                          src={paket.image} 
                          alt={paket.title}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/img/no-image.jpg';
                          }}
                        />
                        <div className="absolute top-3 right-3 bg-[#222636] text-white px-3 py-1 rounded-full text-sm font-medium">
                          {paket.seatAvailable}
                        </div>
                        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-medium ${
                          isAffordable 
                            ? 'bg-[#222636] text-white' 
                            : 'bg-orange-500 text-white'
                        }`}>
                          {isAffordable ? '✓ Sesuai Budget' : '⚠ Perlu Tambahan'}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{paket.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{paket.category}</p>
                        <p className="text-gray-600 text-sm mb-4 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {paket.departureDate}
                        </p>

                        <div className="text-center mb-4">
                          <div className="text-2xl font-bold text-gray-900">{paket.price}</div>
                          <div className="text-gray-600 text-sm">per orang</div>
                          {!isAffordable && (
                            <div className="text-sm text-orange-600 font-medium mt-1 bg-orange-100 px-2 py-1 rounded">
                              Kurang: {formatRupiah(Math.abs(selisihBudget))}
                            </div>
                          )}
                          {isAffordable && selisihBudget > 0 && (
                            <div className="text-sm text-[#222636] font-medium mt-1 bg-[#F1F2F6] px-2 py-1 rounded">
                              Sisa: {formatRupiah(selisihBudget)}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Plane className="h-4 w-4 text-[#222636]" />
                            <span>{paket.airline}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Hotel className="h-4 w-4 text-[#222636] mt-0.5" />
                            <div>
                              <div>Makkah: {paket.hotelMakkah} ({paket.hotelMakkahRating}⭐)</div>
                              <div>Madinah: {paket.hotelMadinah} ({paket.hotelMadinahRating}⭐)</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <button
                            onClick={() => handlePaketChange(paket.rawPrice, paket.title)}
                            className={`w-full font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${
                              isAffordable
                                ? 'bg-[#222636] hover:bg-[#2E3650] text-white'
                                : 'bg-orange-500 hover:bg-orange-600 text-white'
                            }`}
                          >
                            {isAffordable ? 'Pilih Paket Ini' : 'Hitung Ulang Budget'}
                          </button>
                          
                          <button
                            onClick={() => handleWhatsAppContact(paket)}
                            className="w-full bg-[#222636] hover:bg-[#2E3650] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Hubungi Kami
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="col-span-full text-center py-12">
                    <div className="bg-white rounded-xl p-8 shadow-md">
                      <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak Ada Paket Yang Sesuai</h3>
                      <p className="text-gray-600 mb-4">Silakan sesuaikan budget atau waktu tabungan Anda</p>
                      <button
                        onClick={() => setActiveTab('simulator')}
                        className="bg-[#222636] hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Kembali ke Simulator
                      </button>
                    </div>
                  </div>
                )
              ) : (
                paketUmrah.slice(0, 6).map((paket, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className="relative">
                      <img 
                        src={paket.image} 
                        alt={paket.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/img/no-image.jpg';
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-[#222636] text-white px-3 py-1 rounded-full text-sm font-medium">
                        {paket.seatAvailable}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{paket.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{paket.category}</p>
                      <p className="text-gray-600 text-sm mb-4 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {paket.departureDate}
                      </p>

                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-gray-900">{paket.price}</div>
                        <div className="text-gray-600 text-sm">per orang</div>
                      </div>
                      
                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-[#222636]" />
                          <span>{paket.airline}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Hotel className="h-4 w-4 text-[#222636] mt-0.5" />
                          <div>
                            <div>Makkah: {paket.hotelMakkah} ({paket.hotelMakkahRating}⭐)</div>
                            <div>Madinah: {paket.hotelMadinah} ({paket.hotelMadinahRating}⭐)</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <button
                          onClick={() => handlePaketChange(paket.rawPrice, paket.title)}
                          className="w-full bg-[#222636] hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                          Pilih Paket Ini
                        </button>
                        
                        <button
                          onClick={() => handleWhatsAppContact(paket)}
                          className="w-full bg-[#222636] hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Hubungi Kami
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                Tips Menabung untuk Umrah
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-600 rounded-lg text-white font-bold text-sm">1</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Buat Target yang Realistis</h3>
                        <p className="text-gray-600 text-sm">
                          Tentukan target yang sesuai dengan kemampuan finansial Anda. Mulai dengan jumlah kecil dan tingkatkan secara bertahap.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-600 rounded-lg text-white font-bold text-sm">2</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Otomatisasi Tabungan</h3>
                        <p className="text-gray-600 text-sm">
                          Gunakan autodebet atau transfer otomatis ke rekening khusus umrah untuk memastikan konsistensi menabung.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-600 rounded-lg text-white font-bold text-sm">3</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Kurangi Pengeluaran Non-Esensial</h3>
                        <p className="text-gray-600 text-sm">
                          Evaluasi pengeluaran bulanan dan alihkan dana dari kebutuhan sekunder ke tabungan umrah.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-600 rounded-lg text-white font-bold text-sm">4</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Manfaatkan Penghasilan Tambahan</h3>
                        <p className="text-gray-600 text-sm">
                          Gunakan bonus kerja, THR, atau penghasilan dari usaha sampingan untuk mempercepat pencapaian target.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-600 rounded-lg text-white font-bold text-sm">5</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Investasi Halal</h3>
                        <p className="text-gray-600 text-sm">
                          Pertimbangkan investasi syariah seperti deposito syariah atau reksa dana syariah untuk mengembangkan tabungan.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-indigo-600 rounded-lg text-white font-bold text-sm">6</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Bergabung dengan Arisan Umrah</h3>
                        <p className="text-gray-600 text-sm">
                          Ikuti program arisan umrah di komunitas atau tempat ibadah untuk mempermudah pembayaran secara cicilan.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-teal-600 rounded-lg text-white font-bold text-sm">7</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Pantau Progress Secara Rutin</h3>
                        <p className="text-gray-600 text-sm">
                          Evaluasi perkembangan tabungan setiap bulan dan sesuaikan strategi jika diperlukan.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow-600 rounded-lg text-white font-bold text-sm">8</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Doa dan Istiqamah</h3>
                        <p className="text-gray-600 text-sm">
                          Selalu berdoa dan istiqamah dalam menjalankan rencana tabungan. Allah SWT akan memudahkan jalan bagi hamba-Nya yang berusaha.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote Inspiratif */}
              <div className="mt-8 bg-gradient-to-r from-[#222636] to-[#2a3d66] text-white rounded-xl p-6 text-center">
                <div className="mb-4">
                  <Star className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="text-xl font-bold">Doa untuk Kemudahan Rezeki</h3>
                </div>
                <blockquote className="text-white/90 text-lg italic mb-4">
                  "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ"
                </blockquote>
                <blockquote className="text-lg italic mb-4">
                  "Ya Allah, cukupkanlah aku dengan rezeki yang halal, sehingga aku tidak memerlukan yang haram, 
                  dan kayakanlah aku dengan karunia-Mu, sehingga aku tidak memerlukan bantuan orang lain selain Engkau."
                </blockquote>
                {/* <cite className="text-sm opacity-80">- QS. Al-Baqarah: 197</cite> */}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TabunganUmrahSimulator;