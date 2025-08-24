import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex w-screen h-screen justify-center items-center gap-2 md:flex-row">
        <Button size="sm" disabled>
          <Loader2Icon className="animate-spin"/>
          please wait 
        </Button>
    </div>
  );
}
