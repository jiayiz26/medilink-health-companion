import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlotPicker } from "@/components/booking/TimeSlotPicker";
import { DoctorCard } from "@/components/booking/DoctorCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Check, Calendar as CalendarIcon } from "lucide-react";

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

  const handleBook = (doctorId: string) => {
    setSelectedDoctor(doctorId);
  };

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
              Your appointment has been scheduled
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Doctor:</span>{" "}
              <span className="font-medium">Dr. {selectedDoctorData.name}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Date:</span>{" "}
              <span className="font-medium">
                {selectedDate?.toLocaleDateString()}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">Time:</span>{" "}
              <span className="font-medium">{selectedSlot}</span>
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Book an Appointment
        </h1>
        <p className="text-muted-foreground mt-1">
          Select a date, time, and doctor for your visit
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="medical-card p-4">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Select Date
          </h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date()}
            className="rounded-md pointer-events-auto"
          />
        </div>

        {/* Time Slots */}
        <div className="medical-card p-4">
          <h3 className="font-semibold text-foreground mb-4">
            Available Times
          </h3>
          <TimeSlotPicker
            slots={timeSlots}
            selectedSlot={selectedSlot}
            onSelect={setSelectedSlot}
          />
          {selectedSlot && (
            <p className="mt-4 text-sm text-success">
              Selected: {selectedSlot}
            </p>
          )}
        </div>

        {/* Doctors */}
        <div className="lg:col-span-1">
          <h3 className="font-semibold text-foreground mb-4">
            Available Doctors
          </h3>
          <div className="space-y-3">
            {extendedMockDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onBook={handleBook}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      {selectedDoctor && selectedSlot && selectedDate && (
        <div className="fixed bottom-4 left-0 right-0 px-4 lg:static lg:px-0 animate-slide-up">
          <div className="max-w-md mx-auto lg:max-w-none">
            <div className="medical-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="font-medium text-foreground">
                  Dr. {selectedDoctorData?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedDate.toLocaleDateString()} at {selectedSlot}
                </p>
              </div>
              <Button onClick={confirmBooking} size="lg">
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
