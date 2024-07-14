import React from "react";
import { FlipWords } from "@/components/ui/flip-words";

export function FlipWordsDemo() {
  const words = ["faster", "easier", "incognito", "decentralised"];

  return (
    <div className="h-[5rem] text-3xl flex justify-center items-center px-4">
      <div className="mx-auto font-normal">
        Trade
        <FlipWords words={words} /> <br />
      </div>
    </div>
  );
}
