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
  decrementLabel = "Decrease quantity",
  incrementLabel = "Increase quantity",
  inputLabel = "Quantity",
  className,
  ...props
}: QuantityStepperProps) {
  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && (max === undefined || value < max);

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
      className={cn("inline-flex items-center gap-0 rounded-md border border-border bg-surface", className)}
      {...props}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-10 shrink-0 rounded-none rounded-s-md"
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
          "h-10 w-12 border-x border-border bg-surface text-center text-sm font-medium text-text",
          "focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-10 shrink-0 rounded-none rounded-e-md"
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
