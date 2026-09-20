"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface QuantityStepperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "default" | "touch";
  decrementLabel?: string;
  incrementLabel?: string;
  inputLabel?: string;
}

function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  size = "default",
  decrementLabel = "Decrease quantity",
  incrementLabel = "Increase quantity",
  inputLabel = "Quantity",
  className,
  ...props
}: QuantityStepperProps) {
  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && (max === undefined || value < max);
  const isTouch = size === "touch";

  const clamp = (next: number) => {
    let result = next;
    if (result < min) result = min;
    if (max !== undefined && result > max) result = max;
    return result;
  };

  const setValue = (next: number) => {
    onChange(clamp(next));
  };

  return (
    <div
      role="group"
      aria-label={inputLabel}
      className={cn(
        "flex items-center gap-0 rounded-md border border-border bg-surface w-full lg:w-auto",
        className,
      )}
      {...props}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("shrink-0 rounded-none rounded-s-md", isTouch ? "size-11" : "size-10")}
        disabled={!canDecrement}
        aria-label={decrementLabel}
        onClick={() => setValue(value - 1)}
      >
        <Minus aria-hidden />
      </Button>

      <input
        type="text"
        inputMode="numeric"
        readOnly
        value={value}
        aria-label={inputLabel}
        disabled={disabled}
        className={cn(
          "w-full lg:min-w-12 flex-1 border-x border-border bg-surface text-center text-sm font-medium text-text",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isTouch ? "h-11" : "h-10",
        )}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("shrink-0 rounded-none rounded-e-md", isTouch ? "size-11" : "size-10")}
        disabled={!canIncrement}
        aria-label={incrementLabel}
        onClick={() => setValue(value + 1)}
      >
        <Plus aria-hidden />
      </Button>
    </div>
  );
}

export { QuantityStepper };
