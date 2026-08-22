"use client";

import { useState } from "react";
import { useBooklet } from "@/lib/useBooklet";
import { PerforatedStrip } from "./PerforatedStrip";
import { Modal } from "./Modal";

const HISTORY_PAGE_SIZE = 5;

const ACCENT = {
  amber: {
    text: "text-accent",
    bg: "bg-accent text-background",
    hoverBorderText: "hover:border-accent hover:text-accent",
    hoverText: "hover:text-accent",
  },
  teal: {
    text: "text-accent2",
    bg: "bg-accent2 text-background",
    hoverBorderText: "hover:border-accent2 hover:text-accent2",
    hoverText: "hover:text-accent2",
  },
} as const;

export function TicketBooklet({
  title,
  storageKey,
  quickAmounts,
  allowUndo,
  color,
}: {
  title: string;
  storageKey: string;
  quickAmounts: number[];
  allowUndo: boolean;
  color: "amber" | "teal";
}) {
  const c = ACCENT[color];
  const { state, total, subtract, add, reset, resetWithStartDate } = useBooklet(storageKey);
  const [customAmount, setCustomAmount] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [blockedAmount, setBlockedAmount] = useState<number | null>(null);
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);
  const [pendingDate, setPendingDate] = useState<string | null>(null);
  const [historyPage, setHistoryPage] = useState(0);

  if (!state) return null;

  const low = state.remaining <= 5;

  function confirmSubtract() {
    if (pendingAmount === null) return;
    if (!subtract(pendingAmount)) setBlockedAmount(pendingAmount);
    setPendingAmount(null);
  }

  function handleCustomSubtract() {
    const amount = parseInt(customAmount, 10);
    if (!Number.isFinite(amount) || amount <= 0) return;
    setPendingAmount(amount);
    setCustomAmount("");
  }

  const historyPageCount = Math.max(1, Math.ceil(state.history.length / HISTORY_PAGE_SIZE));
  const historySlice = state.history.slice(
    historyPage * HISTORY_PAGE_SIZE,
    historyPage * HISTORY_PAGE_SIZE + HISTORY_PAGE_SIZE
  );
  const formattedStart = new Date(`${state.startDate}T00:00:00`).toLocaleDateString("es-CO", {
    month: "long",
    day: "numeric",
  });
  const formattedStartCapitalized =
    formattedStart.charAt(0).toUpperCase() + formattedStart.slice(1);

  return (
    <section className="w-full max-w-md rounded-2xl border border-dashed border-muted/40 bg-surface p-6 sm:p-8">
      <div className="mb-6 text-center">
        <h2 className={`font-mono text-2xl font-bold ${c.text}`}>{title}</h2>
        <p className="mt-3 text-xs uppercase tracking-widest text-muted">Inicio de tiquetera</p>
        <p className="font-mono text-sm text-foreground">{formattedStartCapitalized}</p>
        <input
          type="date"
          value={state.startDate}
          onChange={(e) => setPendingDate(e.target.value)}
          className="mx-auto mt-2 block rounded border border-muted/40 bg-transparent px-2 py-1 font-mono text-xs text-foreground"
        />
      </div>

      <div className="mt-5">
        <PerforatedStrip total={total} remaining={state.remaining} low={low} color={color} />
      </div>

      <p
        className={`mt-6 text-center font-mono text-6xl font-bold ${
          low ? "text-danger" : c.text
        }`}
      >
        {state.remaining}
      </p>
      <p className="text-center text-sm text-muted">
        {low ? "Últimos tiquetes" : "Tiquetes restantes"}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {quickAmounts.map((n) => (
          <button
            key={n}
            onClick={() => setPendingAmount(n)}
            className={`rounded-md border border-dashed border-muted/40 px-3 py-2 font-mono text-sm text-foreground ${c.hoverBorderText}`}
          >
            -{n}
          </button>
        ))}
        {allowUndo && (
          <button
            onClick={() => add(1)}
            className={`rounded-md border border-dashed border-muted/40 px-3 py-2 font-mono text-sm text-muted ${c.hoverBorderText}`}
          >
            +1
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <input
          type="number"
          min={1}
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          placeholder="Cantidad"
          className="w-32 rounded-md border border-muted/40 bg-transparent px-2 py-1.5 text-center font-mono text-sm text-foreground"
        />
        <button
          onClick={handleCustomSubtract}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${c.bg}`}
        >
          Restar
        </button>
      </div>

      <div className="mt-6 text-center text-xs">
        <button onClick={() => setConfirmReset(true)} className="text-danger hover:underline">
          Reiniciar tiquetera
        </button>
      </div>

      <div className="mt-6 border-t border-dashed border-muted/30 pt-4">
        <ul className="h-24 space-y-1 font-mono text-xs text-muted">
          {historySlice.length > 0 ? (
            historySlice.map((m, i) => (
              <li key={historyPage * HISTORY_PAGE_SIZE + i} className="flex justify-between">
                <span>{m.date}</span>
                <span>-{m.amount}</span>
              </li>
            ))
          ) : (
            <li className="text-center">Sin movimientos</li>
          )}
        </ul>
        <div
          className={`mt-3 flex items-center justify-between font-mono text-xs text-muted ${
            historyPageCount > 1 ? "" : "invisible"
          }`}
        >
          <button
            onClick={() => setHistoryPage((p) => Math.max(0, p - 1))}
            disabled={historyPage === 0}
            className={`disabled:opacity-30 ${c.hoverText}`}
          >
            ← Anteriores
          </button>
          <span>
            {historyPage + 1} / {historyPageCount}
          </span>
          <button
            onClick={() => setHistoryPage((p) => Math.min(historyPageCount - 1, p + 1))}
            disabled={historyPage >= historyPageCount - 1}
            className={`disabled:opacity-30 ${c.hoverText}`}
          >
            Siguientes →
          </button>
        </div>
      </div>

      {pendingAmount !== null && (
        <Modal
          title="Confirmar resta"
          message={`¿Restar ${pendingAmount} tiquete${pendingAmount === 1 ? "" : "s"}?`}
          confirmLabel="Restar"
          onConfirm={confirmSubtract}
          onClose={() => setPendingAmount(null)}
        />
      )}

      {pendingDate !== null && (
        <Modal
          title="Cambiar fecha de inicio"
          message="Cambiar la fecha de inicio reinicia la tiquetera a 30 y borra el historial. ¿Continuar?"
          confirmLabel="Cambiar y reiniciar"
          danger
          onConfirm={() => {
            resetWithStartDate(pendingDate);
            setHistoryPage(0);
            setPendingDate(null);
          }}
          onClose={() => setPendingDate(null)}
        />
      )}

      {confirmReset && (
        <Modal
          title="Reiniciar tiquetera"
          message="Esto vuelve el contador a 30, borra el historial y fija el inicio a hoy. ¿Continuar?"
          confirmLabel="Reiniciar"
          danger
          onConfirm={() => {
            reset();
            setHistoryPage(0);
            setConfirmReset(false);
          }}
          onClose={() => setConfirmReset(false)}
        />
      )}

      {blockedAmount !== null && (
        <Modal
          title="No alcanza"
          message={`Quedan ${state.remaining} tiquetes, no se puede restar ${blockedAmount}.`}
          onClose={() => setBlockedAmount(null)}
        />
      )}
    </section>
  );
}
