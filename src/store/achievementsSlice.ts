import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";

export type Achievement = {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  createdAt: string; // ISO string
  updatedAt?: string; // ISO string
};

const STORAGE_KEY = "portfolio-achievements";

// Load from localStorage or use seed data
const loadAchievements = (): Achievement[] => {
  if (typeof window === "undefined") return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return getSeedData();
    }
  }
  return getSeedData();
};

const getSeedData = (): Achievement[] => {
  const now = dayjs();
  return [
    {
      id: "1",
      title: "Deployed First Production App",
      description: "Successfully launched a React-based application with 10k+ daily users",
      tags: ["React", "Deployment", "Production"],
      createdAt: now.subtract(90, "days").toISOString(),
      updatedAt: now.subtract(85, "days").toISOString(),
    },
    {
      id: "2",
      title: "Optimized Bundle Size by 40%",
      description: "Reduced application bundle from 2.5MB to 1.5MB using code splitting",
      tags: ["Performance", "Optimization"],
      createdAt: now.subtract(75, "days").toISOString(),
    },
    {
      id: "3",
      title: "Implemented Dark Mode",
      description: "Added comprehensive dark/light theme support across the entire application",
      tags: ["UI/UX", "Theme"],
      createdAt: now.subtract(60, "days").toISOString(),
    },
    {
      id: "4",
      title: "Led Team of 5 Developers",
      description: "Managed frontend team for major feature rollout",
      tags: ["Leadership", "Team"],
      createdAt: now.subtract(45, "days").toISOString(),
    },
    {
      id: "5",
      title: "Achieved 100% Test Coverage",
      description: "Maintained comprehensive test suite with unit and integration tests",
      tags: ["Testing", "Quality"],
      createdAt: now.subtract(30, "days").toISOString(),
    },
    {
      id: "6",
      title: "Created Design System",
      description: "Built reusable component library with 50+ components",
      tags: ["Design", "Components"],
      createdAt: now.subtract(25, "days").toISOString(),
    },
    {
      id: "7",
      title: "Migrated to TypeScript",
      description: "Successfully converted entire codebase from JavaScript to TypeScript",
      tags: ["TypeScript", "Migration"],
      createdAt: now.subtract(20, "days").toISOString(),
    },
    {
      id: "8",
      title: "Zero Downtime Deployment",
      description: "Implemented CI/CD pipeline with zero-downtime deployments",
      tags: ["DevOps", "CI/CD"],
      createdAt: now.subtract(15, "days").toISOString(),
    },
    {
      id: "9",
      title: "Mobile Performance Score 95+",
      description: "Achieved Lighthouse performance score of 95+ on mobile devices",
      tags: ["Performance", "Mobile"],
      createdAt: now.subtract(10, "days").toISOString(),
    },
    {
      id: "10",
      title: "Open Source Contributor",
      description: "Contributed to major open source projects with 100+ merged PRs",
      tags: ["Open Source", "Contributions"],
      createdAt: now.subtract(5, "days").toISOString(),
    },
    {
      id: "11",
      title: "Built Realtime Dashboard",
      description: "Created live dashboard with WebSocket integration for real-time updates",
      tags: ["WebSocket", "Dashboard"],
      createdAt: now.subtract(3, "days").toISOString(),
    },
    {
      id: "12",
      title: "Mentored Junior Developers",
      description: "Guided 3 junior developers through their first production projects",
      tags: ["Mentorship", "Team"],
      createdAt: now.subtract(2, "days").toISOString(),
    },
    {
      id: "13",
      title: "Accessibility Audit Passed",
      description: "Achieved WCAG 2.1 AA compliance across all pages",
      tags: ["Accessibility", "Compliance"],
      createdAt: now.subtract(1, "days").toISOString(),
    },
    {
      id: "14",
      title: "Monorepo Migration",
      description: "Successfully migrated from multi-repo to monorepo structure",
      tags: ["Architecture", "Migration"],
      createdAt: now.toISOString(),
    },
    {
      id: "15",
      title: "API Response Time < 100ms",
      description: "Optimized API calls to achieve sub-100ms average response time",
      tags: ["Performance", "Backend"],
      createdAt: now.toISOString(),
    },
  ];
};

const saveToStorage = (achievements: Achievement[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
  }
};

const initialState: Achievement[] = loadAchievements();

const achievementsSlice = createSlice({
  name: "achievements",
  initialState,
  reducers: {
    create: (state, action: PayloadAction<Omit<Achievement, "id" | "createdAt" | "updatedAt">>) => {
      const newAchievement: Achievement = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      state.push(newAchievement);
      saveToStorage(state);
    },
    update: (state, action: PayloadAction<Partial<Achievement> & { id: string }>) => {
      const index = state.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state[index] = {
          ...state[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        saveToStorage(state);
      }
    },
    deleteAchievement: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((a) => a.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
        saveToStorage(state);
      }
    },
  },
});

export const { create, update, deleteAchievement } = achievementsSlice.actions;
export default achievementsSlice.reducer;

