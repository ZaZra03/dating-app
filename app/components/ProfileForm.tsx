/**
 * Profile form component for editing user profile information.
 * Handles display and submission of profile data including name, age, bio, and photo URL.
 */

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

/**
 * Profile data fields interface.
 */
interface ProfileData {
  name: string;
  age: string;
  bio: string;
  photoUrl: string;
}

/**
 * Additional profile information interface.
 */
interface AboutData {
  hobbies: string[];
  personality: string[];
  goal: string;
  idealDate: string;
}

/**
 * Props for the ProfileForm component.
 */
interface ProfileFormProps {
  initialData?: Partial<ProfileData>;
  aboutData?: AboutData;
  onSave?: (data: any) => void;
}

/**
 * Form component for editing user profile information.
 * 
 * @param props - Component props
 * @param props.initialData - Initial profile data to populate the form
 * @param props.aboutData - Additional profile information (hobbies, personality, etc.)
 * @param props.onSave - Callback function called after successful profile update
 * 
 * Features:
 * - Photo upload trigger (UI only, actual upload not implemented)
 * - Form validation for name and age
 * - Bio text area
 * - Real-time form state updates
 * - Toast notifications on success/failure
 * 
 * Side effects:
 * - Makes PATCH request to /api/users/profile on submit
 * - Updates localStorage with new user data
 * - Shows toast notifications
 */
export const ProfileForm = ({ initialData, aboutData, onSave }: ProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileData>({
    name: initialData?.name || "",
    age: initialData?.age || "",
    bio: initialData?.bio || "",
    photoUrl: initialData?.photoUrl || "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        age: initialData.age || "",
        bio: initialData.bio || "",
        photoUrl: initialData.photoUrl || "",
      });
    }
  }, [initialData]);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: formData.name,
          age: Number(formData.age),
          bio: formData.bio,
          photoUrl: formData.photoUrl,
          hobbies: aboutData?.hobbies || [],
          personality: aboutData?.personality || [],
          goal: aboutData?.goal || "",
          idealDate: aboutData?.idealDate || "",
        }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const updatedUser = await res.json();
      toast({
        title: "Profile Updated! ✨",
        description: "Your changes have been saved.",
      });
      onSave?.(updatedUser);
    } catch (err) {
      console.error(err);
      toast({
        title: "Update Failed",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  /**
   * Triggers the file input click to open the photo upload dialog.
   */
  const handlePhotoUpload = () => fileInputRef.current?.click();

  /**
   * Handles file selection and uploads the photo to Supabase Storage.
   * 
   * @param e - File input change event
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/photo", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Upload failed");
      }

      const data = await res.json();
      setFormData((prev) => ({ ...prev, photoUrl: data.url }));
      toast({
        title: "Photo uploaded! ✨",
        description: "Your photo has been uploaded successfully.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto text-center">
      {/* Profile Image */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg border border-gray-300 bg-gray-100">
          {formData.photoUrl ? (
            <img
              src={formData.photoUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <Camera className="w-12 h-12 text-gray-500" />
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          className="hover:bg-black hover:text-white transition-colors duration-300"
          size="sm"
          onClick={handlePhotoUpload}
          disabled={isUploading}
        >
          <Camera className="w-4 h-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload Photo"}
        </Button>
      </div>

      {/* Form Fields */}
      <div className="space-y-2 text-left">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Your name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          placeholder="Your age"
          value={formData.age}
          onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          value={formData.bio}
          onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
          className="min-h-[100px]"
        />
      </div>

      <Button
        type="submit"
        variant="outline"
        className="w-full hover:bg-black hover:text-white transition-colors duration-300"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Profile
      </Button>
    </form>
  );
};
