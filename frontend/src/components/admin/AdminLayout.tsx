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
        className={`relative flex-1 overflow-y-auto ${isSidebarOpen ? "lg:ml-64" : "lg:ml-0"}`}
      >
        <div className="absolute right-3 top-2 z-20">
          <ThemeToggle />
        </div>
        <div className="p-3 pt-12 sm:p-4">{children}</div>
      </div>
    </div>
  );
}
