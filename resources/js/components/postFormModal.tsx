import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";

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
  const [formData, setFormData] = useState<Post>({ name: "", value: "", path_file: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (post) {
      setFormData({ name: post.name, value: post.value, path_file: post.path_file || "" });
      setPreview(post.path_file || "");
      setSelectedFile(null);
    } else {
      setFormData({ name: "", value: "", path_file: "" });
      setPreview("");
      setSelectedFile(null);
    }
  }, [post]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    if (post?.id) {
      data.append("_method", "PUT");
      router.post(`/web-option/${post.id}`, data, {
        onSuccess: () => {
          closeModal();
          toast.success("Berhasil mengubah data !");
          router.reload();
        },
        onError: (errors) => {
          toast.error("Gagal mengubah data !");
          console.error(errors.message || "Failed to submit web option.");
        },
      });
    } else {
      router.post("/web-option", data, {
        onSuccess: () => {
          closeModal();
          toast.success("Berhasil menambah data !");
          router.reload();
        },
        onError: (errors) => {
          toast.error("Gagal menambah data !");
          console.error(errors.message || "Failed to submit web option.");
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        <h2 className="text-lg font-semibold mb-4">{post ? "Edit Web Option" : "Add Web Option"}</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium">Value</label>
            <textarea
              name="value"
              value={formData.value}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium">File (optional)</label>
            <input
              type="file"
              name="path_file"
              onChange={handleFileChange}
              className="w-full"
              accept="image/*"
            />
          </div>
          {preview && (
            <div className="mb-3">
              <p className="text-sm mb-1">Image Preview:</p>
              <img src={preview} alt="Preview" className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-lg shadow" />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded">Batal</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{post ? "Simpan Perubahan" : "Simpan Data"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
