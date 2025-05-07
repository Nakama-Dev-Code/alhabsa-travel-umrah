import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Post {
  id?: number;
  name: string;
  description?: string;
}

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  post?: Post | null;
}

export default function PackageTypeFormModal({ isOpen, closeModal, post }: Props) {
  const [formData, setFormData] = useState<Post>({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (post) {
      setFormData({
        name: post.name,
        description: post.description || "",
      });
    } else {
      setFormData({ name: "", description: "" });
    }
    setErrors({});
  }, [post]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    
    // Description is optional, only append if it has value
    if (formData.description) {
      data.append("description", formData.description);
    }

    const url = post?.id ? `package-type/${post.id}` : "package-type";

    if (post?.id) {
      data.append("_method", "PUT");
    }

    router.post(url, data, {
      onSuccess: () => {
        setFormData({ name: "", description: "" });
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
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{post ? "Edit Package Type" : "Add Package Type"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" noValidate>
          <div>
            <label className="block text-sm font-medium mb-1">Nama Paket <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Contoh: Umrah Reguler, Umrah Plus"
              required
            />
            {errors?.name && (
              <p className="text-sm text-red-600 mt-1">
                {Array.isArray(errors.name) ? errors.name[0] : errors.name}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi <span className="text-gray-400">(opsional)</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Masukkan deskripsi paket (opsional)"
              rows={3}
            ></textarea>
            {errors?.description && (
              <p className="text-sm text-red-600 mt-1">
                {Array.isArray(errors.description) ? errors.description[0] : errors.description}
              </p>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Batal
            </Button>
            <Button type="submit">
              {post ? "Simpan Perubahan" : "Simpan Data"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}