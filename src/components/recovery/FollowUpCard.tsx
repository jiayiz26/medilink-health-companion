import { MessageCircle, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FollowUp {
  id: string;
  type: "check-in" | "reminder" | "question";
  message: string;
  time: string;
  responded: boolean;
  response?: "positive" | "negative";
}

interface FollowUpCardProps {
  followUp: FollowUp;
  onRespond: (id: string, response: "positive" | "negative") => void;
}

export function FollowUpCard({ followUp, onRespond }: FollowUpCardProps) {
  const typeConfig = {
    "check-in": { icon: MessageCircle, color: "text-primary" },
    reminder: { icon: Clock, color: "text-warning" },
    question: { icon: MessageCircle, color: "text-accent" },
  };

  const { icon: Icon, color } = typeConfig[followUp.type];

  return (
    <div className="medical-card p-4 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg bg-muted", color)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-foreground leading-relaxed">
            {followUp.message}
          </p>
          <span className="text-xs text-muted-foreground mt-1 block">
            {followUp.time}
          </span>
        </div>
      </div>

      {!followUp.responded ? (
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-success border-success/30 hover:bg-success/10"
            onClick={() => onRespond(followUp.id, "positive")}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Yes, feeling better
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={() => onRespond(followUp.id, "negative")}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Need help
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "mt-3 px-3 py-2 rounded-lg text-sm",
            followUp.response === "positive"
              ? "bg-success/10 text-success"
              : "bg-destructive/10 text-destructive"
          )}
        >
          {followUp.response === "positive"
            ? "Great! Keep up the recovery."
            : "A care coordinator will reach out shortly."}
        </div>
      )}
    </div>
  );
}
