import { useState, useMemo, useEffect } from "react";
import { DoctorCard } from "@/components/booking/DoctorCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertCircle, CheckCircle2, Loader2, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateAIResponse } from "@/lib/keywordsai";
import { ZocdocSearch, SearchCriteria } from "@/components/insurance/ZocdocSearch";
import { extendedMockDoctors, symptomSpecialtyMap } from "@/lib/mockData";
import { useSearchParams } from "react-router-dom";

export default function Insurance() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // -- Search State --
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    query: searchParams.get("query") || "",
    zip: "",
    carrierId: "",
    planId: ""
  });
  const [isSearching, setIsSearching] = useState(false);

  // Sync URL params to State (if they change later)
  useEffect(() => {
    const q = searchParams.get("query");
    if (q) {
      setSearchCriteria(prev => ({ ...prev, query: q }));
    }
  }, [searchParams]);

  // -- Advocacy State --
  const [denialText, setDenialText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // -- Derived Results --
  const filteredDoctors = useMemo(() => {
    let results = extendedMockDoctors;

    // 1. Filter by Text (Name or Specialty Mapping)
    if (searchCriteria.query) {
      const q = searchCriteria.query.toLowerCase();
      // Check if query maps to a specialty (e.g. "toothache" -> "Dentist")
      const mappedSpecialty = symptomSpecialtyMap[q];

      results = results.filter(doc =>
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        (mappedSpecialty && doc.specialty.includes(mappedSpecialty))
      );
    }

    // 2. Filter by Zip
    if (searchCriteria.zip) {
      results = results.filter(doc => doc.zipCode.startsWith(searchCriteria.zip));
    }

    // 3. Filter by Insurance Plan
    if (searchCriteria.planId) {
      results = results.filter(doc => doc.insurancePlans.includes(searchCriteria.planId));
    }

    return results;
  }, [searchCriteria]);

  const handleSearch = async (criteria: SearchCriteria) => {
    setIsSearching(true);
    setSearchCriteria(criteria);
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSearching(false);
  };

  const handleBook = (doctorId: string) => {
    navigate("/booking");
  };

  // -- Advocacy Handler --
  const handleAnalyzeBill = async () => {
    if (!denialText) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const response = await generateAIResponse(
        [{ role: "user", content: denialText }],
        "BILLING"
      );
      let parsed = response;
      if (typeof response === 'string') {
        try {
          const cleaned = response.replace(/```json/g, "").replace(/```/g, "").trim();
          parsed = JSON.parse(cleaned);
        } catch (e) {
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
    <div className="space-y-8 max-w-6xl mx-auto pb-20">

      {/* Header */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          Find Care & Verify Coverage
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Search for top-rated, in-network doctors or get help with insurance denials.
        </p>
      </div>

      <Tabs defaultValue="find-care" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto md:mx-0 grid-cols-2 mb-8">
          <TabsTrigger value="find-care">Find In-Network Care</TabsTrigger>
          <TabsTrigger value="advocate">Bill & Denial Advocate</TabsTrigger>
        </TabsList>

        {/* TAB 1: ZOCDOC STYLE SEARCH */}
        <TabsContent value="find-care" className="space-y-8 animate-fade-in">

          {/* Sticky Search Bar */}
          <div className="sticky top-4 z-30">
            <ZocdocSearch onSearch={handleSearch} />
          </div>

          {/* Results Area */}
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Filters / Sidebar (Mock) */}
            <div className="hidden lg:block space-y-6">
              <div className="bg-card border rounded-xl p-5 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Verified Insurance
                </h3>
                <p className="text-sm text-muted-foreground">
                  {searchCriteria.planId
                    ? "Showing doctors who accept your specific plan."
                    : "Select your plan to see accurate coverage."}
                </p>
                <div className="h-px bg-border" />

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Availability</h4>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded border-gray-300" />
                      Today
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded border-gray-300" />
                      Before 10 AM
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded border-gray-300" />
                      After 5 PM
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between pb-2">
                <h2 className="text-xl font-bold">
                  {isSearching ? "Searching..." : `${filteredDoctors.length} results found`}
                </h2>
                <span className="text-sm text-muted-foreground">Sort by: <span className="font-medium text-foreground">Recommended</span></span>
              </div>

              {isSearching ? (
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 bg-card rounded-xl border animate-pulse" />
                  ))}
                </div>
              ) : filteredDoctors.length > 0 ? (
                filteredDoctors.map(doc => (
                  <DoctorCard key={doc.id} doctor={doc} onBook={handleBook} />
                ))
              ) : (
                <div className="text-center py-12 bg-card rounded-xl border border-dashed">
                  <Shield className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-20" />
                  <h3 className="text-lg font-medium">No doctors found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or zip code.</p>
                  <Button variant="link" onClick={() => setSearchCriteria({ query: "", zip: "", planId: "", carrierId: "" })}>Clear all filters</Button>
                </div>
              )}
            </div>

          </div>
        </TabsContent>

        {/* TAB 2: BILLING ADVOCATE */}
        <TabsContent value="advocate">
          <div className="grid gap-6 max-w-3xl mx-auto">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Analyze Denial Letter
                </CardTitle>
                <CardDescription>
                  Paste the text from your insurance denial letter or medical bill.
                  Our AI agent will explore "Medical Necessity" loopholes and draft an appeal.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste text here..."
                  className="min-h-[200px] font-mono text-sm"
                  value={denialText}
                  onChange={(e) => setDenialText(e.target.value)}
                />
                <Button onClick={handleAnalyzeBill} disabled={isAnalyzing || !denialText} className="w-full h-12 text-lg">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing with Gemini 1.5 Pro...
                    </>
                  ) : (
                    "Analyze & Draft Appeal"
                  )}
                </Button>
              </CardContent>
            </Card>

            {analysisResult && (
              <div className="space-y-6 animate-slide-up pb-10">
                <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-amber-800 dark:text-amber-200">
                      <AlertCircle className="h-5 w-5" />
                      Analysis Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-semibold text-amber-900 dark:text-amber-100">Type: {analysisResult.error_type}</p>
                    <p className="text-amber-800 dark:text-amber-200/80 leading-relaxed">{analysisResult.summary}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Drafted Appeal Letter</CardTitle>
                      <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(analysisResult.appeal_letter)}>
                        Copy Text
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap font-mono text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border shadow-inner text-slate-700 dark:text-slate-300">
                      {analysisResult.appeal_letter}
                    </div>
                  </CardContent>
                </Card>

                <div className="medical-card p-6 bg-green-50 dark:bg-green-950/20 border-green-100">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-800 dark:text-green-200">
                    <CheckCircle2 className="h-5 w-5" /> Recommended Next Steps
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-green-700 dark:text-green-300">
                    {analysisResult.next_steps?.map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    )) || <li>Review and mail via certified post.</li>}
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
