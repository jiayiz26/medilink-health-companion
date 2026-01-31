import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlotPicker } from "@/components/booking/TimeSlotPicker";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Check, Calendar as CalendarIcon, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { extendedMockDoctors } from "@/lib/mockData";

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
];

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const confirmBooking = () => {
    if (selectedDate && selectedSlot && selectedDoctor) {
      setBookingConfirmed(true);
      toast({
        title: "Appointment Booked!",
        description: `Your appointment has been scheduled for ${selectedDate.toLocaleDateString()} at ${selectedSlot}`,
      });
    }
  };

  const selectedDoctorData = extendedMockDoctors.find((d) => d.id === selectedDoctor);

  if (bookingConfirmed && selectedDoctorData) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="medical-card p-8 space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
            <Check className="h-8 w-8 text-success" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-muted-foreground">
              Your appointment has been scheduled with Dr. {selectedDoctorData.name}.
            </p>
          </div>
          <Button onClick={() => setBookingConfirmed(false)} variant="outline">
            Book Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Book an Appointment
        </h1>
        <p className="text-muted-foreground mt-1">
          Select a doctor, then choose your preferred time.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Doctor Selection List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <div className="bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-primary">1</div>
            Select a Provider
          </h3>
          <div className="space-y-4">
            {extendedMockDoctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoctor(doc.id)}
                className={cn(
                  "cursor-pointer border rounded-xl p-4 transition-all duration-200 flex items-start gap-4",
                  selectedDoctor === doc.id
                    ? "ring-2 ring-primary border-transparent bg-primary/5"
                    : "bg-card hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-primary/30"
                )}
              >
                <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-slate-500 overflow-hidden">
                  {doc.avatar ? <img src={doc.avatar} className="w-full h-full object-cover" /> : doc.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-foreground">{doc.name}</h4>
                    <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground font-medium">
                      {doc.specialty}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500">
                      <Star className="w-3 h-3 fill-current" /> {doc.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {doc.distance}
                    </span>
                  </div>
                </div>

                <div className="self-center">
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    selectedDoctor === doc.id ? "border-primary bg-primary" : "border-slate-300"
                  )}>
                    {selectedDoctor === doc.id && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Date & Time (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <div className="bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-primary">2</div>
              Select Time
            </h3>

            <div className="bg-card border rounded-xl p-4 shadow-sm space-y-6">
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="w-4 h-4" /> Date
                </h4>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border p-2"
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3 text-sm text-muted-foreground">Available Time Slots</h4>
                <TimeSlotPicker
                  slots={timeSlots}
                  selectedSlot={selectedSlot}
                  onSelect={setSelectedSlot}
                />
              </div>

              <Button
                onClick={confirmBooking}
                className="w-full h-12 text-lg shadow-lg"
                disabled={!selectedDoctor || !selectedDate || !selectedSlot}
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
