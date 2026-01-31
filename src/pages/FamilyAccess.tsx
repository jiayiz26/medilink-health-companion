import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Users, X, Shield, Calendar, Pill, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Caregiver {
  id: string;
  name: string;
  email: string;
  permissions: {
    viewMedications: boolean;
    viewAppointments: boolean;
    fullAccess: boolean;
  };
  status: "active" | "pending";
}

const mockCaregivers: Caregiver[] = [
  {
    id: "1",
    name: "Mom (Sarah)",
    email: "sarah.mom@email.com",
    permissions: { viewMedications: true, viewAppointments: true, fullAccess: true },
    status: "active",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john.doe@email.com",
    permissions: { viewMedications: false, viewAppointments: true, fullAccess: false },
    status: "active",
  },
  {
    id: "3",
    name: "Dr. Emily Watson",
    email: "e.watson@clinic.com",
    permissions: { viewMedications: true, viewAppointments: true, fullAccess: false },
    status: "pending",
  },
];

export default function FamilyAccess() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>(mockCaregivers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCaregiver, setNewCaregiver] = useState({
    email: "",
    viewMedications: true,
    viewAppointments: true,
    fullAccess: false,
  });

  const handleInvite = () => {
    if (!newCaregiver.email) {
      toast({
        title: "Email required",
        description: "Please enter an email address to send the invitation.",
        variant: "destructive",
      });
      return;
    }

    const caregiver: Caregiver = {
      id: Date.now().toString(),
      name: newCaregiver.email.split("@")[0],
      email: newCaregiver.email,
      permissions: {
        viewMedications: newCaregiver.viewMedications,
        viewAppointments: newCaregiver.viewAppointments,
        fullAccess: newCaregiver.fullAccess,
      },
      status: "pending",
    };

    setCaregivers([...caregivers, caregiver]);
    setNewCaregiver({ email: "", viewMedications: true, viewAppointments: true, fullAccess: false });
    setIsDialogOpen(false);

    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${newCaregiver.email}`,
    });
  };

  const handleRevoke = (id: string) => {
    setCaregivers(caregivers.filter((c) => c.id !== id));
    toast({
      title: "Access revoked",
      description: "Caregiver access has been removed.",
    });
  };

  const getPermissionLabel = (permissions: Caregiver["permissions"]) => {
    if (permissions.fullAccess) return "Full Access";
    const perms = [];
    if (permissions.viewMedications) perms.push("Medications");
    if (permissions.viewAppointments) perms.push("Appointments");
    return perms.join(" & ") || "No Access";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Family & Caregiver Access
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage who can view and help manage your health information
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Caregiver
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite a Caregiver</DialogTitle>
              <DialogDescription>
                Send an invitation to a family member or caregiver to access your health information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="caregiver@email.com"
                  value={newCaregiver.email}
                  onChange={(e) => setNewCaregiver({ ...newCaregiver, email: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <Label>Permissions</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">View Medications</span>
                    </div>
                    <Switch
                      checked={newCaregiver.viewMedications}
                      onCheckedChange={(checked) =>
                        setNewCaregiver({ ...newCaregiver, viewMedications: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">View Appointments</span>
                    </div>
                    <Switch
                      checked={newCaregiver.viewAppointments}
                      onCheckedChange={(checked) =>
                        setNewCaregiver({ ...newCaregiver, viewAppointments: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Full Access</span>
                    </div>
                    <Switch
                      checked={newCaregiver.fullAccess}
                      onCheckedChange={(checked) =>
                        setNewCaregiver({
                          ...newCaregiver,
                          fullAccess: checked,
                          viewMedications: checked || newCaregiver.viewMedications,
                          viewAppointments: checked || newCaregiver.viewAppointments,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite}>Send Invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Card */}
      <Card className="medical-card border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-4 pt-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Your Care Circle</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Share your health information securely with trusted family members and caregivers. 
              They can help manage medications, track appointments, and stay informed about your care.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Active Connections */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="text-lg">Active Connections</CardTitle>
          <CardDescription>
            People who currently have access to your health profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          {caregivers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No caregivers added yet</p>
              <p className="text-sm">Invite family members or caregivers to help manage your health</p>
            </div>
          ) : (
            <div className="space-y-3">
              {caregivers.map((caregiver) => (
                <div
                  key={caregiver.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">
                        {caregiver.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{caregiver.name}</span>
                        {caregiver.status === "pending" && (
                          <Badge variant="secondary" className="text-xs">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm text-muted-foreground">{caregiver.email}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-primary">
                          {getPermissionLabel(caregiver.permissions)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-1">
                      {caregiver.permissions.viewMedications && (
                        <div className="p-1.5 rounded bg-background" title="View Medications">
                          <Pill className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      )}
                      {caregiver.permissions.viewAppointments && (
                        <div className="p-1.5 rounded bg-background" title="View Appointments">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      )}
                      {caregiver.permissions.fullAccess && (
                        <div className="p-1.5 rounded bg-background" title="Full Access">
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRevoke(caregiver.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permissions Legend */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="text-lg">Permission Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Pill className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">View Medications</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  See medication schedules and reminders
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">View Appointments</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  See upcoming and past appointments
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">Full Access</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Complete access including booking and messaging
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
