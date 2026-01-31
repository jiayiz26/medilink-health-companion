import { Star, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  distance: string;
  nextAvailable: string;
  avatar: string;
  acceptsInsurance: boolean;
}

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctorId: string) => void;
}

export function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  return (
    <div className="medical-card p-4 animate-fade-in hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary overflow-hidden">
          {doctor.avatar ? (
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-full h-full object-cover"
            />
          ) : (
            doctor.name.charAt(0)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate">
            Dr. {doctor.name}
          </h4>
          <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
          <div className="flex items-center gap-3 mt-2 text-sm">
            <span className="flex items-center gap-1 text-warning">
              <Star className="h-3.5 w-3.5 fill-current" />
              {doctor.rating}
              <span className="text-muted-foreground">
                ({doctor.reviews})
              </span>
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {doctor.distance}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm text-success">
          <Calendar className="h-3.5 w-3.5" />
          Next: {doctor.nextAvailable}
        </span>
        <Button size="sm" onClick={() => onBook(doctor.id)}>
          Book
        </Button>
      </div>
      {doctor.acceptsInsurance && (
        <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-accent/10 text-accent rounded-full">
          Accepts Your Insurance
        </span>
      )}
    </div>
  );
}
