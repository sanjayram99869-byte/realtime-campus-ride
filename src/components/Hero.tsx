import { Button } from "@/components/ui/button";
import { MapPin, Clock, Navigation } from "lucide-react";
import heroImage from "@/assets/hero-transport.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="College Transport"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block">
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Navigation className="h-4 w-4" />
              <span className="text-sm font-medium">Real-Time Tracking</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            Track Your
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              College Transport
            </span>
            in Real-Time
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Never miss your bus again. Get live location updates and accurate arrival times
            for all college transport routes.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button size="lg" className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-elevated transition-all">
              <MapPin className="h-5 w-5 mr-2" />
              View Live Map
            </Button>
            <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/10 transition-all">
              <Clock className="h-5 w-5 mr-2" />
              Check Routes
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground mt-1">Live Tracking</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">12+</div>
              <div className="text-sm text-muted-foreground mt-1">Active Routes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">99%</div>
              <div className="text-sm text-muted-foreground mt-1">Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
