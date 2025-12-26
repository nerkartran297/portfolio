import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

interface AchievementsState {
  items: Achievement[];
}

const initialState: AchievementsState = {
  items: [
    {
      id: "1",
      title: "First Open Source Contribution",
      description: "Contributed to a major open source project",
      tags: ["opensource", "community"],
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      title: "React Performance Optimization",
      description: "Reduced bundle size by 40% using code splitting",
      tags: ["react", "performance", "optimization"],
      createdAt: "2024-02-20T14:30:00Z",
    },
    {
      id: "3",
      title: "TypeScript Migration",
      description: "Migrated entire codebase to TypeScript",
      tags: ["typescript", "migration"],
      createdAt: "2024-03-10T09:15:00Z",
    },
    {
      id: "4",
      title: "Component Library Published",
      description: "Published reusable component library on npm",
      tags: ["npm", "components", "library"],
      createdAt: "2024-04-05T16:45:00Z",
    },
    {
      id: "5",
      title: "CI/CD Pipeline Setup",
      description: "Set up automated testing and deployment",
      tags: ["cicd", "devops", "automation"],
      createdAt: "2024-05-12T11:20:00Z",
    },
    {
      id: "6",
      title: "Dark Mode Implementation",
      description: "Implemented system-wide dark mode support",
      tags: ["ui", "dark-mode", "ux"],
      createdAt: "2024-06-18T13:00:00Z",
    },
    {
      id: "7",
      title: "Accessibility Audit",
      description: "Achieved WCAG 2.1 AA compliance",
      tags: ["a11y", "accessibility", "wcag"],
      createdAt: "2024-07-22T10:30:00Z",
    },
    {
      id: "8",
      title: "GraphQL API Integration",
      description: "Integrated GraphQL API with React Query",
      tags: ["graphql", "api", "react-query"],
      createdAt: "2024-08-08T15:15:00Z",
    },
    {
      id: "9",
      title: "Mobile App Launch",
      description: "Launched mobile app with React Native",
      tags: ["react-native", "mobile", "launch"],
      createdAt: "2024-09-14T12:00:00Z",
    },
    {
      id: "10",
      title: "Tech Conference Speaker",
      description: "Presented at major tech conference",
      tags: ["conference", "speaking", "community"],
      createdAt: "2024-10-25T09:00:00Z",
    },
    {
      id: "11",
      title: "Database Migration Success",
      description: "Migrated from MongoDB to PostgreSQL",
      tags: ["database", "migration", "postgresql"],
      createdAt: "2024-11-05T14:45:00Z",
    },
    {
      id: "12",
      title: "Unit Test Coverage 90%",
      description: "Achieved 90% code coverage with unit tests",
      tags: ["testing", "coverage", "quality"],
      createdAt: "2024-12-10T10:20:00Z",
    },
  ],
};

const achievementsSlice = createSlice({
  name: "achievements",
  initialState,
  reducers: {
    createAchievement: (state, action: PayloadAction<Omit<Achievement, "id">>) => {
      const newAchievement: Achievement = {
        ...action.payload,
        id: Date.now().toString(),
        updatedAt: action.payload.createdAt,
      };
      state.items.unshift(newAchievement);
    },
    updateAchievement: (state, action: PayloadAction<Achievement>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteAchievement: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    loadAchievements: (state, action: PayloadAction<Achievement[]>) => {
      state.items = action.payload;
    },
  },
});

export const { createAchievement, updateAchievement, deleteAchievement, loadAchievements } =
  achievementsSlice.actions;
export default achievementsSlice.reducer;

