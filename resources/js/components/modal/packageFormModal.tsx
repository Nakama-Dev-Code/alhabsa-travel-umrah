import { useState, useEffect, useRef } from "react";
import { router, usePage } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SelectValue, SelectTrigger, SelectContent, SelectItem, Select } from "@/components/ui/select";

interface PackageCategory {
  id: number;
  name: string;
}

interface Package {
  id?: number;
  package_category_id: number;
  title: string;
  description?: string;
  image?: string;
}

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  post?: Package | null;
  packageCategories: PackageCategory[];
}

export default function PackageFormModal({ isOpen, closeModal, post, packageCategories }: Props) {
  const { errors } = usePage().props as { errors: Record<string, string> };
  
  const [formData, setFormData] = useState<Package>({
    package_category_id: post?.package_category_id || (packageCategories.length > 0 ? packageCategories[0].id : 0),
    title: "",
    description: "",
    image: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (post) {
      setFormData({
        package_category_id: post.package_category_id,
        title: post.title,
        description: post.description || "",
        image: post.image || "",
      });
      setPreview(post.image || "");
      setSelectedFile(null);
    } else {
      setFormData({ 
        package_category_id: packageCategories.length > 0 ? packageCategories[0].id : 0,
        title: "", 
        description: "", 
        image: "",
      });
      setPreview("");
      setSelectedFile(null);
    }
  }, [post, isOpen, packageCategories]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, package_category_id: parseInt(value) });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("package_category_id", formData.package_category_id.toString());
    data.append("title", formData.title);

    // Description is optional, only append if it has value
    if (formData.description) {
      data.append("description", formData.description);
    }

    if (selectedFile) {
        data.append("image", selectedFile);
    }
    
    const url = post?.id ? `package/${post.id}` : "package";

    if (post?.id) {
      data.append("_method", "PUT");
    }
    
    router.post(url, data, {
      onSuccess: () => {
        setFormData({ package_category_id: packageCategories.length > 0 ? packageCategories[0].id : 0, title: "", description: "", image: "" });
        setPreview("");
        setSelectedFile(null);
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
  
  return (
    <Dialog open={isOpen} onOpenChange={() => !isSubmitting && closeModal()} modal={true}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-6 pt-9">
        <DialogHeader className="pb-2">
          <DialogTitle>{post ? "Edit Paket" : "Tambah Paket"}</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-grow pr-1">
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" encType="multipart/form-data" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Judul Paket <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Contoh: SIGNATURE UMRAH TAHUN 2025"
                  required
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Kategori Paket<span className="text-red-500">*</span></label>
                <Select
                  value={formData.package_category_id.toString()}
                  onValueChange={handleSelectChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Tipe Paket" />
                  </SelectTrigger>
                  <SelectContent>
                    {packageCategories.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.package_category_id && (
                  <p className="text-sm text-red-600 mt-1">{errors.package_category_id}</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Deskripsi <span className="text-gray-400">(opsional)</span></label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Masukkan deskripsi kategori paket (opsional)"
                rows={3}
                disabled={isSubmitting}
              ></textarea>
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gambar Banner <span className="text-gray-400">(opsional)</span></label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="w-full"
                accept="image/*"
                ref={fileInputRef}
                disabled={isSubmitting}
              />
              {errors.image && (
                <p className="text-sm text-red-600 mt-1">{errors.image}</p>
              )}
            </div>

            {preview && (
              <div className="mt-2">
                <p className="text-sm mb-1">File Preview:</p>
                {selectedFile?.type?.startsWith("image/") ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg shadow"
                  />
                ) : (
                  <Button
                    type="button"
                    onClick={() => window.open(preview, "_blank", "noopener,noreferrer")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 mr-2"
                  >
                    Lihat File
                  </Button>
                )}

                <Button
                  type="button"
                  variant="destructive"
                  className="mt-2"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview("");
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Hapus File
                </Button>
              </div>
            )}
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