import { cn } from "@/lib/utils";

type MainContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function MainContainer({ children, className }: MainContainerProps) {
  return <div className={cn("container mx-auto px-4 sm:px-6", className)}>{children}</div>;
}
