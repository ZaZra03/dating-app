import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProfileData {
  name: string;
  age: string;
  bio: string;
  photoUrl: string;
}

interface AboutData {
  hobbies: string[];
  personality: string[];
  goal: string;
  idealDate: string;
}

interface ProfileFormProps {
  initialData?: Partial<ProfileData>;
  aboutData?: AboutData;
  onSave?: (data: any) => void;
}

export const ProfileForm = ({ initialData, aboutData, onSave }: ProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileData>({
    name: initialData?.name || "",
    age: initialData?.age || "",
    bio: initialData?.bio || "",
    photoUrl: initialData?.photoUrl || "",
  });

  // ✅ This ensures that when initialData updates (e.g. from localStorage),
  // the form fields update too
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
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await fetch(`${apiBase}/users/profile`, {
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
          // Include About You fields alongside profile
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


  const handlePhotoUpload = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ Show instant preview using a FileReader
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (result) {
        setFormData((prev) => ({ ...prev, photoUrl: result }));
      }
    };
    reader.readAsDataURL(file);

    // ✅ Optional upload logic (won’t interfere with preview)
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
    const uploadUrl = `${apiBase}/profile/photo`;

    const form = new FormData();
    form.append("file", file);

    setIsUploading(true);
    try {
      const res = await fetch(uploadUrl, {
        method: "POST",
        body: form,
      });

      let result: any;
      try {
        result = await res.json();
      } catch {
        result = null;
      }

      if (!res.ok) throw new Error(result?.message || "Upload failed");

      const remoteUrl = result?.url || result?.photoUrl;
      if (typeof remoteUrl === "string" && remoteUrl.length > 0) {
        setFormData((prev) => ({ ...prev, photoUrl: remoteUrl }));
      }

      toast({
        title: "Photo uploaded ✅",
        description: "Your profile photo has been updated.",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload error";
      toast({ title: "Upload failed", description: message });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-md mx-auto text-center"
    >
      {/* Profile Image */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg border border-gray-300 bg-gray-100">
          {formData.photoUrl ? (
            <img
              src={formData.photoUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                // fallback if image fails to load
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
          accept="image/*"
          onChange={handleFileChange}
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
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
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
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, age: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          value={formData.bio}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, bio: e.target.value }))
          }
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
