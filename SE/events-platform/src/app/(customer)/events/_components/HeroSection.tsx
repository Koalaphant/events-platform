import { FaArrowRight } from "react-icons/fa"; // Import the arrow icon
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <div
      className="h-[250px] md:h-[450px] mb-12 bg-cover bg-center relative flex flex-col justify-center items-center"
      style={{ backgroundImage: "url('/events-hero-image.jpg')" }}
    >
      <div className="absolute inset-0 bg-orange-700 opacity-60"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-orange-700 to-transparent"></div>
      <div className="relative flex flex-col items-center justify-center h-full mx-8 lg:mx-0">
        <p className="text-white text-3xl md:text-5xl mb-4 text-center">
          Unforgettable experiences await
        </p>
        <Button
          asChild
          className="flex items-center text-xl px-5 py-6 md:text-2xl md:px-9 md:py-7"
        >
          <Link href="/events" className="flex items-center">
            Explore Events
            <FaArrowRight className="ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
