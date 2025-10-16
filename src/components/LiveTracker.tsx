import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RouteCard from "./RouteCard";
import { MapPin, List } from "lucide-react";

const LiveTracker = () => {
  const [activeView, setActiveView] = useState<"map" | "list">("list");

  const mockRoutes = [
    {
      routeNumber: "A1",
      routeName: "Main Campus - North Gate",
      currentLocation: "Library Junction",
      estimatedTime: "5 mins",
      status: "on-time" as const,
      vehicleType: "bus" as const,
    },
    {
      routeNumber: "B2",
      routeName: "Hostel Block - East Campus",
      currentLocation: "Sports Complex",
      estimatedTime: "12 mins",
      status: "delayed" as const,
      vehicleType: "van" as const,
    },
    {
      routeNumber: "C3",
      routeName: "Metro Station - Main Gate",
      currentLocation: "Main Gate",
      estimatedTime: "Arrived",
      status: "arrived" as const,
      vehicleType: "bus" as const,
    },
    {
      routeNumber: "D4",
      routeName: "Downtown - Campus Center",
      currentLocation: "City Mall",
      estimatedTime: "8 mins",
      status: "on-time" as const,
      vehicleType: "bus" as const,
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Live Route Tracker
          </h2>
          <p className="text-muted-foreground text-lg">
            Real-time updates for all active routes
          </p>
        </div>

        <Tabs defaultValue="list" className="w-full" onValueChange={(v) => setActiveView(v as "map" | "list")}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Map View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {mockRoutes.map((route) => (
                <RouteCard key={route.routeNumber} {...route} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map">
            <Card className="p-8 min-h-[500px] bg-gradient-card border-border/50 backdrop-blur">
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Interactive Map</h3>
                  <p className="text-muted-foreground max-w-md">
                    Live map integration will show real-time vehicle locations and routes.
                    Enable Lovable Cloud to add map functionality with live tracking.
                  </p>
                  <Badge className="bg-primary text-primary-foreground">Coming Soon</Badge>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default LiveTracker;
