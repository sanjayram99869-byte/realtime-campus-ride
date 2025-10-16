import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bus, Clock, MapPin } from "lucide-react";

interface RouteCardProps {
  routeNumber: string;
  routeName: string;
  currentLocation: string;
  estimatedTime: string;
  status: "on-time" | "delayed" | "arrived";
  vehicleType: "bus" | "van";
}

const RouteCard = ({
  routeNumber,
  routeName,
  currentLocation,
  estimatedTime,
  status,
  vehicleType,
}: RouteCardProps) => {
  const statusColors = {
    "on-time": "bg-success text-success-foreground",
    delayed: "bg-accent text-accent-foreground",
    arrived: "bg-secondary text-secondary-foreground",
  };

  const statusLabels = {
    "on-time": "On Time",
    delayed: "Delayed",
    arrived: "Arrived",
  };

  return (
    <Card className="p-6 hover:shadow-elevated transition-all duration-300 bg-gradient-card border-border/50 backdrop-blur">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Bus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Route {routeNumber}</h3>
            <p className="text-sm text-muted-foreground">{routeName}</p>
          </div>
        </div>
        <Badge className={statusColors[status]}>{statusLabels[status]}</Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">Current Location:</span>
          <span className="font-medium text-foreground">{currentLocation}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">ETA:</span>
          <span className="font-semibold text-lg text-primary">{estimatedTime}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {vehicleType === "bus" ? "Bus" : "Van"}
          </span>
          <button className="text-sm font-medium text-primary hover:text-primary-glow transition-colors">
            Track Live →
          </button>
        </div>
      </div>
    </Card>
  );
};

export default RouteCard;
