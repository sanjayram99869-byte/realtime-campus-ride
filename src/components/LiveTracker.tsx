import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RouteCard from "./RouteCard";
import { MapPin, List, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Route {
  id: string;
  route_number: string;
  route_name: string;
  vehicle_type: "bus" | "van";
}

interface VehicleLocation {
  id: string;
  route_id: string;
  current_location: string;
  estimated_time: string;
  status: "on-time" | "delayed" | "arrived";
  last_updated: string;
}

interface RouteWithLocation extends Route {
  location?: VehicleLocation;
}

const LiveTracker = () => {
  const [activeView, setActiveView] = useState<"map" | "list">("list");
  const [routes, setRoutes] = useState<RouteWithLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRoutesWithLocations = async () => {
    try {
      // Fetch routes
      const { data: routesData, error: routesError } = await supabase
        .from("routes")
        .select("*")
        .eq("is_active", true)
        .order("route_number");

      if (routesError) throw routesError;

      // Fetch latest vehicle locations
      const { data: locationsData, error: locationsError } = await supabase
        .from("vehicle_locations")
        .select("*")
        .order("last_updated", { ascending: false });

      if (locationsError) throw locationsError;

      // Combine routes with their latest location
      const routesWithLocations: RouteWithLocation[] = routesData?.map((route) => {
        const location = locationsData?.find((loc) => loc.route_id === route.id);
        return {
          id: route.id,
          route_number: route.route_number,
          route_name: route.route_name,
          vehicle_type: route.vehicle_type as "bus" | "van",
          location: location ? {
            id: location.id,
            route_id: location.route_id,
            current_location: location.current_location,
            estimated_time: location.estimated_time,
            status: location.status as "on-time" | "delayed" | "arrived",
            last_updated: location.last_updated,
          } : undefined,
        };
      }) || [];

      setRoutes(routesWithLocations);
    } catch (error) {
      console.error("Error fetching routes:", error);
      toast({
        title: "Error loading routes",
        description: "Failed to fetch route information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutesWithLocations();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("vehicle_locations_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "vehicle_locations",
        },
        (payload) => {
          console.log("Real-time update:", payload);
          fetchRoutesWithLocations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Loading routes...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
            {routes.length === 0 ? (
              <Card className="p-12 text-center bg-gradient-card border-border/50">
                <p className="text-muted-foreground">No active routes found</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {routes.map((route) => (
                  <RouteCard
                    key={route.id}
                    routeNumber={route.route_number}
                    routeName={route.route_name}
                    currentLocation={route.location?.current_location || "Unknown"}
                    estimatedTime={route.location?.estimated_time || "N/A"}
                    status={route.location?.status || "on-time"}
                    vehicleType={route.vehicle_type}
                  />
                ))}
              </div>
            )}
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
                    Map view with GPS coordinates coming soon!
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
