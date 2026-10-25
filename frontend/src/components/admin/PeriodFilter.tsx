import type { StatsPeriod } from "@shared/common";
import { Select } from "../ui";

const periods: { value: StatsPeriod; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
  { value: "all", label: "All time" },
];

interface PeriodFilterProps {
  period: StatsPeriod;
  onPeriodChange: (period: StatsPeriod) => void;
  disabled?: boolean;
}

export default function PeriodFilter({ period, onPeriodChange, disabled = false }: PeriodFilterProps) {
  return (
    <div className="w-full sm:w-56">
      <Select
        id="dashboard-period"
        label="Period"
        options={periods}
        value={period}
        disabled={disabled}
        onChange={(event) => onPeriodChange(event.target.value as StatsPeriod)}
      />
    </div>
  );
}
