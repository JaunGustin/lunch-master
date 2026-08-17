"use client";

import { useEffect, useState } from "react";
import { todayBogota } from "./colombiaDate";

const TOTAL = 30;

export type Movement = { date: string; amount: number };

export type BookletState = {
  remaining: number;
  startDate: string;
  history: Movement[];
};

function defaultState(): BookletState {
  return { remaining: TOTAL, startDate: todayBogota(), history: [] };
}

export function useBooklet(storageKey: string) {
  const [state, setState] = useState<BookletState | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    // Client-only hydration from localStorage; no SSR value to sync against.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(raw ? (JSON.parse(raw) as BookletState) : defaultState());
  }, [storageKey]);

  useEffect(() => {
    if (state) localStorage.setItem(storageKey, JSON.stringify(state));
  }, [storageKey, state]);

  function subtract(amount: number): boolean {
    if (!state || amount <= 0) return true;
    if (amount > state.remaining) return false;
    setState({
      ...state,
      remaining: state.remaining - amount,
      history: [{ date: todayBogota(), amount }, ...state.history],
    });
    return true;
  }

  function add(amount: number) {
    if (!state) return;
    setState({ ...state, remaining: Math.min(TOTAL, state.remaining + amount) });
  }

  function reset() {
    setState(defaultState());
  }

  function resetWithStartDate(date: string) {
    setState({ remaining: TOTAL, startDate: date, history: [] });
  }

  return { state, total: TOTAL, subtract, add, reset, resetWithStartDate };
}
