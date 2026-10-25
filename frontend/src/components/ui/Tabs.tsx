import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "./cn";
import { focusRing } from "./styles";

export interface TabItem {
  id: string;
  label: string;
  panel: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
}

export function Tabs({
  tabs,
  label,
  value,
  defaultValue,
  onChange,
}: TabsProps) {
  const autoId = useId();
  const [uncontrolled, setUncontrolled] = useState(
    defaultValue ?? tabs[0]?.id ?? "",
  );
  const selected = value ?? uncontrolled;
  const tablistRef = useRef<HTMLDivElement>(null);

  const select = (id: string) => {
    if (value === undefined) {
      setUncontrolled(id);
    }
    onChange?.(id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = tabs.findIndex((tab) => tab.id === selected);
    if (current < 0 || tabs.length === 0) {
      return;
    }
    let next = current;
    if (event.key === "ArrowRight") {
      next = (current + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      next = (current - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = tabs.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    const tab = tabs[next];
    if (!tab) {
      return;
    }
    select(tab.id);
    tablistRef.current
      ?.querySelector<HTMLButtonElement>(`[data-tab-index="${next}"]`)
      ?.focus();
  };

  return (
    <div>
      <div
        ref={tablistRef}
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-1 rounded-ui bg-surface-muted p-1"
      >
        {tabs.map((tab, index) => {
          const active = tab.id === selected;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${autoId}-tab-${index}`}
              data-tab-index={index}
              aria-selected={active}
              aria-controls={`${autoId}-panel-${index}`}
              tabIndex={active ? 0 : -1}
              onClick={() => select(tab.id)}
              className={cn(
                "rounded-ui px-3 py-2 font-ui text-sm font-semibold",
                focusRing,
                active
                  ? "bg-surface text-ink shadow-ui"
                  : "text-muted hover:text-ink",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab, index) =>
        tab.id === selected ? (
          <div
            key={tab.id}
            role="tabpanel"
            id={`${autoId}-panel-${index}`}
            aria-labelledby={`${autoId}-tab-${index}`}
            tabIndex={0}
            className="pt-4 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {tab.panel}
          </div>
        ) : null,
      )}
    </div>
  );
}
