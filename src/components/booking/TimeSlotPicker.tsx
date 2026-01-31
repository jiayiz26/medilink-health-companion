import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TimeSlotPickerProps {
  slots: string[];
  selectedSlot: string | null;
  onSelect: (slot: string) => void;
}

export function TimeSlotPicker({
  slots,
  selectedSlot,
  onSelect,
}: TimeSlotPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {slots.map((slot) => (
        <Button
          key={slot}
          variant={selectedSlot === slot ? "default" : "outline"}
          size="sm"
          className={cn(
            "transition-all",
            selectedSlot === slot && "ring-2 ring-primary ring-offset-2"
          )}
          onClick={() => onSelect(slot)}
        >
          {slot}
        </Button>
      ))}
    </div>
  );
}
