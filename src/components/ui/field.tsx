import * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ControlProps = {
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
  required?: boolean;
};

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  children: React.ReactElement<ControlProps>;
}

function Field({ id, label, description, error, required, className, children, ...props }: FieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  const control = React.cloneElement(children, {
    id,
    "aria-invalid": Boolean(error) || undefined,
    "aria-describedby": describedBy,
    "aria-required": required || undefined,
    required: required || children.props.required,
  });

  return (
    <div className={cn("flex w-full flex-col gap-2", className)} {...props}>
      <Label htmlFor={id} className="text-start">
        {label}
        {required ? (
          <span className="ms-1 text-error" aria-hidden>
            *
          </span>
        ) : null}
      </Label>

      {description ? (
        <p id={descriptionId} className="text-start text-sm text-text-muted">
          {description}
        </p>
      ) : null}

      {control}

      {error ? (
        <p id={errorId} role="alert" className="text-start text-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { Field };
