"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  IconPlus, IconEdit, IconTrash, IconSearch, IconFilter, IconCheck, IconClose, IconList, IconGrid 
} from "@/components/ui/icons";
import { AlertBox, AlertType } from "@/components/ui/alert-box";
import { SafeImage } from "@/components/ui/safe-image";
import { getApiUrl } from "@/lib/config";

interface Category {
  id: number;
  name: string;
  sort_order: number;
  created_at?: string;
}

interface Product {
    id: number;
    category_id: number;
    food_name: string;
    description: string;
    price: number;
    availability: boolean;
    sort_order: number;
    category_name?: string;
    image_url?: string;
  }

export function AdminMenuClient() {
  const [activeTab, setActiveTab] = useState<'categories' | 'products'>('products');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: AlertType, title: string, message: string } | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | 'all'>('all');

  // Modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Editing State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'category' | 'product', id: number, name: string } | null>(null);

  // Form Data
  const [catFormData, setCatFormData] = useState({ name: "", sort_order: 0 });
  const [prodFormData, setProdFormData] = useState({
    category_id: 0,
    food_name: "",
    description: "",
    price: "",
    availability: true,
    sort_order: 0,
    image_url: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch(getApiUrl("/categories.php")),
        fetch(getApiUrl("/products.php"))
      ]);
      
      const catData = await catRes.json();
      const prodData = await prodRes.json();

      if (catData.success) setCategories(catData.data);
      if (prodData.success) setProducts(prodData.data);
    } catch (err) {
      console.error(err);
      showAlert("error", "Error", "Failed to load menu data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showAlert = (type: AlertType, title: string, message: string) => {
    setAlert({ type, title, message });
  };

  // --- CRUD Operations: Category ---

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = getApiUrl("/categories.php");
      const method = editingCategory ? "PUT" : "POST";
      const body = editingCategory 
        ? { ...catFormData, id: editingCategory.id }
        : catFormData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (data.success) {
        showAlert("success", "Success", data.message);
        setIsCategoryModalOpen(false);
        fetchData();
      } else {
        showAlert("error", "Error", data.message);
      }
    } catch (err) {
      showAlert("error", "Error", "Operation failed.");
    }
  };

  const handleDeleteCategory = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(getApiUrl(`/categories.php?id=${itemToDelete.id}`), {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        showAlert("success", "Deleted", "Category deleted successfully.");
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

  // --- CRUD Operations: Product ---

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalImageUrl = prodFormData.image_url;

      // Handle Image Upload if new file selected
      if (imageFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadRes = await fetch("http://localhost/bistroflow/bistroflow/php-backend/public/api/upload-product-image.php", {
          method: "POST",
          body: formData
        });
        const uploadData = await uploadRes.json();

        if (!uploadData.success) {
          setIsUploading(false);
          showAlert("error", "Upload Error", uploadData.message);
          return;
        }
        finalImageUrl = uploadData.url;
        setIsUploading(false);
      }

      const url = "http://localhost/bistroflow/bistroflow/php-backend/public/api/products.php";
      const method = editingProduct ? "PUT" : "POST";
      const body = editingProduct 
        ? { ...prodFormData, image_url: finalImageUrl, id: editingProduct.id }
        : { ...prodFormData, image_url: finalImageUrl };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (data.success) {
        showAlert("success", "Success", data.message);
        setIsProductModalOpen(false);
        fetchData();
      } else {
        showAlert("error", "Error", data.message);
      }
    } catch (err) {
      setIsUploading(false);
      showAlert("error", "Error", "Operation failed.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showAlert("error", "File too large", "Maximum image size is 5MB");
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

  const handleDeleteProduct = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`http://localhost/bistroflow/bistroflow/php-backend/public/api/products.php?id=${itemToDelete.id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        showAlert("success", "Deleted", "Product deleted successfully.");
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

  // --- Filtering ---
  
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.food_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'all' || p.category_id === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Menu Management</h1>
          <p className="text-muted-foreground">Manage your restaurant's categories and menu items.</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'products' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'categories' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Categories
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          {activeTab === 'products' && (
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-3 py-2 bg-muted/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>
        <button
          onClick={() => {
            if (activeTab === 'categories') {
              setEditingCategory(null);
              setCatFormData({ name: "", sort_order: 0 });
              setIsCategoryModalOpen(true);
            } else {
              setEditingProduct(null);
              setProdFormData({
                category_id: categories.length > 0 ? categories[0].id : 0,
                food_name: "",
                description: "",
                price: "",
                availability: true,
                sort_order: 0,
                image_url: ""
              });
              setImageFile(null);
              setImagePreview(null);
              setIsProductModalOpen(true);
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <IconPlus className="w-4 h-4" />
          <span>Add New {activeTab === 'categories' ? 'Category' : 'Product'}</span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {[1,2,3,4,5,6].map(i => (
             <div key={i} className="h-48 bg-muted/20 animate-pulse rounded-xl" />
           ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'categories' ? (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {categories.map((cat) => (
                <div key={cat.id} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setCatFormData({ name: cat.name, sort_order: cat.sort_order });
                        setIsCategoryModalOpen(true);
                      }}
                      className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-full text-blue-600 hover:bg-blue-50"
                    >
                      <IconEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setItemToDelete({ type: 'category', id: cat.id, name: cat.name });
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-full text-red-600 hover:bg-red-50"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">ID: {cat.id}</span>
                    <span className="text-xs text-muted-foreground">Order: {cat.sort_order}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground truncate pr-16">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {products.filter(p => p.category_id === cat.id).length} items
                  </p>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 gap-4"
            >
              {filteredProducts.map((prod) => (
                <div key={prod.id} className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm hover:bg-muted/5 transition-colors group">
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground overflow-hidden">
                    {prod.image_url ? (
                        <img src={prod.image_url} alt={prod.food_name} className="w-full h-full object-cover" />
                    ) : (
                        <IconList className="w-8 h-8 opacity-20" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      <h3 className="font-bold text-foreground truncate">{prod.food_name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        prod.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {prod.availability ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate max-w-md">{prod.description}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="bg-primary/5 text-primary px-2 py-0.5 rounded border border-primary/10">
                        {prod.category_name || categories.find(c => c.id === prod.category_id)?.name || 'Unknown Category'}
                      </span>
                      <span>Order: {prod.sort_order}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-bold text-lg text-primary">₱{Number(prod.price).toFixed(2)}</span>
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingProduct(prod);
                          setProdFormData({
                            category_id: prod.category_id,
                            food_name: prod.food_name,
                            description: prod.description,
                            price: prod.price.toString(),
                            availability: Boolean(prod.availability),
                            sort_order: prod.sort_order,
                            image_url: prod.image_url || ""
                          });
                          setImageFile(null);
                          setImagePreview(null);
                          setIsProductModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <IconEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete({ type: 'product', id: prod.id, name: prod.food_name });
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <IconTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* --- MODALS --- */}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <IconClose className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={catFormData.name}
                  onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="e.g., Appetizers"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sort Order</label>
                <input
                  type="number"
                  value={catFormData.sort_order}
                  onChange={(e) => setCatFormData({ ...catFormData, sort_order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Save Category
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setIsProductModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <IconClose className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Food Name</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={prodFormData.food_name}
                  onChange={(e) => setProdFormData({ ...prodFormData, food_name: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="e.g., Spicy Chicken Burger"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Product Image</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-lg border border-border bg-muted overflow-hidden flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : prodFormData.image_url ? (
                      <img src={prodFormData.image_url} alt="Current" className="w-full h-full object-cover" />
                    ) : (
                      <IconList className="w-8 h-8 text-muted-foreground opacity-20" />
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
                    />
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP (Max 5MB)</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={prodFormData.category_id}
                    onChange={(e) => setProdFormData({ ...prodFormData, category_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₱)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodFormData.price}
                    onChange={(e) => setProdFormData({ ...prodFormData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  maxLength={255}
                  value={prodFormData.description}
                  onChange={(e) => setProdFormData({ ...prodFormData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  placeholder="Short description of the dish..."
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                <span className="text-sm font-medium">Availability Status</span>
                <button
                  type="button"
                  onClick={() => setProdFormData({ ...prodFormData, availability: !prodFormData.availability })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${prodFormData.availability ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${prodFormData.availability ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Sort Order</label>
                <input
                  type="number"
                  value={prodFormData.sort_order}
                  onChange={(e) => setProdFormData({ ...prodFormData, sort_order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Save Product
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
            <h3 className="text-xl font-bold mb-2">Delete {itemToDelete.type === 'category' ? 'Category' : 'Product'}?</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete <span className="font-bold text-foreground">"{itemToDelete.name}"</span>? 
              {itemToDelete.type === 'category' && " This will also delete all products in this category."}
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
                onClick={itemToDelete.type === 'category' ? handleDeleteCategory : handleDeleteProduct}
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
