import { useState } from "react";
import { ChevronDown, User, UserCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Profile {
  id: string;
  name: string;
  relationship: string;
  isOwn: boolean;
}

const profiles: Profile[] = [
  { id: "1", name: "Alex", relationship: "You", isOwn: true },
  { id: "2", name: "Leo", relationship: "Child", isOwn: false },
  { id: "3", name: "Mary", relationship: "Parent", isOwn: false },
];

interface ProfileSwitcherProps {
  currentProfile: Profile;
  onProfileChange: (profile: Profile) => void;
}

export function ProfileSwitcher({ currentProfile, onProfileChange }: ProfileSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 h-auto p-1.5 -ml-1.5">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <UserCircle className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-sm font-medium text-foreground">{currentProfile.name}</span>
            {!currentProfile.isOwn && (
              <span className="text-xs text-muted-foreground ml-1">
                ({currentProfile.relationship})
              </span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Switch Profile</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {profiles.map((profile) => (
          <DropdownMenuItem
            key={profile.id}
            onClick={() => onProfileChange(profile)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="font-medium">{profile.name}</span>
                <span className="text-xs text-muted-foreground ml-1.5">
                  {profile.relationship}
                </span>
              </div>
            </div>
            {currentProfile.id === profile.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { profiles };
export type { Profile };
