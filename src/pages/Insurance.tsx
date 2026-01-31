import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DoctorCard } from "@/components/booking/DoctorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Search, MapPin, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const insuranceProviders = [
  { id: "aetna", name: "Aetna" },
  { id: "bluecross", name: "BlueCross BlueShield" },
  { id: "cigna", name: "Cigna" },
  { id: "united", name: "UnitedHealthcare" },
  { id: "kaiser", name: "Kaiser Permanente" },
  { id: "humana", name: "Humana" },
];

const specialties = [
  "Primary Care",
  "Cardiology",
  "Dermatology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "OB/GYN",
];

const mockDoctorResults = [
  {
    id: "1",
    name: "Jennifer Lee",
    specialty: "Primary Care",
    rating: 4.9,
    reviews: 428,
    distance: "0.5 mi",
    nextAvailable: "Today",
    avatar: "",
    acceptsInsurance: true,
  },
  {
    id: "2",
    name: "Robert Kim",
    specialty: "Primary Care",
    rating: 4.8,
    reviews: 356,
    distance: "1.1 mi",
    nextAvailable: "Tomorrow",
    avatar: "",
    acceptsInsurance: true,
  },
  {
    id: "3",
    name: "Maria Garcia",
    specialty: "Primary Care",
    rating: 4.7,
    reviews: 289,
    distance: "1.8 mi",
    nextAvailable: "Feb 7",
    avatar: "",
    acceptsInsurance: true,
  },
  {
    id: "4",
    name: "David Thompson",
    specialty: "Primary Care",
    rating: 4.6,
    reviews: 198,
    distance: "2.3 mi",
    nextAvailable: "Feb 8",
    avatar: "",
    acceptsInsurance: true,
  },
];

export default function Insurance() {
  const [selectedInsurance, setSelectedInsurance] = useState<string>("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [zipCode, setZipCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<typeof mockDoctorResults | null>(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!selectedInsurance || !zipCode) return;

    setIsSearching(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setResults(mockDoctorResults);
    setIsSearching(false);
  };

  const handleBook = (doctorId: string) => {
    navigate("/booking");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Find In-Network Doctors
        </h1>
        <p className="text-muted-foreground mt-1">
          Search for practitioners who accept your insurance
        </p>
      </div>

      {/* Search Form */}
      <div className="medical-card p-6 space-y-4">
        <div className="flex items-center gap-2 text-primary mb-4">
          <Shield className="h-5 w-5" />
          <span className="font-semibold">Insurance Matcher</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Insurance Provider
            </label>
            <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {insuranceProviders.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Specialty
            </label>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Any specialty" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              ZIP Code
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter ZIP"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleSearch}
              disabled={!selectedInsurance || !zipCode || isSearching}
              className="w-full"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">
              {results.length} doctors found
            </h2>
            <span className="text-sm text-muted-foreground">
              Accepting{" "}
              {insuranceProviders.find((p) => p.id === selectedInsurance)?.name}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {results.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} onBook={handleBook} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!results && !isSearching && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Find covered providers
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Select your insurance provider and enter your ZIP code to find
            in-network doctors near you.
          </p>
        </div>
      )}
    </div>
  );
}
