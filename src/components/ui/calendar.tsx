import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { clsx } from "clsx";

interface CalendarProps {
  selected?: Dayjs | null;
  onSelect?: (date: Dayjs | null) => void;
  month?: Dayjs;
  onMonthChange?: (month: Dayjs) => void;
}

export function Calendar({
  selected,
  onSelect,
  month = dayjs(),
  onMonthChange,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(month);

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const startDate = startOfMonth.startOf("week");
  const endDate = endOfMonth.endOf("week");

  const days: Dayjs[] = [];
  let current = startDate;
  while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
    days.push(current);
    current = current.add(1, "day");
  }

  const weeks: Dayjs[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const handlePrevMonth = () => {
    const newMonth = currentMonth.subtract(1, "month");
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = currentMonth.add(1, "month");
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const isSelected = (date: Dayjs) => {
    return selected && date.isSame(selected, "day");
  };

  const isToday = (date: Dayjs) => {
    return date.isSame(dayjs(), "day");
  };

  const isCurrentMonth = (date: Dayjs) => {
    return date.isSame(currentMonth, "month");
  };

  return (
    <div className="w-full min-w-[280px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button
          onClick={handlePrevMonth}
          className="rounded-xl border hairline bg-white/5 p-2 text-white/80 hover:bg-white/10 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div className="text-sm font-medium text-white/85">
          {currentMonth.format("MMMM YYYY")}
        </div>
        <button
          onClick={handleNextMonth}
          className="rounded-xl border hairline bg-white/5 p-2 text-white/80 hover:bg-white/10 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2 px-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-xs text-white/45 text-center py-2 label"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 px-1">
        {weeks.map((week) =>
          week.map((date) => (
            <button
              key={date.format("YYYY-MM-DD")}
              onClick={() => onSelect?.(date)}
              className={clsx(
                "h-10 w-10 rounded-xl text-sm transition-colors",
                "hover:bg-white/10",
                {
                  "text-white/80": isCurrentMonth(date),
                  "text-white/30": !isCurrentMonth(date),
                  "bg-white/15 border border-white/25": isSelected(date),
                  "border border-white/20": isToday(date) && !isSelected(date),
                  "font-semibold": isSelected(date) || isToday(date),
                }
              )}
            >
              {date.format("D")}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
