import { Calendar, Pill, HeartPulse, Clock } from "lucide-react";

const stats = [
  {
    label: "Upcoming Visits",
    value: "3",
    icon: Calendar,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Medications",
    value: "5",
    icon: Pill,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    label: "Recovery Score",
    value: "92%",
    icon: HeartPulse,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    label: "Next Check-in",
    value: "2h",
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
];

export function QuickStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="medical-card p-4 animate-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-lg ${stat.bgColor}`}
            >
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
