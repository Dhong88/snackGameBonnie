import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="font-arcade text-6xl text-accent neon-text-pink mb-4">404</h1>
          <p className="font-orbitron text-xl text-foreground mb-2">GAME OVER</p>
          <p className="text-muted-foreground mb-8">This route doesn't exist</p>
          <Link to="/">
            <Button variant="default" size="lg">
              <Home className="mr-2 h-5 w-5" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
