import { useCallback, useEffect, useState, type ReactNode } from "react";
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
      <SidebarNavigation
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((open) => !open)}
        onClose={closeSidebar}
      />
      <div
        className={`flex min-w-0 flex-1 flex-col overflow-y-auto ${isSidebarOpen ? "lg:ml-64" : "lg:ml-0"}`}
      >
        <header
          className={`sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line bg-surface ${
            isSidebarOpen ? "px-3 sm:px-4" : "py-0 pl-16 pr-3 sm:pr-4"
          }`}
        >
          <p className="font-ui text-sm font-semibold text-ink">Store admin</p>
          <ThemeToggle />
        </header>
        <div className="p-3 sm:p-4">{children}</div>
      </div>
    </div>
  );
}
