import { Rating, Star } from "@smastrom/react-rating";
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface Hotel {
  id?: number;
  name: string;
  city: string;
  rating: string;
  location: string;
  latitude?: string;
  longitude?: string;
  description?: string;
}

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  post?: Hotel | null;
}

// Memperbaiki masalah icon default Leaflet
// delete (L.Icon.Default.prototype as any)._getIconUrl;
delete ((L.Icon.Default.prototype as unknown) as Record<string, unknown>)["_getIconUrl"];
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Definisi tipe untuk RatingInfo
interface RatingInfo {
  label: string;
  color: string;
}

// Definisi warna dan keterangan untuk setiap tingkat rating dengan tipe yang tepat
const ratingLabels: Record<string, RatingInfo> = {
  "1": { label: "Buruk", color: "#FF5252" },
  "2": { label: "Kurang", color: "#FF9800" },
  "3": { label: "Cukup", color: "#FFC107" },
  "4": { label: "Sangat Baik", color: "#8BC34A" },
  "5": { label: "Luar Biasa", color: "#4CAF50" }
};

// Komponen untuk event handling peta
function MapEventHandler({ onMapClick, searchPosition, setSearchPosition }: { 
  onMapClick: (lat: number, lng: number) => void, 
  searchPosition: [number, number] | null,
  setSearchPosition: (position: [number, number] | null) => void
}) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
      setSearchPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return searchPosition ? <Marker position={searchPosition} /> : null;
}

export default function PackageTypeFormModal({ isOpen, closeModal, post }: Props) {
  const [formData, setFormData] = useState<Hotel>({
    name: "",
    city: "",
    rating: "",
    location: "",
    latitude: "",
    longitude: "",
    description: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPosition, setSearchPosition] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.200000, 106.816666]);
  const [ratingValue, setRatingValue] = useState<number>(0);

  // Mendapatkan label dan warna berdasarkan rating saat ini
  const getCurrentRating = () => {
    const roundedRating = Math.round(ratingValue);
    return roundedRating > 0 ? ratingLabels[roundedRating.toString()] : null;
  };
  
  const currentRating = getCurrentRating();

  useEffect(() => {
    if (post) {
      setFormData({
        name: post.name,
        city: post.city,
        rating: post.rating,
        location: post.location,
        latitude: post.latitude || "",
        longitude: post.longitude || "",
        description: post.description || "",
      });

      // Set nilai rating jika ada
      if (post.rating) {
        setRatingValue(parseFloat(post.rating));
      }

      // Jika post memiliki latitude dan longitude, set marker dan center map
      if (post.latitude && post.longitude) {
        const lat = parseFloat(post.latitude);
        const lng = parseFloat(post.longitude);
        setSearchPosition([lat, lng]);
        setMapCenter([lat, lng]);
      }
    } else {
      setFormData({ 
        name: "", 
        city: "",
        rating: "", 
        location: "", 
        latitude: "", 
        longitude: "", 
        description: "", 
      });
      setRatingValue(0);
      setSearchPosition(null);
      setMapCenter([-6.200000, 106.816666]); // Reset ke default center
    }
    setErrors({});
    setSearchTerm("");
  }, [post, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle perubahan pada rating (hanya nilai bulat 1-5)
  const handleRatingChange = (newRating: number) => {
    // Pastikan rating selalu berupa bilangan bulat
    const roundedRating = Math.round(newRating);
    setRatingValue(roundedRating);
    setFormData({ ...formData, rating: roundedRating.toString() });
  };

  // Handle perubahan manual pada input rating
  const handleRatingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    
    // Validasi input agar tetap dalam rentang 0-5, hanya bilangan bulat
    if (!isNaN(value) && value >= 0 && value <= 5) {
      const roundedValue = Math.round(value); // Pembulatan ke bilangan bulat
      setRatingValue(roundedValue);
      setFormData({ ...formData, rating: roundedValue.toString() });
    } else if (e.target.value === "") {
      setRatingValue(0);
      setFormData({ ...formData, rating: "" });
    }
  };

  // Kustomisasi style untuk rating bintang berdasarkan nilai rating saat ini
  const customRatingStyles = {
    itemShapes: Star,
    activeFillColor: currentRating?.color || "#FFC107",
    inactiveFillColor: "#f0f0f0"
  };

  // Handle click pada peta
  const handleMapClick = (lat: number, lng: number) => {
    setFormData({
      ...formData,
      latitude: lat.toString(),
      longitude: lng.toString(),
    });
      
    // Reverse geocoding menggunakan Nominatim (OpenStreetMap) dengan addressdetails=1
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          const locationName = data.display_name;
          let cityName = '';
              
          // Gunakan struktur address yang lebih detail dari Nominatim
          if (data.address) {
            // Prioritas pencarian kota dengan urutan dari yang paling kota hingga yang kurang menggambarkan kota
            const possibleCityFields = [
              'city',           // Kota besar
              'town',           // Kota kecil/sedang
              'municipality',   // Kotamadya
              'city_district',  // Distrik kota
              'borough',        // Kota kecil (US)
              'suburb',         // Pinggiran kota
              'district',       // Distrik
              'county',         // Kabupaten
              'state_district', // Distrik negara bagian
              'region',         // Region
              'state'           // Negara bagian/provinsi
            ];
            
            // Cari nilai kota dari properti yang ada
            for (const field of possibleCityFields) {
              if (data.address[field]) {
                cityName = data.address[field];
                break; // Ambil yang pertama ditemukan sesuai prioritas
              }
            }
            
            // Log untuk debugging struktur address
            console.log("Struktur alamat dari Nominatim:", data.address);
            console.log("Nama kota yang dipilih:", cityName);
          }
              
          setFormData(prev => ({
            ...prev,
            location: locationName,
            city: cityName || 'Kota tidak diketahui', // Default value jika tidak ditemukan
          }));
          setSearchTerm(locationName);
        }
      })
      .catch(error => {
        console.error("Error saat reverse geocoding:", error);
      });
  };

  // Mencari lokasi berdasarkan input
  const searchLocation = () => {
    if (searchTerm) {
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTerm)}&format=json&limit=1`)
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);
            
            setSearchPosition([lat, lng]);
            setMapCenter([lat, lng]);
            
            const locationName = data[0].display_name;
            
            // Gunakan logika yang sama untuk mendapatkan nama kota dari lokasi
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`)
              .then(response => response.json())
              .then(data => {
                if (data && data.address) {
                  let cityName = '';
                  
                  // Prioritas pencarian kota
                  const possibleCityFields = [
                    'city', 'town', 'municipality', 'city_district', 
                    'borough', 'suburb', 'district', 'county', 
                    'state_district', 'region', 'state'
                  ];
                  
                  // Cari nilai kota dari properti yang ada
                  for (const field of possibleCityFields) {
                    if (data.address[field]) {
                      cityName = data.address[field];
                      break;
                    }
                  }
                  
                  setFormData({
                    ...formData,
                    location: locationName,
                    latitude: lat.toString(),
                    longitude: lng.toString(),
                    city: cityName || 'Kota tidak diketahui',
                  });
                } else {
                  setFormData({
                    ...formData,
                    location: locationName,
                    latitude: lat.toString(),
                    longitude: lng.toString(),
                  });
                }
              })
              .catch(error => {
                console.error("Error saat mendapatkan detail kota:", error);
                
                // Fallback jika reverse geocoding gagal
                setFormData({
                  ...formData,
                  location: locationName,
                  latitude: lat.toString(),
                  longitude: lng.toString(),
                });
              });
          } else {
            toast.error("Lokasi tidak ditemukan, coba kata kunci lain!");
          }
        })
        .catch(error => {
          console.error("Error saat pencarian lokasi:", error);
          toast.error("Terjadi kesalahan saat mencari lokasi!");
        });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("city", formData.city);
    data.append("rating", formData.rating);
    data.append("location", formData.location);

    // Tambahkan latitude dan longitude ke form data
    if (formData.latitude) {
      data.append("latitude", formData.latitude);
    }
    
    if (formData.longitude) {
      data.append("longitude", formData.longitude);
    }

    // Description is optional, only append if it has value
    if (formData.description) {
      data.append("description", formData.description);
    }

    const url = post?.id ? `hotel/${post.id}` : "hotel";

    if (post?.id) {
      data.append("_method", "PUT");
    }

    router.post(url, data, {
      onSuccess: () => {
        setFormData({ name: "", city: "", rating: "", location: "", latitude: "", longitude: "", description: "" });
        setRatingValue(0);
        closeModal();
        toast.success(post?.id ? "Berhasil mengubah data!" : "Berhasil menambah data!");
        setIsSubmitting(false);
        router.reload();
      },
      onError: (errors) => {
        const formattedErrors: Record<string, string[]> = {};

        for (const key in errors) {
          if (Array.isArray(errors[key])) {
            formattedErrors[key] = errors[key];
          } else if (typeof errors[key] === "string") {
            formattedErrors[key] = [errors[key]];
          }
        }
        
        setErrors(formattedErrors);
        toast.error(post?.id ? "Gagal mengubah data!" : "Gagal menambah data!");
        console.error(errors.message || "Failed to submit data.");
        setIsSubmitting(false);
      },
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => !isSubmitting && closeModal()} modal={true}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-6 pt-9">
        <DialogHeader className="pb-2">
          <DialogTitle>{post ? "Edit Hotel" : "Add Hotel"}</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-grow pr-1">
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Hotel <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Contoh: Makkah Clock Royal Tower - A Fairmont Hotel"
                  required
                  disabled={isSubmitting}
                />
                {errors?.name && (
                  <p className="text-sm text-red-600 mt-1">
                    {Array.isArray(errors.name) ? errors.name[0] : errors.name}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Kota/City <span className="text-gray-400">(otomatis)</span></label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  className="w-full border rounded px-3 py-2 bg-gray-50"
                  placeholder="Kota akan diisi otomatis dari lokasi"
                  readOnly
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">Kota akan diambil otomatis dari lokasi</p>
                {errors?.city && (
                  <p className="text-sm text-red-600 mt-1">
                    {Array.isArray(errors.city) ? errors.city[0] : errors.city}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Rating Hotel <span className="text-red-500">*</span></label>
              <div className="flex items-center space-x-4">
                <div className="flex-grow">
                  <Rating
                    style={{ maxWidth: 200 }}
                    value={ratingValue}
                    onChange={handleRatingChange}
                    itemStyles={customRatingStyles}
                    transition="position"
                    readOnly={false}
                  />
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleRatingInputChange}
                    min="0"
                    max="5"
                    step="1"
                    className="w-full border rounded px-3 py-2"
                    placeholder="0.0"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              {/* Keterangan rating */}
              {currentRating && (
                <div className="flex items-center mt-2">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: currentRating.color }}
                  ></div>
                  <span className="text-sm font-medium">{currentRating.label}</span>
                </div>
              )}
              
              {/* Legenda rating */}
              <div className="mt-2 bg-gray-50 p-2 rounded text-xs">
                <div className="grid grid-cols-5 gap-1">
                  {Object.entries(ratingLabels).map(([rating, { label, color }]) => (
                    <div key={rating} className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: color }}></div>
                      <div className="font-medium">{rating}</div>
                      <div className="text-center text-xs">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {errors?.rating && (
                <p className="text-sm text-red-600 mt-1">
                  {Array.isArray(errors.rating) ? errors.rating[0] : errors.rating}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Lokasi <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="location"
                  value={searchTerm || formData.location}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Cari lokasi atau klik pada peta"
                  required
                  disabled={isSubmitting}
                />
                <Button 
                  type="button"
                  variant="secondary"
                  onClick={searchLocation}
                >
                  Cari
                </Button>
              </div>
              {errors?.location && (
                <p className="text-sm text-red-600 mt-1">
                  {Array.isArray(errors.location) ? errors.location[0] : errors.location}
                </p>
              )}
            </div>
            
            {/* Komponen Leaflet Map dengan tinggi yang lebih kecil */}
            <div className="border rounded p-1">
              <div style={{ height: "250px", width: "100%" }}>
                {typeof window !== "undefined" && (
                  <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={false}
                    key={`${mapCenter[0]}-${mapCenter[1]}`}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapEventHandler 
                      onMapClick={handleMapClick}
                      searchPosition={searchPosition}
                      setSearchPosition={setSearchPosition}
                    />
                  </MapContainer>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Klik pada peta untuk menandai lokasi</p>
            </div>
            
            {/* Hidden input untuk menyimpan koordinat */}
            <input type="hidden" name="latitude" value={formData.latitude || ""} />
            <input type="hidden" name="longitude" value={formData.longitude || ""} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Deskripsi <span className="text-gray-400">(opsional)</span></label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Masukkan deskripsi hotel (opsional)"
                  rows={3}
                  disabled={isSubmitting}
                ></textarea>
                {errors?.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {Array.isArray(errors.description) ? errors.description[0] : errors.description}
                  </p>
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