import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { toast } from "sonner";
import { useAppDispatch } from "../store/hooks";
import { create } from "../store/achievementsSlice";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  tags: z.array(z.string().min(1)).max(10, "Too many tags").default([]),
});

type FormData = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateAchievementDialog({ open, onClose }: Props) {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
    },
  });

  const tags = watch("tags");

  const onSubmit = (data: FormData) => {
    dispatch(create(data));
    toast.success("Achievement created");
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>New Achievement</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-4">
          <TextField
            {...register("title")}
            label="Title"
            required
            fullWidth
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            {...register("description")}
            label="Description"
            multiline
            rows={4}
            fullWidth
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={tags}
            onChange={(_, value) => setValue("tags", value, { shouldValidate: true })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                placeholder="Press Enter to add tag"
                error={!!errors.tags}
                helperText={errors.tags?.message}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
              ))
            }
          />
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="outlined">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

