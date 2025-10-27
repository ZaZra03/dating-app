import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/ProfileForm";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();

  const handleSave = () => {
    // Navigate to discover after save
    setTimeout(() => router.push("/discover"), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-romantic">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Button variant="ghost" onClick={() => router.push("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-spark rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Spark</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Your Profile</h1>
            <p className="text-muted-foreground text-lg">
              Make a great first impression! ✨
            </p>
          </div>

          <div className="bg-card rounded-3xl shadow-card p-8">
            <ProfileForm
              initialData={{
                name: "Alex",
                age: "25",
                bio: "Coffee enthusiast ☕ | Love hiking 🥾 | Always up for good conversation",
                interests: "Music, Travel, Photography",
              }}
              onSave={handleSave}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
