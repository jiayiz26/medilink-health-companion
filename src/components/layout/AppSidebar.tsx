import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageCircle,
  Calendar,
  Shield,
  HeartPulse,
  Menu,
  X,
  Activity,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Symptoms", url: "/symptoms", icon: MessageCircle },
  { title: "Booking", url: "/booking", icon: Calendar },
  { title: "Insurance", url: "/insurance", icon: Shield },
  { title: "Recovery", url: "/recovery", icon: HeartPulse },
  { title: "Care Circle", url: "/family", icon: Users },
];

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-card shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full medical-gradient z-40 transition-all duration-300 flex flex-col",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sidebar-primary/10 backdrop-blur-sm">
            <Activity className="h-6 w-6 text-sidebar-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-sidebar-foreground">
              MediLink
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <NavLink
                key={item.url}
                to={item.url}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary/20 text-sidebar-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-primary/10 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium">{item.title}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse Toggle (Desktop) */}
        <div className="hidden lg:block p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-primary/10"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Collapse</span>}
          </Button>
        </div>
        {/* FEATURE 3: Confidential Badge */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <div className="bg-sidebar-primary/5 rounded-lg p-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-xs font-bold text-sidebar-foreground">HIPAA Compliant</p>
                <p className="text-[10px] text-muted-foreground">End-to-End Encrypted</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Spacer for content */}
      <div
        className={cn(
          "hidden lg:block flex-shrink-0 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      />
    </>
  );
}
