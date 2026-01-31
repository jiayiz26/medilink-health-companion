import { Star, MapPin, Calendar, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Doctor } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctorId: string) => void;
}

export function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  return (
    <div className="bg-card border rounded-xl p-5 hover:shadow-lg transition-all duration-300 group">
      <div className="flex gap-5">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center text-3xl font-bold text-primary/40 overflow-hidden relative">
            {doctor.avatar ? (
              <img src={doctor.avatar} alt={doctor.name} className="w-full h-full object-cover" />
            ) : (
              <span className="select-none">{doctor.name.charAt(0)}</span>
            )}
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-900" title="Online now" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                Dr. {doctor.name}
              </h4>
              <p className="text-sm text-muted-foreground font-medium">{doctor.specialty}</p>
            </div>
            {doctor.badges[0] && (
              <Badge variant="secondary" className="hidden sm:inline-flex text-[10px] uppercase tracking-wider">
                {doctor.badges[0]}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 bg-secondary/30 px-2 py-1 rounded-md">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < Math.floor(doctor.rating) ? "fill-current" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="font-semibold">{doctor.rating}</span>
              <span className="text-muted-foreground text-xs underline decoration-dotted">
                ({doctor.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate max-w-[150px]">{doctor.address}</span>
              <span>({doctor.distance})</span>
            </div>
          </div>

          {/* Slots Row */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-3.5 w-3.5 text-green-600" />
              <span className="text-xs font-medium text-green-600">Next available: {doctor.nextAvailable}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {doctor.slots.slice(0, 3).map((slot) => (
                <Button
                  key={slot}
                  variant="outline"
                  size="sm"
                  className="h-8 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-200 hover:bg-green-100 hover:border-green-300"
                  onClick={() => onBook(doctor.id)}
                >
                  {slot}
                </Button>
              ))}
              <Button size="sm" onClick={() => onBook(doctor.id)} className="ml-auto">
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
