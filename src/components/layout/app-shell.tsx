import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MainContainer } from "@/components/layout/main-container";
import { SkipLink } from "@/components/layout/skip-link";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        <MainContainer>{children}</MainContainer>
      </main>
      <Footer />
    </>
  );
}
