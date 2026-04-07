"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

interface SubmitButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  disabled?: boolean;
  onClick?: () => Promise<void>;
}

export function SubmitButton({
  children,
  className,
  variant = "default",
  disabled,
  onClick,
}: SubmitButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");

  useEffect(() => {
    if (state === "success") {
      const timer = setTimeout(() => setState("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  if (onClick) {
    return (
      <Button
        type="button"
        variant={state === "success" ? "default" : variant}
        className={`transition-all ${className ?? ""} ${state === "success" ? "bg-green-600 hover:bg-green-600 text-white" : ""}`}
        disabled={disabled || state === "loading"}
        onClick={async () => {
          setState("loading");
          try {
            await onClick();
            setState("success");
          } catch {
            setState("idle");
          }
        }}
      >
        {state === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {state === "success" && <Check className="mr-2 h-4 w-4" />}
        {state === "success" ? "Opgeslagen!" : state === "loading" ? "Opslaan..." : children}
      </Button>
    );
  }

  return (
    <Button
      type="submit"
      variant={state === "success" ? "default" : variant}
      className={`transition-all ${className ?? ""} ${state === "success" ? "bg-green-600 hover:bg-green-600 text-white" : ""}`}
      disabled={disabled || state === "loading"}
    >
      {state === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {state === "success" && <Check className="mr-2 h-4 w-4" />}
      {state === "success" ? "Opgeslagen!" : state === "loading" ? "Opslaan..." : children}
    </Button>
  );
}

// Hook version for forms that use action={} pattern
export function useSubmitState() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (state === "success") {
      const timer = setTimeout(() => setState("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  async function handleAction<T>(action: () => Promise<T>): Promise<T | undefined> {
    setState("loading");
    try {
      const result = await action();
      setState("success");
      return result;
    } catch (e) {
      setState("error");
      throw e;
    }
  }

  return { state, setState, handleAction };
}
