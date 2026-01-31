import { Calendar, Clock, User, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  type: "in-person" | "virtual";
}

interface AppointmentCardProps {
  appointment: Appointment;
  isNext?: boolean;
}

export function AppointmentCard({ appointment, isNext }: AppointmentCardProps) {
  return (
    <div
      className={cn(
        "medical-card p-4 transition-all duration-200 hover:shadow-lg animate-fade-in",
        isNext && "ring-2 ring-primary/20"
      )}
    >
      {isNext && (
        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3">
          Next Appointment
        </span>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">
              Dr. {appointment.doctor}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {appointment.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {appointment.time}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {appointment.location}
          </div>
        </div>
        <span
          className={cn(
            "px-2 py-1 text-xs font-medium rounded-full",
            appointment.type === "virtual"
              ? "bg-accent/10 text-accent"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          {appointment.type === "virtual" ? "Virtual" : "In-Person"}
        </span>
      </div>
    </div>
  );
}
