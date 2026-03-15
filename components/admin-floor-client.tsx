"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  IconPlus, IconEdit, IconTrash, IconSearch, IconClose, IconGrid, IconCheck, IconAlertCircle
} from "@/components/ui/icons";
import { AlertBox, AlertType } from "@/components/ui/alert-box";
import { SafeImage } from "@/components/ui/safe-image";
import { getApiUrl } from "@/lib/config";

  interface FloorLayout {
    id: number;
    table_number: string;
    image_path: string;
    availability: boolean;
    capacity?: number;
    created_at?: string;
  }

export function AdminFloorClient() {
  const [layouts, setLayouts] = useState<FloorLayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: AlertType, title: string, message: string } | null>(null);

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Editing State
  const [editingLayout, setEditingLayout] = useState<FloorLayout | null>(null);
  const [itemToDelete, setItemToDelete] = useState<FloorLayout | null>(null);

  // Form Data
  const [formData, setFormData] = useState({
    table_number: "",
    availability: true,
    image_path: "",
    capacity: 2
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const url = new URL(getApiUrl("/floor_layouts.php"));
      if (debouncedSearch) {
        url.searchParams.append("q", debouncedSearch);
      }

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setLayouts(data.data);
      } else {
        showAlert("error", "Error", data.message || "Failed to load floor layouts.");
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "Error", "Failed to load floor layouts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearch]);

  const showAlert = (type: AlertType, title: string, message: string) => {
    setAlert({ type, title, message });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showAlert("error", "File too large", "Maximum image size is 2MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalImagePath = formData.image_path;

      // Handle Image Upload if new file selected
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", imageFile);

        const uploadRes = await fetch(getApiUrl("/upload-floor-image.php"), {
          method: "POST",
          body: uploadFormData
        });
        const uploadData = await uploadRes.json();

        if (!uploadData.success) {
          setIsUploading(false);
          showAlert("error", "Upload Error", uploadData.message);
          return;
        }
        finalImagePath = uploadData.url;
      } else if (!finalImagePath) {
         setIsUploading(false);
         showAlert("error", "Validation Error", "Please upload an image.");
         return;
      }

      const url = getApiUrl("/floor_layouts.php");
      const method = editingLayout ? "PUT" : "POST";
      const body = editingLayout
        ? { ...formData, image_path: finalImagePath, id: editingLayout.id }
        : { ...formData, image_path: finalImagePath };

      // API call needs JSON body for data
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (data.success) {
        showAlert("success", "Success", data.message);
        setIsModalOpen(false);
        fetchData();
      } else {
        showAlert("error", "Error", data.message);
      }
    } catch (err) {
      showAlert("error", "Error", "Operation failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(getApiUrl(`/floor_layouts.php?id=${itemToDelete.id}`), {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        showAlert("success", "Deleted", "Floor layout deleted successfully.");
        fetchData();
      } else {
        showAlert("error", "Error", data.message);
      }
    } catch (err) {
      showAlert("error", "Error", "Delete failed.");
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const openModal = (layout?: FloorLayout) => {
    if (layout) {
      setEditingLayout(layout);
      setFormData({
        table_number: layout.table_number,
        availability: layout.availability,
        image_path: layout.image_path,
        capacity: layout.capacity || 2
      });
      setImagePreview(null);
      setImageFile(null);
    } else {
      setEditingLayout(null);
      setFormData({
        table_number: "",
        availability: true,
        image_path: "",
        capacity: 2
      });
      setImagePreview(null);
      setImageFile(null);
    }
    setIsModalOpen(true);
  };

  const filteredLayouts = layouts; // Server side filtered now

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Table Floor Management</h1>
          <p className="text-muted-foreground">Manage your restaurant's table layouts and seating arrangements.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <IconPlus className="w-4 h-4" />
          <span>Add New Table</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative w-full max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search table, room, or floor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {[1,2,3,4].map(i => (
             <div key={i} className="h-64 bg-muted/20 animate-pulse rounded-xl" />
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredLayouts.map((layout) => (
              <motion.div
                key={layout.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <div className="relative aspect-video bg-muted">
                  <img
                    src={layout.image_path}
                    alt={`Table ${layout.table_number}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => openModal(layout)}
                      className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit"
                    >
                      <IconEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setItemToDelete(layout);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      layout.availability ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {layout.availability ? 'Available' : 'Occupied'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-foreground">Table {layout.table_number}</h3>
                    <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      <span>{layout.capacity || 2} Seats</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredLayouts.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-xl border border-border border-dashed">
              <IconGrid className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No tables found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {/* --- MODALS --- */}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingLayout ? 'Edit Table' : 'New Table'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <IconClose className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Table Number</label>
                  <input
                    type="text"
                    required
                    value={formData.table_number}
                    onChange={(e) => setFormData({ ...formData, table_number: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="e.g., T-01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="20"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="e.g., 4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Layout Image</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-16 rounded-lg border border-border bg-muted overflow-hidden flex items-center justify-center shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : formData.image_path ? (
                      <img src={formData.image_path} alt="Current" className="w-full h-full object-cover" />
                    ) : (
                      <IconGrid className="w-6 h-6 text-muted-foreground opacity-20" />
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Max 2MB (JPG, PNG, WebP)</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                <span className="text-sm font-medium">Availability Status</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, availability: !formData.availability })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.availability ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.availability ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-70"
                >
                  {isUploading ? 'Uploading...' : 'Save Table'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-6 text-center"
          >
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconTrash className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Delete Table?</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete <span className="font-bold text-foreground">Table {itemToDelete.table_number}</span>?
              <br/>This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Alert Notification */}
      <AnimatePresence>
        {alert && (
          <AlertBox
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
