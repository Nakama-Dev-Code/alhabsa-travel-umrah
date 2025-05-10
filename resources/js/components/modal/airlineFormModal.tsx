import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Airline {
  id?: number;
  name: string;
  link_website?: string;
}

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  post?: Airline | null;
}

export default function PackageTypeFormModal({ isOpen, closeModal, post }: Props) {
  const [formData, setFormData] = useState<Airline>({
    name: "",
    link_website: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        name: post.name,
        link_website: post.link_website || "",
      });
    } else {
      setFormData({ name: "", link_website: "" });
    }
    setErrors({});
  }, [post, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    
    // link_website is optional, only append if it has value
    if (formData.link_website) {
      data.append("link_website", formData.link_website);
    }

    const url = post?.id ? `airline/${post.id}` : "airline";

    if (post?.id) {
      data.append("_method", "PUT");
    }

    router.post(url, data, {
      onSuccess: () => {
        setFormData({ name: "", link_website: "" });
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{post ? "Edit Airline" : "Add Airline"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4" autoComplete="off" noValidate>
          <div>
            <label className="block text-sm font-medium mb-1">Nama Maskapai <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Contoh: Garuda Indonesia"
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
            <label className="block text-sm font-medium mb-1">Link Website Maskapai <span className="text-gray-400">(opsional)</span></label>
            <textarea
              name="link_website"
              value={formData.link_website}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Masukkan link website maskapai (opsional)"
              rows={3}
              disabled={isSubmitting}
            ></textarea>
            {errors?.link_website && (
              <p className="text-sm text-red-600 mt-1">
                {Array.isArray(errors.link_website) ? errors.link_website[0] : errors.link_website}
              </p>
            )}
          </div>

          <DialogFooter className="mt-4">
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
        </form>
      </DialogContent>
    </Dialog>
  );
}