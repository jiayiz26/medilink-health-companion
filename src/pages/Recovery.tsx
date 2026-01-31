import { useState } from "react";
import { FollowUpCard } from "@/components/recovery/FollowUpCard";
import { Progress } from "@/components/ui/progress";
import { HeartPulse, TrendingUp, Calendar, Pill } from "lucide-react";
import { generateAIResponse } from "@/lib/keywordsai";

interface FollowUp {
  id: string;
  type: "check-in" | "reminder" | "question";
  message: string;
  time: string;
  responded: boolean;
  response?: "positive" | "negative";
}

const initialFollowUps: FollowUp[] = [
  {
    id: "1",
    type: "question",
    message:
      "How is your wound healing today? Any signs of redness, swelling, or discharge?",
    time: "Just now",
    responded: false,
  },
  {
    id: "2",
    type: "reminder",
    message:
      "Time for your 2 PM antibiotics (Amoxicillin 500mg). Take with food for best absorption.",
    time: "2:00 PM",
    responded: false,
  },
  {
    id: "3",
    type: "check-in",
    message:
      "Your follow-up appointment with Dr. Chen is scheduled for tomorrow at 10:30 AM. Reply if you need to reschedule.",
    time: "Yesterday",
    responded: true,
    response: "positive",
  },
  {
    id: "4",
    type: "question",
    message:
      "On a scale of 1-10, how would you rate your pain level today compared to yesterday?",
    time: "Yesterday",
    responded: true,
    response: "positive",
  },
];

const recoveryMilestones = [
  { label: "Surgery Complete", completed: true },
  { label: "Day 1 Check-in", completed: true },
  { label: "Day 3 Check-in", completed: true },
  { label: "Day 7 Check-in", completed: false },
  { label: "Follow-up Visit", completed: false },
];

export default function Recovery() {
  const [followUps, setFollowUps] = useState<FollowUp[]>(initialFollowUps);

  const handleRespond = async (id: string, response: "positive" | "negative") => {
    setFollowUps((prev) =>
      prev.map((fu) =>
        fu.id === id ? { ...fu, responded: true, response } : fu
      )
    );

    try {
      const previousQuestion = followUps.find(f => f.id === id)?.message;
      const nextQuestion = await generateAIResponse(
        [
          { role: "assistant", content: previousQuestion || "How are you feeling?" },
          { role: "user", content: `My response was ${response}.` }
        ],
        'RECOVERY',
        'demo_patient_recovery'
      );

      if (typeof nextQuestion === 'string' && nextQuestion.trim()) {
        setFollowUps(prev => [{
          id: Date.now().toString(),
          type: "question" as const,
          message: nextQuestion,
          time: "Just now",
          responded: false
        }, ...prev]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const completedMilestones = recoveryMilestones.filter((m) => m.completed).length;
  const progress = (completedMilestones / recoveryMilestones.length) * 100;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Recovery Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Post-discharge follow-up and care coordination
        </p>
      </div>

      {/* Recovery Progress */}
      <div className="medical-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-success/10">
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Recovery Progress</h3>
            <p className="text-sm text-muted-foreground">
              Post-operative care - Day 3 of 7
            </p>
          </div>
        </div>

        <Progress value={progress} className="h-3 mb-4" />

        <div className="flex justify-between text-sm">
          {recoveryMilestones.map((milestone, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center ${milestone.completed ? "text-success" : "text-muted-foreground"
                }`}
            >
              <div
                className={`w-3 h-3 rounded-full mb-1 ${milestone.completed ? "bg-success" : "bg-muted"
                  }`}
              />
              <span className="hidden sm:block text-xs max-w-[80px]">
                {milestone.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="medical-card p-4 text-center">
          <HeartPulse className="h-6 w-6 mx-auto text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">92%</p>
          <p className="text-xs text-muted-foreground">Recovery Score</p>
        </div>
        <div className="medical-card p-4 text-center">
          <Calendar className="h-6 w-6 mx-auto text-accent mb-2" />
          <p className="text-2xl font-bold text-foreground">4</p>
          <p className="text-xs text-muted-foreground">Days to Follow-up</p>
        </div>
        <div className="medical-card p-4 text-center">
          <Pill className="h-6 w-6 mx-auto text-warning mb-2" />
          <p className="text-2xl font-bold text-foreground">3/5</p>
          <p className="text-xs text-muted-foreground">Meds Today</p>
        </div>
      </div>

      {/* Follow-up Feed */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-primary" />
          AI Care Check-ins
        </h2>
        <div className="space-y-3">
          {followUps.map((followUp) => (
            <FollowUpCard
              key={followUp.id}
              followUp={followUp}
              onRespond={handleRespond}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
