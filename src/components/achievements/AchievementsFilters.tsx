import { useState } from "react";
import { TextField, Autocomplete, Chip } from "@mui/material";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface AchievementsFiltersProps {
  q: string;
  fromDate: string;
  toDate: string;
  tags: string[];
  allTags: string[];
  onQChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onTagsChange: (value: string[]) => void;
  onReset: () => void;
}

export default function AchievementsFilters({
  q,
  fromDate,
  toDate,
  tags,
  allTags,
  onQChange,
  onFromDateChange,
  onToDateChange,
  onTagsChange,
  onReset,
}: AchievementsFiltersProps) {
  const [localQ, setLocalQ] = useState(q);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="glass rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="label text-sm">Filters</h2>
          <button
            onClick={onReset}
            className="rounded-xl border hairline px-3 py-1.5 text-xs tracking-[0.24em] text-white/80 hover:bg-white/10 transition"
          >
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search..."
            value={localQ}
            onChange={(e) => {
              setLocalQ(e.target.value);
              onQChange(e.target.value);
            }}
          />

          {/* Date From */}
          <DatePicker
            label="From Date"
            value={fromDate ? dayjs(fromDate) : null}
            onChange={(date) => {
              onFromDateChange(date ? date.format("YYYY-MM-DD") : "");
            }}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
              },
            }}
          />

          {/* Date To */}
          <DatePicker
            label="To Date"
            value={toDate ? dayjs(toDate) : null}
            onChange={(date) => {
              onToDateChange(date ? date.format("YYYY-MM-DD") : "");
            }}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
              },
            }}
          />

          {/* Tags */}
          <Autocomplete
            multiple
            size="small"
            options={allTags}
            value={tags}
            onChange={(_, newValue) => {
              onTagsChange(newValue);
            }}
            renderInput={(params) => <TextField {...params} placeholder="Tags" />}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                />
              ))
            }
          />
        </div>
      </div>
    </LocalizationProvider>
  );
}

