"use client";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Alumni } from "@/app/page";

export default function Hero({ alumni }: { alumni: Alumni[] }) {
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="flex flex-col items-center justify-center text-center min-h-screen px-6 bg-gradient-to-b from-background to-muted relative border-b-8 border-primary">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute left-0 -translate-x-16 rotate-[-90deg] text-center">
              <p className="text-black font-semibold text-lg tracking-tight">
                Connect with
              </p>
            </div>

            <h1 className="text-[8rem] md:text-[12rem] lg:text-[19rem] font-extrabold text-black text-primary leading-none m-0">
              {alumni.length}
            </h1>

            <div className="absolute right-0 translate-x-16 rotate-90 text-center">
              <p className="text-black font-semibold text-lg tracking-tight">
                Alumni
              </p>
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight">
          Students Association of Satkhira
        </h1>
        {/* <p className="text-muted-foreground mb-8 text-lg max-w-xl">
          Connecting students and alumni across the region.
        </p> */}
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
