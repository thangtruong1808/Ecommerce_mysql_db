import { useCallback, useEffect, useState, type ReactNode } from "react";
import { FaBars } from "react-icons/fa";
import SidebarNavigation from "./SidebarNavigation";
import { ThemeToggle } from "../ui";

interface AdminLayoutProps {
  children: ReactNode;
}

function desktopSidebar() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(desktopSidebar);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !desktopSidebar()) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-canvas text-ink">
      <SidebarNavigation isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div
        className={`flex min-w-0 flex-1 flex-col overflow-y-auto ${isSidebarOpen ? "lg:ml-64" : "lg:ml-0"}`}
      >
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface px-3 sm:px-4">
          <button
            type="button"
            onClick={() => setIsSidebarOpen((open) => !open)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-ui-sm text-ink hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            aria-label={isSidebarOpen ? "Close admin menu" : "Open admin menu"}
            aria-expanded={isSidebarOpen}
          >
            <FaBars aria-hidden="true" />
          </button>
          <p className="min-w-0 flex-1 truncate font-ui text-sm font-semibold text-ink">Store admin</p>
          <ThemeToggle />
        </header>
        <div className="min-w-0 p-3 sm:p-4">{children}</div>
      </div>
    </div>
  );
}
