import { useState } from "react";
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
  interests: string;
  photoUrl: string;
}

interface ProfileFormProps {
  initialData?: Partial<ProfileData>;
  onSave?: (data: ProfileData) => void;
}

export const ProfileForm = ({ initialData, onSave }: ProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileData>({
    name: initialData?.name || "",
    age: initialData?.age || "",
    bio: initialData?.bio || "",
    interests: initialData?.interests || "",
    photoUrl: initialData?.photoUrl || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock API call
    setTimeout(() => {
      toast({
        title: "Profile Updated! ✨",
        description: "Your profile is looking great!",
      });
      onSave?.(formData);
    }, 500);
  };

  const handlePhotoUpload = () => {
    // Mock photo upload
    toast({
      title: "Photo Upload",
      description: "Photo upload feature coming soon! 📸",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32 rounded-full bg-gradient-spark flex items-center justify-center shadow-spark">
          {formData.photoUrl ? (
            <img
              src={formData.photoUrl}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <Camera className="w-12 h-12 text-primary-foreground" />
          )}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handlePhotoUpload}>
          <Camera className="w-4 h-4 mr-2" />
          Upload Photo
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          placeholder="Your age"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="interests">Interests</Label>
        <Input
          id="interests"
          placeholder="Music, Travel, Coffee..."
          value={formData.interests}
          onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full bg-gradient-spark shadow-spark hover:opacity-90">
        <Save className="w-4 h-4 mr-2" />
        Save Profile
      </Button>
    </form>
  );
};
