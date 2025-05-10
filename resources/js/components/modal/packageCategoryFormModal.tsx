import { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SelectValue, SelectTrigger, SelectContent, SelectItem, Select } from "@/components/ui/select";

interface PackageType {
  id: number;
  name: string;
}

interface PackageCategory {
  id?: number;
  package_type_id: number;
  name: string;
  description?: string;
}

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  post?: PackageCategory | null;
  packageTypes: PackageType[];
}

export default function PackageCategoryFormModal({ isOpen, closeModal, post, packageTypes }: Props) {
  const { errors } = usePage().props as { errors: Record<string, string> };
  
  const [formData, setFormData] = useState<PackageCategory>({
    package_type_id: post?.package_type_id || (packageTypes.length > 0 ? packageTypes[0].id : 0),
    name: "",
    description: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        package_type_id: post.package_type_id,
        name: post.name,
        description: post.description || "",
      });
    } else {
      setFormData({ 
        package_type_id: packageTypes.length > 0 ? packageTypes[0].id : 0,
        name: "", 
        description: "", 
      });
    }
  }, [post, isOpen, packageTypes]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, package_type_id: parseInt(value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("package_type_id", formData.package_type_id.toString());
    data.append("name", formData.name);

    // Description is optional, only append if it has value
    if (formData.description) {
      data.append("description", formData.description);
    }
    
    const url = post?.id ? `package-category/${post.id}` : "package-category";

    if (post?.id) {
      data.append("_method", "PUT");
    }

    router.post(url, data, {
      onSuccess: () => {
        setFormData({ package_type_id: packageTypes.length > 0 ? packageTypes[0].id : 0, name: "", description: "" });
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
          <DialogTitle>{post ? "Edit Kategori Paket" : "Tambah Kategori Paket"}</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-grow pr-1">
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Jenis Paket <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Contoh: Paket Hemat"
                  required
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tipe Kategori <span className="text-red-500">*</span></label>
                <Select
                  value={formData.package_type_id.toString()}
                  onValueChange={handleSelectChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Tipe Paket" />
                  </SelectTrigger>
                  <SelectContent>
                    {packageTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.package_type_id && (
                  <p className="text-sm text-red-600 mt-1">{errors.package_type_id}</p>
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