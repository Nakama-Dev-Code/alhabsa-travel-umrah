import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Toaster, toast } from "react-hot-toast";
import { Head, router, usePage } from "@inertiajs/react";
import PostFormModal from "@/components/postFormModal";
import AppLayout from "@/layouts/app-layout";
import { Plus, Search, Download, ChevronLeft, ChevronRight, Loader2, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Mendefinisikan tipe untuk WebOption
interface WebOption {
  id: number;
  name: string;
  value: string;
  path_file?: string;
}

// Mendefinisikan tipe untuk meta pagination
interface MetaPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export default function WebOption() {
  const { webOptions, meta } = usePage<{ 
    webOptions: WebOption[],
    meta: MetaPagination
  }>().props;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<WebOption | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState<WebOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  // State untuk dialog konfirmasi hapus
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setFilteredData(webOptions);
      setIsInitialLoading(false);
    }, 1000); // Show loading for 1 second on initial page load
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Untuk menangani pencarian lokal di halaman ini
    if (!isInitialLoading) {
      if (searchTerm) {
        const filtered = webOptions.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.value.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(webOptions);
      }
      setSelectedItems([]);
    }
  }, [searchTerm, webOptions, isInitialLoading]);

  const openModal = (post: WebOption | null = null) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (id: number) => {
    setItemToDelete(id);
    setIsBulkDelete(false);
    setIsDeleteConfirmOpen(true);
  };
  
  const openBulkDeleteConfirm = () => {
    if (selectedItems.length === 0) {
      toast.error("Tidak ada item yang dipilih!");
      return;
    }
    setIsBulkDelete(true);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (isBulkDelete) {
      // Handle bulk delete
      setIsDeleting(true);
      router.post('/web-option/bulk-delete', { ids: selectedItems }, {
        onSuccess: () => {
          toast.success("Berhasil menghapus data terpilih!");
          setSelectedItems([]);
          setIsDeleteConfirmOpen(false);
          setIsDeleting(false);
          router.reload();
        },
        onError: () => {
          setIsDeleting(false);
          toast.error("Gagal menghapus data!");
          setIsDeleteConfirmOpen(false);
        },
      });
    } else if (itemToDelete) {
      // Handle single item delete
      setIsDeleting(true);
      router.delete(`/web-option/${itemToDelete}`, {
        onSuccess: () => {
          toast.success("Berhasil menghapus data!");
          setIsDeleteConfirmOpen(false);
          setIsDeleting(false);
          router.reload();
        },
        onError: () => {
          setIsDeleting(false);
          toast.error("Gagal menghapus data!");
          setIsDeleteConfirmOpen(false);
        },
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    router.get('/web-option', { search: searchTerm, page: 1 }, {
      preserveState: true,
      onSuccess: () => {
        setCurrentPage(1);
        setIsLoading(false);
      }
    });
  };

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    router.get('/web-option', { search: searchTerm, page }, {
      preserveState: true,
      onSuccess: () => {
        setCurrentPage(page);
        setIsLoading(false);
      }
    });
  };

  const exportToExcel = () => {
    setIsLoading(true);
    window.location.href = `/web-option-export${searchTerm ? `?search=${searchTerm}` : ''}`;
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Data berhasil diekspor!");
    }, 1000);
  };

  const exportToPdf = () => {
    setIsLoading(true);
    window.location.href = `/web-option-export-pdf${searchTerm ? `?search=${searchTerm}` : ''}`;
    setTimeout(() => {
      setIsLoading(false);
      toast.success("PDF berhasil diekspor!");
    }, 1000);
  };

  // Handle merubah checkbox
  const handleCheckboxChange = (id: number) => {
    setSelectedItems(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(item => item !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Handle pilih semua checkbox
  const handleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      // Deselect all
      setSelectedItems([]);
    } else {
      // Select all
      setSelectedItems(filteredData.map(item => item.id));
    }
  };

  return (
    <AppLayout>
      <Head title="Web Option" />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-lg rounded-xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-xl font-semibold">Web Option</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button 
              onClick={() => openModal()} 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
              disabled={isLoading || isInitialLoading}
            >
              <Plus size={16} /> Tambah Data
            </button>
            <button 
              onClick={exportToExcel} 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-700 transition"
              disabled={isLoading || isInitialLoading}
            >
              <Download size={16} /> Export Excel
            </button>
            <button 
              onClick={exportToPdf} 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
              disabled={isLoading || isInitialLoading}
            >
              <Download size={16} /> Export PDF
            </button>
            {selectedItems.length > 0 && (
              <button 
                onClick={openBulkDeleteConfirm} 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg shadow hover:bg-red-800 transition"
                disabled={isLoading || isInitialLoading}
              >
                <Trash2 size={16} /> Hapus Terpilih ({selectedItems.length})
              </button>
            )}
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full p-2 pl-10 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Cari berdasarkan nama atau nilai..."
                disabled={isInitialLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full sm:w-auto text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              disabled={isLoading || isInitialLoading}
            >
              {isLoading ? 'Mencari...' : 'Cari'}
            </Button>
          </div>
        </form>

        {isLoading || isInitialLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="ml-2 text-gray-500">Loading data...</span>
          </div>
        ) : filteredData.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 max-w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded"
                      />
                    </TableHead>
                    <TableHead>#</TableHead>
                    <TableHead>Picture</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((post, index) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(post.id)}
                          onChange={() => handleCheckboxChange(post.id)}
                          className="w-4 h-4 rounded"
                        />
                      </TableCell>
                      <TableCell>
                        {((meta?.current_page || currentPage) - 1) * (meta?.per_page || 10) + index + 1}
                      </TableCell>
                      <TableCell>
                        {post.path_file ? (
                          <img
                            src={post.path_file}
                            alt="File"
                            className="w-16 h-16 object-cover rounded-lg shadow"
                          />
                        ) : (
                          <span className="text-gray-500">No Picture</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {post.name}
                        </Badge>
                      </TableCell>
                      <TableCell>{post.value}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openModal(post)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => openDeleteConfirm(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {meta?.last_page > 1 && (
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Menampilkan <span className="font-medium">{((meta.current_page - 1) * meta.per_page) + 1}</span> hingga{" "}
                  <span className="font-medium">{Math.min(meta.current_page * meta.per_page, meta.total)}</span> dari{" "}
                  <span className="font-medium">{meta.total}</span> data
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(meta.current_page - 1)}
                    disabled={meta.current_page === 1 || isLoading}
                    className="inline-flex items-center px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {[...Array(meta.last_page)].map((_, page) => {
                    page = page + 1;
                    if (
                      page === 1 ||
                      page === meta.last_page ||
                      (page >= meta.current_page - 2 && page <= meta.current_page + 2)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded-lg ${
                            meta.current_page === page
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                          }`}
                          disabled={isLoading}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      (page === meta.current_page - 3 && meta.current_page > 3) ||
                      (page === meta.current_page + 3 && meta.current_page < meta.last_page - 2)
                    ) {
                      return <span key={page}>...</span>;
                    }
                    return null;
                  })}
                  <button
                    onClick={() => handlePageChange(meta.current_page + 1)}
                    disabled={meta.current_page === meta.last_page || isLoading}
                    className="inline-flex items-center px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-gray-500">
            Tidak ada data ditemukan.
          </div>
        )}
      </div>

      <PostFormModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} post={selectedPost} />
      
      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {isBulkDelete ? (
              <p>Apakah Anda yakin ingin menghapus {selectedItems.length} data yang dipilih? Tindakan ini dapat dibatalkan.</p>
            ) : (
              <p>Apakah Anda yakin ingin menghapus data ini? Tindakan ini dapat dibatalkan.</p>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteConfirmOpen(false)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}