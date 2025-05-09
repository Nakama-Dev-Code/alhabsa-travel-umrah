import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WebOption {
  id?: number;
  name: string;
  value: string;
  path_file?: string;
}

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  post?: WebOption | null;
}

export default function WebOptionFormModal({ isOpen, closeModal, post }: Props) {
  const [formData, setFormData] = useState<WebOption>({
    name: "",
    value: "",
    path_file: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (post) {
      setFormData({
        name: post.name,
        value: post.value,
        path_file: post.path_file || "",
      });
      setPreview(post.path_file || "");
      setSelectedFile(null);
    } else {
      setFormData({ name: "", value: "", path_file: "" });
      setPreview("");
      setSelectedFile(null);
    }
  }, [post, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    data.append("name", formData.name);
    data.append("value", formData.value);
    if (selectedFile) {
      data.append("path_file", selectedFile);
    }

    const url = post?.id ? `/web-option/${post.id}` : "/web-option";

    if (post?.id) {
      data.append("_method", "PUT");
    }

    router.post(url, data, {
      onSuccess: () => {
        setFormData({ name: "", value: "", path_file: "" });
        setPreview("");
        setSelectedFile(null);
        closeModal();
        toast.success(post?.id ? "Berhasil mengubah data !" : "Berhasil menambah data !");
        setIsSubmitting(false);
        router.reload();
      },
      onError: (errors) => {
        // console.log('Validation errors:', errors);
        const formattedErrors: Record<string, string[]> = {};

        for (const key in errors) {
          if (Array.isArray(errors[key])) {
            formattedErrors[key] = errors[key];
          } else if (typeof errors[key] === "string") {
            formattedErrors[key] = [errors[key]];
          }
        }
        
        setErrors(formattedErrors);
        toast.error(post?.id ? "Gagal mengubah data !" : "Gagal menambah data !");
        console.error(errors.message || "Failed to submit web option.");
        setIsSubmitting(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isSubmitting && closeModal()} modal={true}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-6 pt-9">
        <DialogHeader className="pb-2">
          <DialogTitle>{post ? "Edit Web Option" : "Add Web Option"}</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-grow pr-1">
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4" autoComplete="off" noValidate>
            <div>
              <label className="block text-sm font-medium mb-1">Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Masukkan name variable"
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
              <label className="block text-sm font-medium mb-1">Value <span className="text-red-500">*</span></label>
              <textarea
                name="value"
                value={formData.value}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Masukkan value variable"
                required
                rows={3}
                disabled={isSubmitting}
              ></textarea>
              {errors?.value && (
                <p className="text-sm text-red-600 mt-1">
                  {Array.isArray(errors.value) ? errors.value[0] : errors.value}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">File (optional)</label>
              <input
                type="file"
                name="path_file"
                onChange={handleFileChange}
                className="w-full"
                accept="image/*,application/pdf"
                ref={fileInputRef}
                disabled={isSubmitting}
              />
              {errors?.path_file && (
                <p className="text-sm text-red-600 mt-1">
                  {Array.isArray(errors.path_file) ? errors.path_file[0] : errors.path_file}
                </p>
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
                ) : selectedFile?.type === "application/pdf" || preview.endsWith(".pdf") ? (
                  <iframe
                    src={preview}
                    title="PDF Preview"
                    className="w-full h-64 border rounded"
                  ></iframe>
                ) : (
                  <a
                    href={preview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Lihat file
                  </a>
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
      </DialogContent>
    </Dialog>
  );
}
