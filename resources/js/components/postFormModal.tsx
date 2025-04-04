import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Post {
  id?: number;
  name: string;
  value: string;
  path_file?: string;
}

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  post?: Post | null;
}

export default function PostFormModal({ isOpen, closeModal, post }: Props) {
  const [formData, setFormData] = useState<Post>({
    name: "",
    value: "",
    path_file: "",
  });
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
  }, [post]);

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
        router.reload();
      },
      onError: (errors) => {
        toast.error(post?.id ? "Gagal mengubah data!" : "Gagal menambah data!");
        console.error(errors.message || "Failed to submit web option.");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{post ? "Edit Web Option" : "Add Web Option"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Value</label>
            <textarea
              name="value"
              value={formData.value}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">File (optional)</label>
            <input
              type="file"
              name="path_file"
              onChange={handleFileChange}
              className="w-full"
              accept="image/*"
            />
          </div>
          {preview && (
            <div>
              <p className="text-sm mb-1">Image Preview:</p>
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg shadow"
              />
            </div>
          )}

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
