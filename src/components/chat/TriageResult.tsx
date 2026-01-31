import { AlertTriangle, Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TriageResultProps {
  severity: "emergency" | "urgent" | "routine";
  recommendation: string;
  onBookAppointment?: () => void;
}

export function TriageResult({
  severity,
  recommendation,
  onBookAppointment,
}: TriageResultProps) {
  const config = {
    emergency: {
      title: "Seek Emergency Care",
      icon: AlertTriangle,
      bgColor: "bg-destructive/10",
      textColor: "text-destructive",
      borderColor: "border-destructive/30",
    },
    urgent: {
      title: "Schedule Soon",
      icon: Calendar,
      bgColor: "bg-warning/10",
      textColor: "text-warning",
      borderColor: "border-warning/30",
    },
    routine: {
      title: "Book Appointment",
      icon: Calendar,
      bgColor: "bg-success/10",
      textColor: "text-success",
      borderColor: "border-success/30",
    },
  };

  const { title, icon: Icon, bgColor, textColor, borderColor } = config[severity];

  return (
    <div
      className={cn(
        "rounded-xl border-2 p-4 space-y-3 animate-slide-up",
        bgColor,
        borderColor
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className={cn("h-5 w-5", textColor)} />
        <span className={cn("font-semibold", textColor)}>{title}</span>
      </div>
      <p className="text-sm text-foreground">{recommendation}</p>
      <div className="flex gap-2">
        {severity === "emergency" ? (
          <Button variant="destructive" className="flex-1">
            <Phone className="h-4 w-4 mr-2" />
            Call 911
          </Button>
        ) : (
          <Button onClick={onBookAppointment} className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
        )}
      </div>
    </div>
  );
}
