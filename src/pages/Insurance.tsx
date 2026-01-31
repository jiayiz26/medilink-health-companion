import { useState } from "react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { DoctorCard } from "@/components/booking/DoctorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Search, MapPin, Loader2, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateAIResponse } from "@/lib/keywordsai";

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
  // Existing state
  const [selectedInsurance, setSelectedInsurance] = useState<string>("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [zipCode, setZipCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<typeof mockDoctorResults | null>(null);

  // NEW STATE for Billing Advocate
  const [denialText, setDenialText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const navigate = useNavigate();

  // Existing Search Handler
  const handleSearch = async () => {
    if (!selectedInsurance || !zipCode) return;
    setIsSearching(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setResults(mockDoctorResults);
    setIsSearching(false);
  };

  const handleBook = (doctorId: string) => {
    navigate("/booking");
  };

  // NEW: Billing Agent Handler
  const handleAnalyzeBill = async () => {
    if (!denialText) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Call the specialized BILLING agent
      const response = await generateAIResponse(
        [{ role: "user", content: denialText }],
        "BILLING" // This triggers the specialized prompt in backend
      );

      // If response is a string (JSON string), parse it
      let parsed = response;
      if (typeof response === 'string') {
        try {
          // Clean up potential markdown blocks if backend sends them
          const cleaned = response.replace(/```json/g, "").replace(/```/g, "").trim();
          parsed = JSON.parse(cleaned);
        } catch (e) {
          // Fallback if AI didn't return perfect JSON
          parsed = {
            error_type: "General Analysis",
            summary: response,
            appeal_letter: "Could not automatically generate a formal letter. Please review the summary."
          };
        }
      }
      setAnalysisResult(parsed);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Insurance & Billing Advocate
        </h1>
        <p className="text-muted-foreground mt-1">
          Find care within your network or fight incorrect medical bills.
        </p>
      </div>

      <Tabs defaultValue="find-care" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="find-care">Find In-Network Care</TabsTrigger>
          <TabsTrigger value="advocate">Bill & Denial Advocate</TabsTrigger>
        </TabsList>

        {/* TAB 1: FIND CARE (Existing functionality) */}
        <TabsContent value="find-care" className="space-y-6">
          <div className="medical-card p-6 space-y-4">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">Provider Matcher</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Insurance Provider</label>
                <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {insuranceProviders.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Specialty</label>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    {specialties.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">ZIP Code</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="ZIP" value={zipCode} onChange={e => setZipCode(e.target.value)} />
                </div>
              </div>

              <div className="flex items-end">
                <Button onClick={handleSearch} disabled={!selectedInsurance || !zipCode || isSearching} className="w-full">
                  {isSearching ? <Loader2 className="animate-spin h-4 w-4" /> : "Search"}
                </Button>
              </div>
            </div>
          </div>

          {results && (
            <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
              {results.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} onBook={() => handleBook(doctor.id)} />
              ))}
            </div>
          )}

          {!results && !isSearching && (
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p>Select insurance and ZIP to find doctors.</p>
            </div>
          )}
        </TabsContent>

        {/* TAB 2: BILLING ADVOCATE (New Feature) */}
        <TabsContent value="advocate">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Analyze Denial Letter
                </CardTitle>
                <CardDescription>
                  Paste the text from your insurance denial letter or medical bill.
                  Our AI agent will identify errors and draft an appeal for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste letter text here (e.g., 'We cannot cover procedure 99213 because it is deemed experimental...')"
                  className="min-h-[150px]"
                  value={denialText}
                  onChange={(e) => setDenialText(e.target.value)}
                />
                <Button onClick={handleAnalyzeBill} disabled={isAnalyzing || !denialText} className="w-full">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing with Legal Agent...
                    </>
                  ) : (
                    "Analyze & Draft Appeal"
                  )}
                </Button>
              </CardContent>
            </Card>

            {analysisResult && (
              <div className="space-y-6 animate-fade-in pb-10">
                {/* Analysis Summary */}
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="text-lg">Analysis Result</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <span className="font-semibold">Issue Detected: </span>
                        {analysisResult.error_type || "General Denial"}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{analysisResult.summary}</p>
                  </CardContent>
                </Card>

                {/* Generated Appeal Letter */}
                <Card className="bg-slate-50 dark:bg-slate-900 border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Drafted Appeal Letter</CardTitle>
                      <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(analysisResult.appeal_letter)}>
                        Copy to Clipboard
                      </Button>
                    </div>
                    <CardDescription>You can copy this text, fill in your details, and mail it.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap font-mono text-sm bg-background p-4 rounded border shadow-sm">
                      {analysisResult.appeal_letter}
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <div className="medical-card p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" /> Recommended Next Steps
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                    {analysisResult.next_steps?.map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    )) || <li>Review the letter and send via certified mail.</li>}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
