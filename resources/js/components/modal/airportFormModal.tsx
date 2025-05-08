import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface Post {
  id?: number;
  name: string;
  code: string;
  location: string;
  latitude?: string;
  longitude?: string;
  description?: string;
  link_website?: string;
}

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  post?: Post | null;
}

// Memperbaiki masalah icon default Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

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
  const [formData, setFormData] = useState<Post>({
    name: "",
    code: "",
    location: "",
    latitude: "",
    longitude: "",
    description: "",
    link_website: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPosition, setSearchPosition] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.200000, 106.816666]); // Default center Indonesia

  useEffect(() => {
    if (post) {
      setFormData({
        name: post.name,
        code: post.code,
        location: post.location,
        latitude: post.latitude || "",
        longitude: post.longitude || "",
        description: post.description || "",
        link_website: post.link_website || "",
      });

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
        code: "", 
        location: "", 
        latitude: "", 
        longitude: "", 
        description: "", 
        link_website: "" 
      });
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

  // Handle click pada peta
  const handleMapClick = (lat: number, lng: number) => {
    setFormData({
      ...formData,
      latitude: lat.toString(),
      longitude: lng.toString(),
    });
    
    // Reverse geocoding menggunakan Nominatim (OpenStreetMap)
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
      .then(response => response.json())
      .then(data => {
        if (data && data.display_name) {
          setFormData(prev => ({
            ...prev,
            location: data.display_name,
          }));
          setSearchTerm(data.display_name);
        }
      })
      .catch(error => {
        console.error("Error during reverse geocoding:", error);
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
            
            setFormData({
              ...formData,
              location: data[0].display_name,
              latitude: lat.toString(),
              longitude: lng.toString(),
            });
          } else {
            toast.error("Lokasi tidak ditemukan, coba kata kunci lain");
          }
        })
        .catch(error => {
          console.error("Error during geocoding:", error);
          toast.error("Terjadi kesalahan saat mencari lokasi");
        });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("code", formData.code);
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
    
    // link_website is optional, only append if it has value
    if (formData.link_website) {
      data.append("link_website", formData.link_website);
    }

    const url = post?.id ? `airport/${post.id}` : "airport";

    if (post?.id) {
      data.append("_method", "PUT");
    }

    router.post(url, data, {
      onSuccess: () => {
        setFormData({ name: "", code: "", location: "", latitude: "", longitude: "", description: "", link_website: "" });
        closeModal();
        toast.success(post?.id ? "Berhasil mengubah data!" : "Berhasil menambah data!");
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
      },
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={closeModal} modal={true}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-6 pt-9">
        <DialogHeader className="pb-2">
          <DialogTitle>{post ? "Edit Airport" : "Add Airport"}</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-grow pr-1">
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Airport <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Contoh: Soekarno-Hatta International Airport"
                  required
                />
                {errors?.name && (
                  <p className="text-sm text-red-600 mt-1">
                    {Array.isArray(errors.name) ? errors.name[0] : errors.name}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Kode Airport <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Contoh: CGK"
                  required
                />
                {errors?.code && (
                  <p className="text-sm text-red-600 mt-1">
                    {Array.isArray(errors.code) ? errors.code[0] : errors.code}
                  </p>
                )}
              </div>
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
                  placeholder="Masukkan deskripsi airport (opsional)"
                  rows={3}
                ></textarea>
                {errors?.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {Array.isArray(errors.description) ? errors.description[0] : errors.description}
                  </p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Link Website Airport <span className="text-gray-400">(opsional)</span></label>
                <input
                  type="text"
                  name="link_website"
                  value={formData.link_website}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Masukkan link website airport (opsional)"
                />
                {errors?.link_website && (
                  <p className="text-sm text-red-600 mt-1">
                    {Array.isArray(errors.link_website) ? errors.link_website[0] : errors.link_website}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="mt-4 pt-4 border-t flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={closeModal}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>
            {post ? "Simpan Perubahan" : "Simpan Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}