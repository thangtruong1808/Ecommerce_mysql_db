import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useTheme } from "../../theme/ThemeProvider";
import type { ThemeMode } from "../../theme/theme";
import { cn } from "./cn";
import { focusRing } from "./styles";

const OPTIONS: { mode: ThemeMode; label: string }[] = [
  { mode: "light", label: "Light" },
  { mode: "dark", label: "Dark" },
  { mode: "system", label: "System" },
];

interface ThemeToggleProps {
  tone?: "inverse" | "surface";
  className?: string;
}

function ThemeIcon({ mode }: { mode: ThemeMode }) {
  if (mode === "dark") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M21 14.5A8.5 8.5 0 1110.5 3a7 7 0 0010.5 11.5z" />
      </svg>
    );
  }
  if (mode === "system") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function ThemeToggle({ tone = "surface", className }: ThemeToggleProps) {
  const { mode, setMode } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const current = OPTIONS.find((option) => option.mode === mode) ?? OPTIONS[2];

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    menuRef.current
      ?.querySelector<HTMLButtonElement>('[aria-checked="true"]')
      ?.focus();

    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  const choose = (next: ThemeMode) => {
    setMode(next);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ??
        [],
    );
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
      return;
    }
    if (items.length === 0) {
      return;
    }
    let next = index;
    if (event.key === "ArrowDown") {
      next = index < 0 ? 0 : (index + 1) % items.length;
    } else if (event.key === "ArrowUp") {
      next = index < 0 ? items.length - 1 : (index - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = items.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    items[next]?.focus();
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        className={cn(
          "inline-flex items-center justify-center rounded-ui-sm p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          tone === "inverse"
            ? "text-white hover:text-blue-100 focus-visible:ring-white focus-visible:ring-offset-blue-600"
            : cn(
                "border border-line bg-surface text-ink hover:bg-surface-muted",
                focusRing,
              ),
        )}
        aria-label={`Theme: ${current.label}. Open theme menu`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <ThemeIcon mode={mode} />
      </button>
      {open ? (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label="Theme"
          onKeyDown={onMenuKeyDown}
          className="absolute right-0 z-50 mt-2 w-36 rounded-ui border border-line bg-surface p-1 text-ink shadow-ui-md"
        >
          {OPTIONS.map((option) => {
            const selected = option.mode === mode;
            return (
              <button
                key={option.mode}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => choose(option.mode)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-ui-sm px-2 py-2 text-left text-sm",
                  focusRing,
                  selected ? "bg-primary/10 text-primary" : "hover:bg-surface-muted",
                )}
              >
                <ThemeIcon mode={option.mode} />
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
