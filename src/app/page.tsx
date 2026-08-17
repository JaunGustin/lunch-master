"use client";

import { useState } from "react";
import { TicketBooklet } from "@/components/TicketBooklet";

type Mode = "individual" | "familiar";

export default function Home() {
  const [mode, setMode] = useState<Mode>("individual");

  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-4 py-12">
      <h1 className="font-mono text-xl text-foreground">Lunch Master (Tiquetera)</h1>

      <div className="flex gap-1 rounded-full border border-dashed border-muted/40 p-1">
        {(
          [
            ["individual", "Individual"],
            ["familiar", "Familiar"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setMode(value)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              mode === value ? "bg-accent text-background" : "text-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "individual" ? (
        <TicketBooklet
          title="Tiquetera individual"
          storageKey="tiquetera-individual"
          quickAmounts={[1, 2, 3, 4, 5]}
          allowUndo
        />
      ) : (
        <TicketBooklet
          title="Tiquetera familiar"
          storageKey="tiquetera-familiar"
          quickAmounts={[1]}
          allowUndo={false}
        />
      )}
    </div>
  );
}
