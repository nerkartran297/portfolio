import { useState, memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Autocomplete,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import type { Achievement } from "../../store/achievementsSlice";
import { z } from "zod";

const titleSchema = z.string().min(1, "Title is required");

interface AchievementsTableProps {
  achievements: Achievement[];
  onUpdate: (achievement: Achievement) => void;
  onDelete: (id: string) => void;
}

type EditingCell = { id: string; field: "title" | "tags" | "createdAt" } | null;

function AchievementsTableComponent({
  achievements,
  onUpdate,
  onDelete,
}: AchievementsTableProps) {
  const [editingCell, setEditingCell] = useState<EditingCell>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    title?: string;
    tags?: string[];
    createdAt?: Dayjs;
  }>({});

  // Get all unique tags for autocomplete
  const allTags = Array.from(
    new Set(achievements.flatMap((a) => a.tags))
  ).sort();

  const handleStartEdit = (id: string, field: "title" | "tags" | "createdAt", achievement: Achievement) => {
    setEditingCell({ id, field });
    if (field === "tags") {
      setEditValues({ tags: achievement.tags });
    } else if (field === "title") {
      setEditValues({ title: achievement.title });
    } else if (field === "createdAt") {
      setEditValues({ createdAt: dayjs(achievement.createdAt) });
    }
  };

  const handleSave = (achievement: Achievement) => {
    if (!editingCell) return;

    const updated: Achievement = { ...achievement };

    if (editingCell.field === "title") {
      const title = editValues.title?.trim();
      const validation = titleSchema.safeParse(title);
      if (!validation.success) {
        return;
      }
      updated.title = validation.data;
    } else if (editingCell.field === "tags") {
      updated.tags = editValues.tags || [];
    } else if (editingCell.field === "createdAt") {
      if (editValues.createdAt) {
        updated.createdAt = editValues.createdAt.toISOString();
      }
    }

    onUpdate(updated);
    setEditingCell(null);
    setEditValues({});
  };

  const handleCancel = () => {
    setEditingCell(null);
    setEditValues({});
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    achievement: Achievement
  ) => {
    if (e.key === "Enter") {
      handleSave(achievement);
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (achievements.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="muted text-sm">No achievements found</p>
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {achievements.map((achievement) => {
              const isEditingTitle = editingCell?.id === achievement.id && editingCell.field === "title";
              const isEditingTags = editingCell?.id === achievement.id && editingCell.field === "tags";
              const isEditingCreatedAt = editingCell?.id === achievement.id && editingCell.field === "createdAt";

              return (
                <TableRow key={achievement.id}>
                  {/* Title */}
                  <TableCell
                    onDoubleClick={() => handleStartEdit(achievement.id, "title", achievement)}
                    sx={{ cursor: "pointer" }}
                  >
                    {isEditingTitle ? (
                      <TextField
                        size="small"
                        fullWidth
                        value={editValues.title || ""}
                        onChange={(e) => setEditValues({ title: e.target.value })}
                        onBlur={() => handleSave(achievement)}
                        onKeyDown={(e) => handleKeyDown(e, achievement)}
                        autoFocus
                        error={editValues.title !== undefined && !titleSchema.safeParse(editValues.title?.trim()).success}
                      />
                    ) : (
                      <div>{achievement.title}</div>
                    )}
                  </TableCell>

                  {/* Tags */}
                  <TableCell
                    onDoubleClick={() => handleStartEdit(achievement.id, "tags", achievement)}
                    sx={{ cursor: "pointer" }}
                  >
                    {isEditingTags ? (
                      <Autocomplete
                        multiple
                        size="small"
                        options={allTags}
                        freeSolo
                        value={editValues.tags || []}
                        onChange={(_, newValue) => {
                          setEditValues({ tags: newValue });
                          handleSave({ ...achievement, tags: newValue });
                        }}
                        onBlur={() => handleCancel()}
                        renderInput={(params) => <TextField {...params} />}
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
                        sx={{ minWidth: 200 }}
                      />
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {achievement.tags.length > 0 ? (
                          achievement.tags.map((tag) => (
                            <Chip key={tag} label={tag} size="small" />
                          ))
                        ) : (
                          <span className="muted text-xs">—</span>
                        )}
                      </div>
                    )}
                  </TableCell>

                  {/* Created At */}
                  <TableCell
                    onDoubleClick={() => handleStartEdit(achievement.id, "createdAt", achievement)}
                    sx={{ cursor: "pointer" }}
                  >
                    {isEditingCreatedAt ? (
                      <DatePicker
                        value={editValues.createdAt || null}
                        onChange={(date) => {
                          setEditValues({ createdAt: date || undefined });
                          if (date) {
                            handleSave({ ...achievement, createdAt: date.toISOString() });
                          }
                        }}
                        onClose={() => handleCancel()}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                          },
                        }}
                      />
                    ) : (
                      <div className="text-xs">
                        {dayjs(achievement.createdAt).format("MMM DD, YYYY")}
                      </div>
                    )}
                  </TableCell>

                  {/* Updated At */}
                  <TableCell>
                    <div className="text-xs">
                      {achievement.updatedAt
                        ? dayjs(achievement.updatedAt).format("MMM DD, YYYY")
                        : "—"}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => setDeleteId(achievement.id)}
                      sx={{
                        color: "rgba(255, 87, 179, 0.8)",
                        "&:hover": {
                          color: "rgb(255, 87, 179)",
                          backgroundColor: "rgba(255, 87, 179, 0.1)",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
      >
        <DialogTitle>Delete Achievement</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this achievement? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button
            onClick={() => {
              if (deleteId) {
                onDelete(deleteId);
                setDeleteId(null);
              }
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

export const AchievementsTable = memo(AchievementsTableComponent);

