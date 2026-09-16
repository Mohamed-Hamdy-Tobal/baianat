import { cn } from "@/lib/utils";

type MainContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function MainContainer({ children, className }: MainContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8", className)}>{children}</div>
  );
}
