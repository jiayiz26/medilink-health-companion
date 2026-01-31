import { useState, useMemo } from "react";
import { Search, MapPin, Shield, Check, ChevronsUpDown, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { insuranceCarriers, commonSearches, symptomSpecialtyMap } from "@/lib/mockData";

export interface SearchCriteria {
    query: string;
    zip: string;
    carrierId: string;
    planId: string;
}

interface ZocdocSearchProps {
    onSearch: (criteria: SearchCriteria) => void;
    className?: string;
    initialCriteria?: Partial<SearchCriteria>;
}

export function ZocdocSearch({ onSearch, className, initialCriteria }: ZocdocSearchProps) {
    // State
    const [query, setQuery] = useState(initialCriteria?.query || "");
    const [zip, setZip] = useState(initialCriteria?.zip || "");
    const [selectedCarrier, setSelectedCarrier] = useState(
        initialCriteria?.carrierId ? insuranceCarriers.find(c => c.id === initialCriteria.carrierId) : null
    );
    const [selectedPlan, setSelectedPlan] = useState(
        initialCriteria?.planId && selectedCarrier
            ? selectedCarrier.plans.find(p => p.id === initialCriteria.planId)
            : null
    );

    // UI State
    const [isQueryOpen, setIsQueryOpen] = useState(false);
    const [isInsuranceOpen, setIsInsuranceOpen] = useState(false);
    const [insuranceStep, setInsuranceStep] = useState<"carrier" | "plan">("carrier");

    // Computed
    const allSearchOptions = useMemo(() => {
        const symptoms = Object.keys(symptomSpecialtyMap);
        return [...new Set([...commonSearches, ...symptoms])].sort();
    }, []);

    const handleCarrierSelect = (carrier: typeof insuranceCarriers[0]) => {
        setSelectedCarrier(carrier);
        setSelectedPlan(null);
        setInsuranceStep("plan");
    };

    const handlePlanSelect = (plan: { id: string, name: string }) => {
        setSelectedPlan(plan);
        setIsInsuranceOpen(false);
        // Reset step for next time
        setTimeout(() => setInsuranceStep("carrier"), 300);
    };

    const handleSearchClick = () => {
        onSearch({
            query,
            zip,
            carrierId: selectedCarrier?.id || "",
            planId: selectedPlan?.id || ""
        });
    };

    return (
        <div className={cn("w-full max-w-5xl mx-auto rounded-xl shadow-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800", className)}>
            {/* Yellow Brand Bar or Accent Top */}
            <div className="h-1 bg-yellow-400 w-full" />

            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">

                {/* 1. Condition/Doctor Search */}
                <div className="flex-1 relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Search className="h-5 w-5" />
                    </div>
                    <Popover open={isQueryOpen} onOpenChange={setIsQueryOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                role="combobox"
                                className="w-full h-14 justify-start pl-12 text-left font-normal text-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-none focus-visible:ring-0"
                            >
                                {query ? <span className="text-foreground font-medium">{query}</span> : <span className="text-muted-foreground">Condition, procedure, or doctor...</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" align="start">
                            <Command>
                                <CommandInput placeholder="Search conditions..." onValueChange={setQuery} />
                                <CommandList>
                                    <CommandEmpty>No results found.</CommandEmpty>
                                    <CommandGroup heading="Common Searches">
                                        {allSearchOptions.map(option => (
                                            <CommandItem
                                                key={option}
                                                onSelect={() => {
                                                    setQuery(option);
                                                    setIsQueryOpen(false);
                                                }}
                                            >
                                                <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                                                {option}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* 2. Location Search */}
                <div className="relative md:w-[25%] group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <MapPin className="h-5 w-5" />
                    </div>
                    <Input
                        className="w-full h-14 pl-12 border-0 rounded-none shadow-none text-lg focus-visible:ring-0 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        placeholder="Zip code or city"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                    />
                </div>

                {/* 3. Insurance Search (Complex) */}
                <div className="relative md:w-[35%] group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Shield className="h-5 w-5" />
                    </div>
                    <Popover open={isInsuranceOpen} onOpenChange={setIsInsuranceOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                className="w-full h-14 justify-start pl-12 text-left font-normal text-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-none focus-visible:ring-0"
                            >
                                <div className="flex flex-col items-start truncate overflow-hidden">
                                    {selectedPlan ? (
                                        <>
                                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">{selectedCarrier?.name}</span>
                                            <span className="text-sm truncate w-full text-foreground">{selectedPlan.name}</span>
                                        </>
                                    ) : (
                                        <span className="text-muted-foreground">Add insurance carrier and plan</span>
                                    )}
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[350px] p-0" align="end">
                            {insuranceStep === "carrier" ? (
                                <Command>
                                    <CommandInput placeholder="Select insurance carrier..." />
                                    <CommandList>
                                        <CommandEmpty>No carrier found.</CommandEmpty>
                                        <CommandGroup heading="Popular Carriers">
                                            {insuranceCarriers.map(carrier => (
                                                <CommandItem key={carrier.id} onSelect={() => handleCarrierSelect(carrier)} className="cursor-pointer">
                                                    <div className="flex items-center justify-between w-full">
                                                        <span>{carrier.name}</span>
                                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            ) : (
                                <div className="flex flex-col h-full">
                                    <div className="p-2 border-b bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => setInsuranceStep("carrier")} className="h-8 w-8 p-0">
                                            <ChevronRight className="h-4 w-4 rotate-180" />
                                        </Button>
                                        <span className="font-semibold text-sm">{selectedCarrier?.name} Plans</span>
                                    </div>
                                    <Command>
                                        <CommandInput placeholder="Search plan name..." />
                                        <CommandList>
                                            <CommandEmpty>No plans found.</CommandEmpty>
                                            <CommandGroup>
                                                {selectedCarrier?.plans.map(plan => (
                                                    <CommandItem key={plan.id} onSelect={() => handlePlanSelect(plan)} className="cursor-pointer">
                                                        <Check className={cn("mr-2 h-4 w-4", selectedPlan?.id === plan.id ? "opacity-100" : "opacity-0")} />
                                                        {plan.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </div>
                            )}
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Search Button */}
                <div className="p-2 bg-white dark:bg-slate-900 flex items-center justify-center md:w-auto">
                    <Button
                        size="lg"
                        className="h-10 w-full md:w-10 md:h-10 rounded-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 shadow-sm p-0 flex items-center justify-center"
                        onClick={handleSearchClick}
                    >
                        <Search className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
