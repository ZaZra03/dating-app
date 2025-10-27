import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const hobbies = [
  "Music", "Travel", "Fitness", "Movies", 
  "Tech", "Art", "Reading", "Outdoors"
];

const personalities = [
  { emoji: "🧠", label: "Thinker" },
  { emoji: "❤️", label: "Romantic" },
  { emoji: "🎉", label: "Adventurer" },
  { emoji: "🤓", label: "Introvert" },
  { emoji: "😎", label: "Extrovert" },
];

const goals = ["Friendship", "Casual", "Serious Relationship"];

const AboutYou = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [idealDate, setIdealDate] = useState("");

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const toggleHobby = (hobby: string) => {
    setSelectedHobbies(prev =>
      prev.includes(hobby)
        ? prev.filter(h => h !== hobby)
        : [...prev, hobby]
    );
  };

  const togglePersonality = (personality: string) => {
    setSelectedPersonality(prev =>
      prev.includes(personality)
        ? prev.filter(p => p !== personality)
        : [...prev, personality]
    );
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      toast({
        title: "Profile enhanced! ✨",
        description: "Let's complete your profile",
      });
      router.push("/profile");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push("/signup");
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedHobbies.length > 0;
      case 2: return selectedPersonality.length > 0;
      case 3: return selectedGoal !== "";
      case 4: return idealDate.trim() !== "";
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Let's get to know you better 💫</h1>
          <p className="text-muted-foreground">
            A few quick questions to help us find your perfect spark.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center mt-2">
            Step {step} of {totalSteps}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card p-8 rounded-2xl shadow-card space-y-6 border border-border">
          {/* Step 1: Hobbies */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-semibold">What are your hobbies & interests?</h2>
              <p className="text-sm text-muted-foreground">Select all that apply</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {hobbies.map((hobby) => (
                  <button
                    key={hobby}
                    onClick={() => toggleHobby(hobby)}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedHobbies.includes(hobby)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {hobby}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Personality */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-semibold">How would you describe yourself?</h2>
              <p className="text-sm text-muted-foreground">Choose your personality traits</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {personalities.map((personality) => (
                  <button
                    key={personality.label}
                    onClick={() => togglePersonality(personality.label)}
                    className={`px-4 py-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      selectedPersonality.includes(personality.label)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="text-3xl">{personality.emoji}</span>
                    <span className="text-sm font-medium">{personality.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Dating Goals */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-semibold">What are you looking for?</h2>
              <p className="text-sm text-muted-foreground">Select your dating goal</p>
              <div className="space-y-3">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setSelectedGoal(goal)}
                    className={`w-full px-6 py-4 rounded-lg border-2 transition-all text-left ${
                      selectedGoal === goal
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Ideal Date */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-semibold">Describe your ideal date</h2>
              <p className="text-sm text-muted-foreground">
                Share what your perfect date would look like
              </p>
              <div className="space-y-2">
                <Label htmlFor="idealDate">Your ideal date idea</Label>
                <Textarea
                  id="idealDate"
                  placeholder="A cozy coffee shop conversation, followed by a walk in the park..."
                  value={idealDate}
                  onChange={(e) => setIdealDate(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {step === totalSteps ? "Complete" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutYou;
