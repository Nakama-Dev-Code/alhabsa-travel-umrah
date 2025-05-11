import { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SelectValue, SelectTrigger, SelectContent, SelectItem, Select } from "@/components/ui/select";

interface Package {
  id: number;
  title: string;
}

interface Hotel {
    id: number;
    name: string;
}

interface Airport {
    id: number;
    name: string;
}

interface Airlines {
    id: number;
    name: string;
}

interface PackageSchedule {
  id?: number;
  package_id: number;
  hotel_makkah_id: number;
  hotel_madinah_id: number;
  airport_id: number;
  airline_id: number;
  departure_date: string;
  price: number;
  seat_available: number;
}

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  post?: PackageSchedule | null;
  packages: Package[];
  hotels: Hotel[];
  airports: Airport[];
  airlines: Airlines[];
}

export default function PackageScheduleFormModal({ isOpen, closeModal, post, packages, hotels, airports, airlines }: Props) {
  const [formData, setFormData] = useState<PackageSchedule>(() => {
    // Cari hotel Makkah default
    const defaultMakkahHotel = hotels.find(hotel => 
      /makkah|mekah|mekkah|mecca|makkah al-mukarramah/i.test(hotel.name)
    );

    // Cari hotel Madinah default
    const defaultMadinahHotel = hotels.find(hotel => 
      /madinah|medina|madina|medinah/i.test(hotel.name)
    );

    return {
      package_id: post?.package_id || (packages.length > 0 ? packages[0].id : 0),
      hotel_makkah_id: post?.hotel_makkah_id || (defaultMakkahHotel?.id || 0),
      hotel_madinah_id: post?.hotel_madinah_id || (defaultMadinahHotel?.id || 0),
      airport_id: post?.airport_id || (airports.length > 0 ? airports[0].id : 0),
      airline_id: post?.airline_id || (airlines.length > 0 ? airlines[0].id : 0),
      departure_date: post?.departure_date || "",
      price: post?.price || 0,
      seat_available: post?.seat_available || 0,
    };
  });

  const { errors } = usePage().props as { errors: Record<string, string> };
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        package_id: post.package_id,
        hotel_makkah_id: post.hotel_makkah_id,
        hotel_madinah_id: post.hotel_madinah_id,
        airport_id: post.airport_id,
        airline_id: post.airline_id,
        departure_date: post.departure_date,
        price: post.price,
        seat_available: post.seat_available,
      });
    } else {
      // Cari hotel Makkah default
      const defaultMakkahHotel = hotels.find(hotel => 
        /makkah|mekah|mekkah|mecca|makkah al-mukarramah/i.test(hotel.name)
      );
      
      // Cari hotel Madinah default
      const defaultMadinahHotel = hotels.find(hotel => 
        /madinah|medina|madina|medinah/i.test(hotel.name)
      );

      setFormData({ 
        package_id: packages.length > 0 ? packages[0].id : 0,
        hotel_makkah_id: defaultMakkahHotel?.id || 0,
        hotel_madinah_id: defaultMadinahHotel?.id || 0,
        airport_id: airports.length > 0 ? airports[0].id : 0,
        airline_id: airlines.length > 0 ? airlines[0].id : 0,
        departure_date: "",
        price: 0,
        seat_available: 0
      });
    }
  }, [post, isOpen, packages, hotels, airports, airlines]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData({ ...formData, [field]: parseInt(value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("package_id", formData.package_id.toString());
    data.append("hotel_makkah_id", formData.hotel_makkah_id.toString());
    data.append("hotel_madinah_id", formData.hotel_madinah_id.toString());
    data.append("airport_id", formData.airport_id.toString());
    data.append("airline_id", formData.airline_id.toString());
    data.append("departure_date", formData.departure_date);
    data.append("price", formData.price.toString());
    data.append("seat_available", formData.seat_available.toString());

    const url = post?.id ? `package-schedule/${post.id}` : "package-schedule";

    if (post?.id) {
      data.append("_method", "PUT");
    }
    
    router.post(url, data, {
      onSuccess: () => {
        setFormData({ 
          package_id: packages.length > 0 ? packages[0].id : 0,
          hotel_makkah_id: hotels.length > 0 ? hotels[0].id : 0,
          hotel_madinah_id: hotels.length > 0 ? hotels[0].id : 0,
          airport_id: airports.length > 0 ? airports[0].id : 0,
          airline_id: airlines.length > 0 ? airlines[0].id : 0,
          departure_date: "",
          price: 0,
          seat_available: 0 });
        closeModal();
        toast.success(post?.id ? "Berhasil mengubah data!" : "Berhasil menambah data!");
        setIsSubmitting(false);
        router.reload();
      },
      onError: () => {
        toast.error(post?.id ? "Gagal mengubah data!" : "Gagal menambah data!");
        console.error("Failed to submit data.");
        setIsSubmitting(false);
      },
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
  
    // Hilangkan semua karakter selain angka
    value = value.replace(/\D/g, "");
  
    // Jika kosong, anggap 0
    const numericValue = value ? Number(value) : 0;
  
    setFormData({
      ...formData,
      price: numericValue,
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => !isSubmitting && closeModal()} modal={true}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-6 pt-9">
        <DialogHeader className="pb-2">
          <DialogTitle>{post ? "Edit Jadwal Umrah" : "Tambah Jadwal Umrah"}</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-grow pr-1">
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" encType="multipart/form-data" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Paket <span className="text-red-500">*</span></label>
                <Select
                  value={formData.package_id.toString()}
                  onValueChange={(value) => handleSelectChange(value, "package_id")}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full border rounded px-3 py-2">
                    <SelectValue placeholder="Pilih nama paket" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.package_id && (
                  <p className="text-sm text-red-600 mt-1">{errors.package_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Harga Paket <span className="text-red-500">*</span> </label>
                <input
                  type="text"
                  name="price"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formData.price ? new Intl.NumberFormat("id-ID").format(formData.price) : ""}
                  onChange={handlePriceChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Masukkan harga paket"
                  required
                  disabled={isSubmitting}
                />
                {errors.price && (
                  <p className="text-sm text-red-600 mt-1">{errors.price}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hotel Makkah */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Hotel Makkah <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.hotel_makkah_id?.toString()}
                  onValueChange={(value) => handleSelectChange(value, "hotel_makkah_id")}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full border rounded px-3 py-2">
                    <SelectValue placeholder="Pilih nama hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hotels
                      .filter((hotel: { id: number; name: string }) =>
                        /makkah|mekah|mekkah|mecca|makkah al-mukarramah/i.test(hotel.name)
                      )
                      .map((hotel) => (
                        <SelectItem key={hotel.id} value={hotel.id.toString()}>
                          {hotel.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.hotel_makkah_id && (
                  <p className="text-sm text-red-600 mt-1">{errors.hotel_makkah_id}</p>
                )}
              </div>

              {/* Hotel Madinah */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Hotel Madinah <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.hotel_madinah_id?.toString()}
                  onValueChange={(value) => handleSelectChange(value, "hotel_madinah_id")}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full border rounded px-3 py-2">
                    <SelectValue placeholder="Pilih nama hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hotels
                      .filter((hotel: { id: number; name: string }) =>
                        /madinah|medina|madina|medinah/i.test(hotel.name)
                      )
                      .map((hotel) => (
                        <SelectItem key={hotel.id} value={hotel.id.toString()}>
                          {hotel.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.hotel_madinah_id && (
                  <p className="text-sm text-red-600 mt-1">{errors.hotel_madinah_id}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Airport <span className="text-red-500">*</span></label>
                <Select
                  value={formData.airport_id.toString()}
                  onValueChange={(value) => handleSelectChange(value, "airport_id")}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full border rounded px-3 py-2">
                    <SelectValue placeholder="Pilih nama airport" />
                  </SelectTrigger>
                  <SelectContent>
                    {airports.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.airport_id && (
                  <p className="text-sm text-red-600 mt-1">{errors.airport_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Airline <span className="text-red-500">*</span></label>
                <Select
                  value={formData.airline_id.toString()}
                  onValueChange={(value) => handleSelectChange(value, "airline_id")}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full border rounded px-3 py-2">
                    <SelectValue placeholder="Pilih nama airline" />
                  </SelectTrigger>
                  <SelectContent>
                    {airlines.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.airline_id && (
                  <p className="text-sm text-red-600 mt-1">{errors.airline_id}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
              <label className="block text-sm font-medium mb-1">Tanggal Keberangkatan <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="departure_date"
                  value={formData.departure_date}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                  disabled={isSubmitting}
                />
                {errors.departure_date && (
                  <p className="text-sm text-red-600 mt-1">{errors.departure_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Kursi Tersedia <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="seat_available"
                  min="0"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formData.seat_available}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Masukkan harga paket"
                  required
                  disabled={isSubmitting}
                />
                {errors.seat_available && (
                  <p className="text-sm text-red-600 mt-1">{errors.seat_available}</p>
                )}
              </div>
            </div>

          </form>
        </div>

        <DialogFooter className="mt-4 pt-4 border-t flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={closeModal} disabled={isSubmitting}>
            Batal
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {post ? "Menyimpan..." : "Menambahkan..."}
              </>
            ) : (
              post ? "Simpan Perubahan" : "Simpan Data"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}