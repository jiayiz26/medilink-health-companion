import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { AlertTriangle, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main className="flex-1 flex flex-col pt-16 lg:pt-0">
        {/* COMPLIANCE BANNER */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <p>
              <strong>Not Medical Advice:</strong> MediLink is an AI assistant for informational purposes only.
              In an emergency, call 911 immediately.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="whitespace-nowrap bg-white dark:bg-transparent border-amber-300 hover:bg-amber-100 text-amber-900 dark:text-amber-100">
            <Link to="/booking">
              <Stethoscope className="mr-2 h-3 w-3" />
              Book a Doctor
            </Link>
          </Button>
        </div>

        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
