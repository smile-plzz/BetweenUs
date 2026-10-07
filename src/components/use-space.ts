"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type { Snapshot } from "@/domain/model";
import type { Mutation } from "@/domain/validation";
export function useSpace() {
  const [data, setData] = useState<Snapshot | null>(null),
    [loaded, setLoaded] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [offline, setOffline] = useState(false);
  const epoch = useRef(0),
    lock = useRef(false),
    signedIn = useRef(false);
  const refresh = useCallback(async () => {
    const request = ++epoch.current;
    try {
      const res = await fetch("/api/space", { cache: "no-store" });
      if (res.status === 401) {
        if (request === epoch.current) {
          setData(null);
          signedIn.current = false;
          setOffline(false);
          setError("");
        }
        return;
      }
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      if (request === epoch.current) {
        setData(result);
        signedIn.current = true;
        setOffline(false);
      }
    } catch (e) {
      if (request === epoch.current) {
        setOffline(true);
        setError(
          e instanceof Error ? e.message : "Your space could not be reached.",
        );
      }
    } finally {
      if (request === epoch.current) setLoaded(true);
    }
  }, []);
  useEffect(() => {
    let cancelled = false;
    const requestEpoch = epoch;
    queueMicrotask(() => {
      if (!cancelled) void refresh();
    });
    const interval = setInterval(() => {
      if (
        document.visibilityState === "visible" &&
        signedIn.current &&
        !lock.current
      )
        void refresh();
    }, 4000);
    const visible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", visible);
    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", visible);
      requestEpoch.current++;
    };
  }, [refresh]);
  const act = useCallback(
    async (input: Mutation): Promise<Record<string, string>> => {
      if (lock.current) throw new Error("A change is already being saved.");
      lock.current = true;
      setBusy(true);
      setError("");
      epoch.current++;
      try {
        const res = await fetch("/api/space", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error);
        if (input.action === "join")
          history.replaceState(null, "", location.pathname);
        await refresh();
        return result;
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "This change could not be saved.",
        );
        throw e;
      } finally {
        lock.current = false;
        setBusy(false);
      }
    },
    [refresh],
  );
  return {
    data,
    loaded,
    busy,
    error,
    offline,
    refresh,
    act,
    clearError: () => setError(""),
  };
}
