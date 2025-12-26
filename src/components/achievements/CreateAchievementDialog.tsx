import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Chip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import type { Achievement } from "../../store/achievementsSlice";
import { achievementSchema } from "../../schemas/achievementSchema";
import type { AchievementFormData } from "../../schemas/achievementSchema";
import { useState } from "react";

interface CreateAchievementDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: Omit<Achievement, "id">) => void;
}

export default function CreateAchievementDialog({
  open,
  onClose,
  onCreate,
}: CreateAchievementDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<AchievementFormData>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [] as string[],
      createdAt: dayjs().toISOString(),
    },
  });

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [tagInput, setTagInput] = useState<string[]>([]);

  const onSubmit = (data: AchievementFormData) => {
    onCreate({
      title: data.title,
      description: data.description,
      tags: tagInput,
      createdAt: data.createdAt,
    });
    reset();
    setTagInput([]);
    setSelectedDate(dayjs());
    onClose();
  };

  const handleClose = () => {
    reset();
    setTagInput([]);
    setSelectedDate(dayjs());
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Create New Achievement</DialogTitle>
          <DialogContent>
            <div className="space-y-4 py-4">
              <TextField
                {...register("title")}
                label="Title"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
                required
              />

              <TextField
                {...register("description")}
                label="Description"
                fullWidth
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
              />

              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={tagInput}
                onChange={(_, newValue) => {
                  setTagInput(newValue);
                  setValue("tags", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    helperText="Press Enter to add a tag"
                  />
                )}
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

              <DatePicker
                label="Created Date"
                value={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  if (date) {
                    setValue("createdAt", date.toISOString());
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!errors.createdAt,
                    helperText: errors.createdAt?.message,
                  },
                }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}

