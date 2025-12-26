import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  IconButton,
  Autocomplete,
  Pagination,
  Box,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "sonner";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { update, deleteAchievement } from "../store/achievementsSlice";
import type { Achievement } from "../store/achievementsSlice";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

type Filters = {
  q: string;
  from: string | null;
  to: string | null;
  tags: string;
  page: number;
  pageSize: number;
};

type Props = {
  filters: Filters;
  onFiltersChange: (updates: Partial<Filters>) => void;
};

const titleSchema = z.string().min(1, "Title is required").max(200, "Title too long");
const tagsSchema = z.array(z.string().min(1)).max(10, "Too many tags");

export default function AchievementsTable({ filters, onFiltersChange }: Props) {
  const dispatch = useAppDispatch();
  const achievements = useAppSelector((state) => state.achievements);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  // Extract all unique tags for filter
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    achievements.forEach((a) => a.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [achievements]);

  // Filter achievements
  const filteredAchievements = useMemo(() => {
    let result = [...achievements];

    // Keyword search
    if (filters.q) {
      const q = filters.q.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Date range
    if (filters.from) {
      const fromDate = dayjs(filters.from);
      result = result.filter((a) => dayjs(a.createdAt).isAfter(fromDate.subtract(1, "day")));
    }
    if (filters.to) {
      const toDate = dayjs(filters.to);
      result = result.filter((a) => dayjs(a.createdAt).isBefore(toDate.add(1, "day")));
    }

    // Tags filter
    if (filters.tags) {
      const selectedTags = filters.tags.split(",").filter(Boolean);
      result = result.filter((a) =>
        selectedTags.some((tag) => a.tags.includes(tag))
      );
    }

    return result;
  }, [achievements, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredAchievements.length / filters.pageSize);
  const paginatedAchievements = useMemo(() => {
    const start = (filters.page - 1) * filters.pageSize;
    return filteredAchievements.slice(start, start + filters.pageSize);
  }, [filteredAchievements, filters.page, filters.pageSize]);

  // Start editing
  const startEdit = (achievement: Achievement, field: string) => {
    setEditingId(achievement.id);
    setEditingField(field);
    if (field === "tags") {
      setEditValue(achievement.tags.join(", "));
    } else if (field === "createdAt") {
      setEditValue(achievement.createdAt);
    } else {
      setEditValue(achievement[field as keyof Achievement] as string || "");
    }
  };

  // Save edit
  const saveEdit = (id: string) => {
    if (!editingField) return;

    try {
      let updateData: Partial<Achievement> = { id };

      if (editingField === "title") {
        const validated = titleSchema.parse(editValue);
        updateData.title = validated;
      } else if (editingField === "description") {
        updateData.description = editValue || undefined;
      } else if (editingField === "tags") {
        const tagsArray = editValue
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        const validated = tagsSchema.parse(tagsArray);
        updateData.tags = validated;
      } else if (editingField === "createdAt") {
        const date = dayjs(editValue);
        if (!date.isValid()) {
          toast.error("Invalid date format");
          return;
        }
        updateData.createdAt = date.toISOString();
      }

      dispatch(update(updateData));
      toast.success("Achievement updated");
      setEditingId(null);
      setEditingField(null);
      setEditValue("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to update achievement");
      }
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditingField(null);
    setEditValue("");
  };

  // Delete handler
  const handleDelete = (id: string) => {
    dispatch(deleteAchievement(id));
    toast.success("Achievement deleted");
    setDeleteDialog({ open: false, id: null });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* Filters */}
      <Box className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <TextField
          size="small"
          placeholder="Search..."
          value={filters.q}
          onChange={(e) => onFiltersChange({ q: e.target.value, page: 1 })}
        />

        <Autocomplete
          multiple
          size="small"
          options={allTags}
          value={filters.tags ? filters.tags.split(",") : []}
          onChange={(_, value) => onFiltersChange({ tags: value.join(","), page: 1 })}
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

        <DatePicker
          label="From"
          value={filters.from ? dayjs(filters.from) : null}
          onChange={(date: Dayjs | null) =>
            onFiltersChange({ from: date?.toISOString() || null, page: 1 })
          }
          slotProps={{ textField: { size: "small" } }}
        />

        <DatePicker
          label="To"
          value={filters.to ? dayjs(filters.to) : null}
          onChange={(date: Dayjs | null) =>
            onFiltersChange({ to: date?.toISOString() || null, page: 1 })
          }
          slotProps={{ textField: { size: "small" } }}
        />

        <TextField
          select
          size="small"
          label="Per Page"
          value={filters.pageSize}
          onChange={(e) => onFiltersChange({ pageSize: Number(e.target.value), page: 1 })}
          SelectProps={{
            native: true,
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </TextField>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAchievements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" className="text-white/50">
                  No achievements found
                </TableCell>
              </TableRow>
            ) : (
              paginatedAchievements.map((achievement) => (
                <TableRow key={achievement.id}>
                  {/* Title */}
                  <TableCell
                    onClick={() => startEdit(achievement, "title")}
                    style={{ cursor: "pointer" }}
                  >
                    {editingId === achievement.id && editingField === "title" ? (
                      <TextField
                        size="small"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => saveEdit(achievement.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(achievement.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        autoFocus
                      />
                    ) : (
                      achievement.title
                    )}
                  </TableCell>

                  {/* Description */}
                  <TableCell
                    onClick={() => startEdit(achievement, "description")}
                    style={{ cursor: "pointer", maxWidth: 300 }}
                  >
                    {editingId === achievement.id && editingField === "description" ? (
                      <TextField
                        size="small"
                        multiline
                        maxRows={3}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => saveEdit(achievement.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") cancelEdit();
                        }}
                        autoFocus
                      />
                    ) : (
                      <span className="muted2">
                        {achievement.description || "—"}
                      </span>
                    )}
                  </TableCell>

                  {/* Tags */}
                  <TableCell>
                    {editingId === achievement.id && editingField === "tags" ? (
                      <TextField
                        size="small"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => saveEdit(achievement.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(achievement.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        placeholder="Comma-separated tags"
                        autoFocus
                      />
                    ) : (
                      <div
                        className="flex flex-wrap gap-1"
                        onClick={() => startEdit(achievement, "tags")}
                        style={{ cursor: "pointer" }}
                      >
                        {achievement.tags.length > 0 ? (
                          achievement.tags.map((tag) => (
                            <Chip key={tag} label={tag} size="small" />
                          ))
                        ) : (
                          <span className="muted2">—</span>
                        )}
                      </div>
                    )}
                  </TableCell>

                  {/* Created At */}
                  <TableCell
                    onClick={() => startEdit(achievement, "createdAt")}
                    style={{ cursor: "pointer" }}
                  >
                    {editingId === achievement.id && editingField === "createdAt" ? (
                      <DatePicker
                        value={dayjs(editValue)}
                        onChange={(date: Dayjs | null) => {
                          if (date) {
                            setEditValue(date.toISOString());
                            saveEdit(achievement.id);
                          }
                        }}
                        slotProps={{ textField: { size: "small" } }}
                        autoFocus
                      />
                    ) : (
                      dayjs(achievement.createdAt).format("MMM DD, YYYY")
                    )}
                  </TableCell>

                  {/* Updated At */}
                  <TableCell>
                    {achievement.updatedAt
                      ? dayjs(achievement.updatedAt).format("MMM DD, YYYY")
                      : "—"}
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => setDeleteDialog({ open: true, id: achievement.id })}
                      className="text-white/70 hover:text-white"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box className="mt-6 flex justify-center">
          <Pagination
            count={totalPages}
            page={filters.page}
            onChange={(_, page) => onFiltersChange({ page })}
            color="primary"
          />
        </Box>
      )}

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={() => deleteDialog.id && handleDelete(deleteDialog.id)}
      />
    </LocalizationProvider>
  );
}

