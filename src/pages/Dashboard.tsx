import { AppointmentCard } from "@/components/dashboard/AppointmentCard";
import { MedicationCalendar } from "@/components/dashboard/MedicationCalendar";
import { QuickStats } from "@/components/dashboard/QuickStats";
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Welcome back, Alex
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your health overview for today
          </p>
        </div>
        <Button onClick={() => navigate("/symptoms")} className="gap-2">
          <MessageCircle className="h-4 w-4" />
          Check Symptoms
        </Button>
      </div>

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
