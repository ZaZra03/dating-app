"use client";

import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/ProfileForm";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { withAuth } from "@/lib/withAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const defaultAbout = { hobbies: [], personality: [], goal: "", idealDate: "" };

const Profile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromOnboarding = searchParams.get('from') === 'onboarding';
  const [aboutData, setAboutData] = useState(defaultAbout);
  const [userData, setUserData] = useState({ name: "", age: "", bio: "", photoUrl: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch("/api/users/profile", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const user = await res.json();
          try { localStorage.setItem("data", JSON.stringify(user)); } catch {}
          setUserData({
            name: user?.name || "",
            age: (user?.age ?? "").toString(),
            bio: user?.bio || "",
            photoUrl: user?.photoUrl || user?.photo || "",
          });
          setAboutData({
            hobbies: Array.isArray(user?.hobbies) ? user.hobbies : [],
            personality: Array.isArray(user?.personality) ? user.personality : [],
            goal: typeof user?.goal === "string" ? user.goal : "",
            idealDate: typeof user?.idealDate === "string" ? user.idealDate : "",
          });
        }
      } catch {}
    };
    fetchProfile();
  }, []);

  const handleSave = (updated: any) => {
    try { localStorage.setItem("data", JSON.stringify(updated)); } catch {}
    setAboutData({
      hobbies: Array.isArray(updated?.hobbies) ? updated.hobbies : [],
      personality: Array.isArray(updated?.personality) ? updated.personality : [],
      goal: typeof updated?.goal === "string" ? updated.goal : "",
      idealDate: typeof updated?.idealDate === "string" ? updated.idealDate : "",
    });
    setUserData({
      name: updated?.name || "",
      age: (updated?.age ?? "").toString(),
      bio: updated?.bio || "",
      photoUrl: updated?.photoUrl || updated?.photo || ""
    });
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    if (fromOnboarding) {
      router.replace('/discover');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-romantic flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-6 flex justify-between items-center border-b border-gray-200 bg-black">
        <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2 text-white bg-black hover:bg-white hover:text-black transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </header>

      {/* Main */}
      <main className="flex-1 w-full px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Your Profile</h1>
            <p className="text-muted-foreground text-lg">Make a great first impression ✨</p>
          </div>

          {/* Unified Profile Card */}
          <section className="bg-card border border-gray-200 rounded-3xl shadow-md p-8 space-y-10">
            {/* About You */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-center mb-4">About You</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Hobbies</p>
                  <div className="flex flex-wrap gap-2">
                    {aboutData.hobbies.length > 0 ? (
                      aboutData.hobbies.map((h) => (
                        <Badge key={h} variant="outline">{h}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No hobbies selected</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Personality</p>
                  <div className="flex flex-wrap gap-2">
                    {aboutData.personality.length > 0 ? (
                      aboutData.personality.map((p) => (
                        <Badge key={p} variant="outline">{p}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No traits selected</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Goal</p>
                  <p className="font-medium">{aboutData.goal || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ideal Date</p>
                  <p className="font-medium text-gray-700 whitespace-pre-line">{aboutData.idealDate || "—"}</p>
                </div>
              </div>
            </div>
            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Edit Profile */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-center">Edit Profile</h2>
              <ProfileForm
                initialData={userData}
                aboutData={aboutData}
                onSave={handleSave}
              />
            </div>
          </section>
        </div>
      </main>

      {/* Success Modal */}
      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent className="bg-white text-black dark:bg-neutral-900 dark:text-white border border-gray-200 dark:border-neutral-800">
          <AlertDialogHeader className="text-center">
            <AlertDialogTitle className="text-xl font-bold">Profile Updated! ✨</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-300">Your changes have been saved successfully.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSuccessClose}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default withAuth(Profile);
