"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  IconUsers, IconPlus, IconSearch, IconEdit, IconTrash, IconClose, 
  IconCheck, IconAlertCircle, IconEye, IconEyeOff
} from "@/components/ui/icons";
import { AlertBox, AlertType } from "@/components/ui/alert-box";

interface Staff {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
}

export function StaffClient() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // Password Visibility State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Alert State
  const [alert, setAlert] = useState<{ type: AlertType, title: string, message: string } | null>(null);
  
  const showAlert = (type: AlertType, title: string, message: string) => {
    setAlert({ type, title, message });
  };

  // Fetch Staff
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost/bistroflow/bistroflow/php-backend/public/api/staff/list.php");
      const data = await res.json();
      if (data.success) {
        setStaff(data.data);
      } else {
        setError(data.message || "Failed to load staff.");
        showAlert("error", "Load Error", data.message || "Failed to load staff list.");
      }
    } catch (err) {
      console.error("Fetch Staff Error:", err);
      const msg = "Failed to connect to the server.";
      setError(msg);
      showAlert("error", "Connection Error", msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Handlers
  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: ""
    });
    setFormErrors({});
    setSubmitMessage(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsModalOpen(true);
  };

  const openEditModal = (staff: Staff) => {
    setModalMode("edit");
    setSelectedStaff(staff);
    setFormData({
      first_name: staff.first_name,
      middle_name: staff.middle_name || "",
      last_name: staff.last_name,
      email: staff.email,
      password: "", // Leave blank unless changing
      confirm_password: ""
    });
    setFormErrors({});
    setSubmitMessage(null);
    setIsModalOpen(true);
  };

  const openDeleteModal = (staff: Staff) => {
    setStaffToDelete(staff);
    setIsDeleteModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.first_name.trim()) errors.first_name = "First name is required";
    if (!formData.last_name.trim()) errors.last_name = "Last name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    
    if (modalMode === "create") {
      if (!formData.password) errors.password = "Password is required";
      if (formData.password.length < 8) errors.password = "Password must be at least 8 characters";
      if (!/[A-Z]/.test(formData.password)) errors.password = "Must contain at least one uppercase letter";
      if (!/[a-z]/.test(formData.password)) errors.password = "Must contain at least one lowercase letter";
      if (!/[0-9]/.test(formData.password)) errors.password = "Must contain at least one number";
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) errors.password = "Must contain at least one special character";
      
      if (formData.password !== formData.confirm_password) errors.confirm_password = "Passwords do not match";
    } else {
      // Edit mode: only validate password if provided (UI removed, so this likely won't trigger)
      if (formData.password) {
        if (formData.password.length < 8) errors.password = "Password must be at least 8 characters";
        if (formData.password !== formData.confirm_password) errors.confirm_password = "Passwords do not match";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const url = modalMode === "create" 
        ? "http://localhost/bistroflow/bistroflow/php-backend/public/api/staff/create.php"
        : "http://localhost/bistroflow/bistroflow/php-backend/public/api/staff/update.php";
      
      const method = modalMode === "create" ? "POST" : "PUT";
      
      // Auto-generate default password if creating (since UI field is removed)
      let finalData = { ...formData };
      
      // In Edit mode, if password is empty, remove it so we don't send empty string to backend
      if (modalMode === "edit" && !finalData.password) {
          delete (finalData as any).password;
          delete (finalData as any).confirm_password;
      }
      
      const body = modalMode === "create" 
        ? finalData 
        : { ...finalData, id: selectedStaff?.id };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (data.success) {
        showAlert("success", "Success", data.message);
        setIsModalOpen(false);
        fetchStaff();
      } else {
        setSubmitMessage({ type: "error", text: data.message });
        showAlert("error", "Submission Failed", data.message);
      }
    } catch (err) {
      console.error("Submit Error:", err);
      const msg = "An error occurred. Please try again.";
      setSubmitMessage({ type: "error", text: msg });
      showAlert("error", "System Error", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!staffToDelete) return;
    setIsSubmitting(true);
    const staffName = `${staffToDelete.first_name} ${staffToDelete.last_name}`;
    
    try {
      const res = await fetch("http://localhost/bistroflow/bistroflow/php-backend/public/api/staff/delete.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: staffToDelete.id })
      });
      const data = await res.json();
      
      if (data.success) {
        setIsDeleteModalOpen(false);
        showAlert("success", "Deleted", `Staff account ${staffName} has been successfully deleted.`);
        fetchStaff();
      } else {
        showAlert("error", "Delete Failed", data.message || "Failed to delete staff member.");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      showAlert("error", "Network Error", "Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
      setStaffToDelete(null);
    }
  };

  // Filtered Staff
  const filteredStaff = staff.filter(s => 
    s.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <IconUsers className="w-6 h-6 text-primary" />
            Staff Management
          </h1>
          <p className="text-muted-foreground text-sm">Manage access and permissions for your team.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:brightness-110 transition-all shadow-lg shadow-primary/20"
        >
          <IconPlus className="w-4 h-4" />
          Add New Staff
        </button>
      </div>

      {/* Search & Stats */}
      <div className="grid sm:grid-cols-12 gap-4">
        <div className="sm:col-span-8 lg:col-span-9 relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search staff by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="sm:col-span-4 lg:col-span-3 bg-card border border-border rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm">
          <span className="text-sm font-medium text-muted-foreground">Total Staff</span>
          <span className="text-lg font-bold text-foreground">{staff.length}</span>
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <span>Loading staff data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No staff members found.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((member) => (
                  <motion.tr 
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {member.first_name[0]}{member.last_name[0]}
                        </div>
                        <span className="font-medium text-foreground">
                          {member.first_name} {member.middle_name ? member.middle_name + " " : ""}{member.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{member.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">
                      {new Date(member.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(member)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Edit"
                        >
                          <IconEdit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(member)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
                <h2 className="text-lg font-semibold text-foreground">
                  {modalMode === 'create' ? 'Add New Staff' : 'Edit Staff Member'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <IconClose className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {submitMessage && (
                  <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                    submitMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {submitMessage.type === 'success' ? <IconCheck className="w-4 h-4" /> : <IconAlertCircle className="w-4 h-4" />}
                    {submitMessage.text}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">First Name</label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      className={`w-full px-3 py-2 bg-background border ${formErrors.first_name ? 'border-red-500' : 'border-input'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20`}
                      placeholder="John"
                    />
                    {formErrors.first_name && <p className="text-xs text-red-500">{formErrors.first_name}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Middle Name</label>
                    <input
                      type="text"
                      value={formData.middle_name}
                      onChange={(e) => setFormData({...formData, middle_name: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Doe (Optional)"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    className={`w-full px-3 py-2 bg-background border ${formErrors.last_name ? 'border-red-500' : 'border-input'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20`}
                    placeholder="Smith"
                  />
                  {formErrors.last_name && <p className="text-xs text-red-500">{formErrors.last_name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full px-3 py-2 bg-background border ${formErrors.email ? 'border-red-500' : 'border-input'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20`}
                    placeholder="john.smith@bistroflow.com"
                  />
                  {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {modalMode === 'create' && (
                    <>
                      <div className="space-y-1.5 relative">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className={`w-full px-3 py-2 pr-10 bg-background border ${formErrors.password ? 'border-red-500' : 'border-input'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                          </button>
                        </div>
                        {formErrors.password && <p className="text-xs text-red-500">{formErrors.password}</p>}
                      </div>
                      <div className="space-y-1.5 relative">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Confirm Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirm_password}
                            onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                            className={`w-full px-3 py-2 pr-10 bg-background border ${formErrors.confirm_password ? 'border-red-500' : 'border-input'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                          >
                            {showConfirmPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                          </button>
                        </div>
                        {formErrors.confirm_password && <p className="text-xs text-red-500">{formErrors.confirm_password}</p>}
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:brightness-110 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    {modalMode === 'create' ? 'Create Staff' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-xl p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <IconTrash className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Delete Staff Member?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Are you sure you want to delete <span className="font-bold text-foreground">{staffToDelete?.first_name} {staffToDelete?.last_name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all shadow-md flex items-center gap-2"
                >
                  {isSubmitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Alert Box Notification */}
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
