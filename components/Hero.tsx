"use client";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="flex flex-col items-center justify-center text-center min-h-screen px-6 bg-gradient-to-b from-background to-muted relative">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
          Student Association of Satkhira
        </h1>
        <p className="text-muted-foreground mb-8 text-lg max-w-xl">
          Connecting students and alumni across the region.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg">
            <a href="#alumni">View Alumni</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="/submit-data">Submit Your Data</a>
          </Button>
        </div>
      </div>

      <Button
        onClick={scrollToBottom}
        variant="ghost"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-transparent transition-colors duration-200"
      >
        Scroll Down
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </Button>
    </section>
  );
}
