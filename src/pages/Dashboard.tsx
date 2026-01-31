import { useState, useEffect } from "react";
import { AppointmentCard } from "@/components/dashboard/AppointmentCard";
import { MedicationCalendar } from "@/components/dashboard/MedicationCalendar";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { ProfileSwitcher, profiles, type Profile } from "@/components/dashboard/ProfileSwitcher";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockAppointments = [
  {
    id: "1",
    doctor: "Sarah Chen",
    specialty: "Primary Care",
    date: "Feb 5, 2026",
    time: "10:30 AM",
    location: "HealthFirst Clinic, Suite 201",
    type: "in-person" as const,
  },
  {
    id: "2",
    doctor: "Michael Rivera",
    specialty: "Cardiology",
    date: "Feb 12, 2026",
    time: "2:00 PM",
    location: "Virtual Visit",
    type: "virtual" as const,
  },
  {
    id: "3",
    doctor: "Emily Watson",
    specialty: "Physical Therapy",
    date: "Feb 14, 2026",
    time: "9:00 AM",
    location: "PT Plus Center",
    type: "in-person" as const,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentProfile, setCurrentProfile] = useState<Profile>(profiles[0]);
  const [healthAlert, setHealthAlert] = useState<any>(null);

  useEffect(() => {
    // FEATURE 2: Dashboard Pulse - Check for recent Triage results
    const saved = localStorage.getItem("latestTriage");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Only show if less than 1 hour old
        if (Date.now() - parsed.timestamp < 3600000) {
          setHealthAlert(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleProfileChange = (profile: Profile) => {
    setCurrentProfile(profile);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Welcome back, {currentProfile.name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground">
              {currentProfile.isOwn
                ? "Here's your health overview for today"
                : `Viewing ${currentProfile.relationship.toLowerCase()}'s health overview`}
            </p>
            <ProfileSwitcher
              currentProfile={currentProfile}
              onProfileChange={handleProfileChange}
            />
          </div>
        </div>
        <Button onClick={() => navigate("/symptoms")} className="gap-2">
          <MessageCircle className="h-4 w-4" />
          Check Symptoms
        </Button>
      </div>

      {/* FEATURE 2: Dashboard Pulse Card */}
      {healthAlert && (
        <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-xl p-4 flex items-start gap-4 animate-slide-up relative">
          <div className={`p-2 rounded-full ${healthAlert.severity === 'emergency' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
            <MessageCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-orange-900 dark:text-orange-100">
              New Health Action Required
            </h3>
            <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
              {healthAlert.recommendation}
            </p>
            {healthAlert.suggested_specialty && (
              <Button
                variant="link"
                className="p-0 h-auto text-orange-700 font-semibold mt-2"
                onClick={() => navigate("/insurance?query=" + encodeURIComponent(healthAlert.suggested_specialty))}
              >
                Book {healthAlert.suggested_specialty} Appointment →
              </Button>
            )}
          </div>
          <button
            onClick={() => {
              setHealthAlert(null);
              localStorage.removeItem("latestTriage");
            }}
            className="text-orange-400 hover:text-orange-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <QuickStats />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Upcoming Appointments
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/booking")}
            >
              View all
            </Button>
          </div>
          <div className="space-y-3">
            {mockAppointments.map((apt, index) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                isNext={index === 0}
              />
            ))}
          </div>
        </div>

        {/* Medication Calendar */}
        <div>
          <MedicationCalendar />
        </div>
      </div>
    </div>
  );
}
