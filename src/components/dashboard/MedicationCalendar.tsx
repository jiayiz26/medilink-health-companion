import { useState } from "react";
import { Check, Clock, Pill } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

const mockMedications: Medication[] = [
  { id: "1", name: "Metformin", dosage: "500mg", time: "8:00 AM", taken: true },
  { id: "2", name: "Lisinopril", dosage: "10mg", time: "8:00 AM", taken: true },
  { id: "3", name: "Vitamin D", dosage: "1000 IU", time: "12:00 PM", taken: false },
  { id: "4", name: "Metformin", dosage: "500mg", time: "6:00 PM", taken: false },
  { id: "5", name: "Melatonin", dosage: "3mg", time: "9:00 PM", taken: false },
];

export function MedicationCalendar() {
  const [medications, setMedications] = useState(mockMedications);

  const toggleMedication = (id: string) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === id ? { ...med, taken: !med.taken } : med
      )
    );
  };

  const takenCount = medications.filter((m) => m.taken).length;
  const progress = (takenCount / medications.length) * 100;

  return (
    <div className="medical-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg text-foreground">
            Today's Medications
          </h3>
          <p className="text-sm text-muted-foreground">
            {takenCount} of {medications.length} taken
          </p>
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
          <Pill className="h-6 w-6 text-primary" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Medication List */}
      <div className="space-y-2 max-h-[280px] overflow-y-auto">
        {medications.map((med, index) => (
          <div
            key={med.id}
            className={cn(
              "medication-card flex items-center justify-between p-3 rounded-lg bg-secondary/50 transition-all duration-200 animate-slide-up",
              med.taken && "opacity-60"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full transition-colors",
                  med.taken
                    ? "bg-success text-success-foreground hover:bg-success/90"
                    : "bg-muted hover:bg-muted/80"
                )}
                onClick={() => toggleMedication(med.id)}
              >
                {med.taken ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <div className="h-3 w-3 rounded-full border-2 border-muted-foreground" />
                )}
              </Button>
              <div>
                <p
                  className={cn(
                    "font-medium text-sm",
                    med.taken && "line-through text-muted-foreground"
                  )}
                >
                  {med.name}
                </p>
                <p className="text-xs text-muted-foreground">{med.dosage}</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {med.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
