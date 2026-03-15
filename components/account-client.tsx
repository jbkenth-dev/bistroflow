"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import { motion } from "framer-motion";
import Link from "next/link";
import { IconArrowRight, IconUser, IconKey, IconClock, IconMapPin, IconLogOut, IconCamera, IconClose, IconCheck, IconAlertCircle } from "@/components/ui/icons";
import { btnPrimary } from "@/components/ui/button-classes";

interface UserProfile {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  joinedAt: string;
  profilePic: string;
}

export function AccountClient() {
  const router = useRouter();
  const { isAuthenticated, user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", middleName: "", lastName: "" });
  const [isSaving, setIsSaving] = useState(false);

  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;

    // Reset status
    setUploadStatus('idle');
    setUploadMessage("");

    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadStatus('error');
      setUploadMessage("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('error');
      setUploadMessage("File is too large. Maximum size is 5MB.");
      return;
    }

    // Local Preview
    const objectUrl = URL.createObjectURL(file);
    const originalPic = profile.profilePic;
    
    // Optimistic Update
    setProfile(prev => prev ? ({ ...prev, profilePic: objectUrl }) : null);

    // Upload
    const formData = new FormData();
    formData.append('profile_pic', file);
    formData.append('userId', profile.id);

    setUploadStatus('uploading');
    try {
      const response = await fetch("http://localhost/bistroflow/bistroflow/php-backend/public/api/upload-profile-pic.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (data.success && data.profilePic) {
        setUploadStatus('success');
        setUploadMessage("Saved");
        
        // Update global store
        updateUser({ 
            firstName: profile.firstName,
            lastName: profile.lastName,
            name: profile.name,
            profilePic: data.profilePic 
        });
        
        // Keep the URL from server to ensure consistency
        setProfile(prev => prev ? ({ ...prev, profilePic: data.profilePic }) : null);
        
        // Clear message after 3 seconds
        setTimeout(() => {
            setUploadStatus('idle');
            setUploadMessage("");
        }, 3000);
      } else {
        throw new Error(data.message || "Failed to upload image.");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadStatus('error');
      setUploadMessage(err.message || "An error occurred.");
      // Revert image
      setProfile(prev => prev ? ({ ...prev, profilePic: originalPic }) : null);
    } finally {
      // Clean up object URL
      URL.revokeObjectURL(objectUrl);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      const returnUrl = encodeURIComponent("/account");
      router.push(`/login?returnUrl=${returnUrl}`);
      return;
    }

    const fetchProfile = async () => {
      try {
        if (!user?.id) throw new Error("User ID missing");
        
        // In a real app, this URL would be from an env var
        const response = await fetch(`http://localhost/bistroflow/bistroflow/php-backend/public/api/user-profile.php?user_id=${user.id}`);
        
        if (!response.ok) {
           throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        if (data.success && data.user) {
          setProfile(data.user);
        } else {
          throw new Error(data.message || "Failed to load profile");
        }
      } catch (err: any) {
        console.error("Profile fetch error:", err);
        setError(err.message || "Could not load profile information.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, user, router]);

  const getFullName = () => {
    if (!profile) return "";
    const parts = [profile.firstName, profile.middleName, profile.lastName];
    return parts.filter(Boolean).join(" ");
  };

  const handleEditClick = () => {
    if (profile) {
      setEditForm({
        firstName: profile.firstName || "",
        middleName: profile.middleName || "",
        lastName: profile.lastName || ""
      });
      setIsEditingName(true);
    }
  };

  const handleSaveName = async () => {
    if (!profile?.id) return;

    // Basic Validation
    if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
      alert("First and Last Name are required.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("http://localhost/bistroflow/bistroflow/php-backend/public/api/update-profile.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: profile.id,
          firstName: editForm.firstName,
          middleName: editForm.middleName,
          lastName: editForm.lastName
        })
      });

      const data = await response.json();
      
      if (data.success && data.user) {
        // Update local profile state
        setProfile(prev => prev ? ({
          ...prev,
          firstName: data.user.firstName,
          middleName: data.user.middleName,
          lastName: data.user.lastName,
          name: data.user.name
        }) : null);

        // Update global auth store
        updateUser({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          name: data.user.name
        });

        setIsEditingName(false);
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (e) {
      console.error("Update error:", e);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="container-edge min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-edge min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <IconUser className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Profile</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className={`${btnPrimary} w-full justify-center`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-edge py-8 md:py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header / Cover */}
        <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm">
          <div className="h-32 bg-gradient-to-r from-primary/10 via-orange-50 to-primary/5 w-full absolute top-0 left-0"></div>
          
          <div className="relative px-6 pb-6 pt-16 md:px-10 md:pt-20 md:pb-10 flex flex-col md:flex-row items-center md:items-end gap-6">
             <div className="relative group">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 relative aspect-square">
                  {profile?.profilePic ? (
                    <img 
                      src={profile.profilePic} 
                      alt={profile.name} 
                      className="w-full h-full object-cover object-center" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <IconUser className="w-12 h-12" />
                    </div>
                  )}
                  
                  {/* Overlay for upload feedback */}
                  {uploadStatus === 'uploading' && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[1px]">
                      <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-1 right-1 flex items-center gap-2">
                   {/* Status Indicator */}
                   {uploadStatus === 'success' && (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.8, x: -10 }}
                       animate={{ opacity: 1, scale: 1, x: 0 }}
                       exit={{ opacity: 0 }}
                       className="px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full shadow-md flex items-center gap-1"
                     >
                       <IconCheck className="w-3 h-3" /> Saved
                     </motion.div>
                   )}
                   
                   {uploadStatus === 'error' && (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.8, x: -10 }}
                       animate={{ opacity: 1, scale: 1, x: 0 }}
                       className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-md flex items-center gap-1 whitespace-nowrap"
                     >
                       <IconAlertCircle className="w-3 h-3" /> {uploadMessage}
                     </motion.div>
                   )}

                   <div className="w-8 h-8 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group/camera relative z-10">
                      <label htmlFor="profile-upload" className={`cursor-pointer w-full h-full flex items-center justify-center ${uploadStatus === 'uploading' ? 'cursor-not-allowed opacity-50' : ''}`}>
                         <IconCamera className="w-4 h-4 text-gray-500 group-hover/camera:text-primary transition-colors" />
                      </label>
                      <input 
                         id="profile-upload" 
                         type="file" 
                         accept="image/jpeg,image/png,image/webp"
                         className="hidden" 
                         onChange={handleFileChange}
                         disabled={uploadStatus === 'uploading'}
                      />
                   </div>
                </div>
             </div>
             
             <div className="flex-1 text-center md:text-left mb-2 w-full md:w-auto">
                {isEditingName ? (
                   <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 shadow-sm w-full max-w-md mx-auto md:mx-0">
                      <div className="grid grid-cols-3 gap-2 mb-3">
                         <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">First Name</label>
                            <input 
                              type="text" 
                              className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                              value={editForm.firstName}
                              onChange={e => setEditForm({...editForm, firstName: e.target.value})}
                              placeholder="First"
                            />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Middle</label>
                            <input 
                              type="text" 
                              className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                              value={editForm.middleName}
                              onChange={e => setEditForm({...editForm, middleName: e.target.value})}
                              placeholder="Middle"
                            />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last Name</label>
                            <input 
                              type="text" 
                              className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                              value={editForm.lastName}
                              onChange={e => setEditForm({...editForm, lastName: e.target.value})}
                              placeholder="Last"
                            />
                         </div>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                         <button 
                            onClick={() => setIsEditingName(false)}
                            className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            disabled={isSaving}
                         >
                            Cancel
                         </button>
                         <button 
                            onClick={handleSaveName}
                            disabled={isSaving}
                            className={`px-3 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors flex items-center gap-1.5 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                         >
                            {isSaving ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Saving...
                              </>
                            ) : (
                              'Save Changes'
                            )}
                         </button>
                      </div>
                   </div>
                ) : (
                   <>
                      <div className="flex items-center justify-center md:justify-start gap-2 group/edit cursor-pointer" onClick={handleEditClick}>
                         <h1 className="text-3xl font-bold text-gray-900 font-display">{getFullName()}</h1>
                         <div className="opacity-0 group-hover/edit:opacity-100 transition-opacity p-1.5 bg-gray-100 rounded-full text-gray-500 hover:text-primary hover:bg-primary/10">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                               <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                               <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                         </div>
                      </div>
                      <p className="text-gray-500 font-medium">{profile?.email}</p>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
                         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                            User
                         </span>
                         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                            <IconClock className="w-3.5 h-3.5" />
                            Joined {new Date(profile?.joinedAt || "").toLocaleDateString()}
                         </span>
                      </div>
                   </>
                )}
             </div>

             <div className="flex gap-3">
                <button 
                  onClick={() => {
                     logout();
                     router.push("/login");
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:text-red-600 transition-colors flex items-center gap-2"
                >
                  <IconLogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
             </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-3 gap-6">
           {/* Sidebar Info */}
           <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                 <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <IconUser className="w-5 h-5 text-primary" />
                    Personal Details
                 </h3>
                 
                 <div className="space-y-4">
                    <div className="group">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Full Name</label>
                       <p className="font-medium text-gray-900">{getFullName()}</p>
                    </div>
                    
                    <div className="group">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Email Address</label>
                       <p className="font-medium text-gray-900 truncate" title={profile?.email}>{profile?.email}</p>
                    </div>

                    <div className="group">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">User ID</label>
                       <p className="font-mono text-sm bg-gray-50 inline-block px-2 py-1 rounded text-gray-600 select-all">{profile?.id}</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Main Column */}
           <div className="md:col-span-2 space-y-6">
              {/* Recent Activity Placeholder */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900 text-lg">Recent Orders</h3>
                    <Link href="/dashboard" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                       Go to Dashboard <IconArrowRight className="w-3 h-3" />
                    </Link>
                 </div>
                 
                 <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-gray-300">
                       <IconClock className="w-8 h-8" />
                    </div>
                    <p className="text-gray-900 font-medium">Check your Dashboard</p>
                    <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                       View your active and past orders on the main dashboard page.
                    </p>
                    <Link href="/dashboard" className={`mt-4 inline-flex ${btnPrimary} text-sm`}>
                       View Dashboard
                    </Link>
                 </div>
              </div>

              {/* Security / Account Actions */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                 <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                    <IconKey className="w-5 h-5 text-gray-400" />
                    Account Security
                 </h3>
                 
                 <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div>
                       <p className="font-medium text-gray-900">Password</p>
                       <p className="text-xs text-gray-500 mt-0.5">Last changed: Never</p>
                    </div>
                    <button className="text-sm font-medium text-gray-600 hover:text-primary transition-colors px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow">
                       Change Password
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
