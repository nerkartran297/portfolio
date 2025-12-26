import { z } from "zod";

export const achievementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  tags: z.array(z.string()),
  createdAt: z.string().min(1, "Created date is required"),
});

export type AchievementFormData = z.infer<typeof achievementSchema>;

