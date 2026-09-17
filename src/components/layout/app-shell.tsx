import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SkipLink } from "@/components/layout/skip-link";
import { StoreHydrator } from "@/lib/store/store-hydrator";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <StoreHydrator />
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col outline-none py-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
