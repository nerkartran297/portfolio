import { useEffect, useMemo, useState } from "react";
import { useQueryState, parseAsString, parseAsInteger, parseAsArrayOf } from "nuqs";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { createAchievement, updateAchievement, deleteAchievement, loadAchievements } from "../store/achievementsSlice";
import type { Achievement } from "../store/achievementsSlice";
import ArtBackground from "../components/ArtBackground";
import Navbar from "../components/Navbar";
import Section from "../components/Section";
import Reveal from "../components/Reveal";
import { AchievementsTable } from "../components/achievements/AchievementsTable";
import AchievementsFilters from "../components/achievements/AchievementsFilters";
import CreateAchievementDialog from "../components/achievements/CreateAchievementDialog";
import { toast } from "sonner";

const STORAGE_KEY = "achievements";

function AchievementsPage() {
  const dispatch = useAppDispatch();
  const achievements = useAppSelector((state) => state.achievements.items);
  
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [fromDate, setFromDate] = useQueryState("from", parseAsString.withDefault(""));
  const [toDate, setToDate] = useQueryState("to", parseAsString.withDefault(""));
  const [tags, setTags] = useQueryState("tags", parseAsArrayOf(parseAsString).withDefault([]));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState("pageSize", parseAsInteger.withDefault(10));
  
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch(loadAchievements(parsed));
        }
      }
    } catch (error) {
      console.error("Failed to load achievements from localStorage", error);
    }
  }, [dispatch]);

  // Save to localStorage whenever achievements change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
    } catch (error) {
      console.error("Failed to save achievements to localStorage", error);
    }
  }, [achievements]);


  // Filter achievements
  const filtered = useMemo(() => {
    let result = [...achievements];

    // Search query
    if (q) {
      const query = q.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Date range
    if (fromDate) {
      result = result.filter((item) => item.createdAt >= fromDate);
    }
    if (toDate) {
      result = result.filter((item) => item.createdAt <= toDate + "T23:59:59Z");
    }

    // Tags
    if (tags.length > 0) {
      result = result.filter((item) =>
        tags.some((tag) => item.tags.includes(tag))
      );
    }

    return result;
  }, [achievements, q, fromDate, toDate, tags]);

  // Pagination
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filtered.slice(start, end);
  }, [filtered, page, pageSize]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  // Handlers
  const handleCreate = (data: Omit<Achievement, "id">) => {
    dispatch(createAchievement(data));
    toast.success("Achievement created");
    setOpenCreateDialog(false);
  };

  const handleUpdate = (achievement: Achievement) => {
    dispatch(updateAchievement(achievement));
    toast.success("Achievement updated");
  };

  const handleDelete = (id: string) => {
    dispatch(deleteAchievement(id));
    toast.success("Achievement deleted");
  };

  const handleResetFilters = () => {
    setQ(null);
    setFromDate(null);
    setToDate(null);
    setTags(null);
    setPage(1);
  };

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    achievements.forEach((item) => {
      item.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [achievements]);

  return (
    <div className="relative">
      <ArtBackground />
      <Navbar />

      <main className="pt-0">
        <Section id="achievements" center className="min-h-screen">
          <Reveal>
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <h1 className="title-serif text-4xl font-bold text-white md:text-5xl">
                  Achievements
                </h1>
                <p className="muted text-sm md:text-base">
                  Track and manage your professional achievements
                </p>
              </div>

              {/* Filters */}
              <Reveal delayMs={100}>
                <AchievementsFilters
                  q={q}
                  fromDate={fromDate}
                  toDate={toDate}
                  tags={tags}
                  allTags={allTags}
                  onQChange={(value) => {
                    setQ(value || null);
                    setPage(1);
                  }}
                  onFromDateChange={(value) => {
                    setFromDate(value || null);
                    setPage(1);
                  }}
                  onToDateChange={(value) => {
                    setToDate(value || null);
                    setPage(1);
                  }}
                  onTagsChange={(value) => {
                    setTags(value.length > 0 ? value : null);
                    setPage(1);
                  }}
                  onReset={handleResetFilters}
                />
              </Reveal>

              {/* Table */}
              <Reveal delayMs={200}>
                <div className="glass rounded-2xl p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="muted text-sm">
                      Showing {paginated.length} of {filtered.length} achievements
                    </p>
                    <button
                      onClick={() => setOpenCreateDialog(true)}
                      className="rounded-xl border hairline px-4 py-2 text-xs tracking-[0.24em] text-white/80 hover:bg-white/10 transition"
                    >
                      + New Achievement
                    </button>
                  </div>

                  <AchievementsTable
                    achievements={paginated}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="rounded-xl border hairline px-4 py-2 text-xs tracking-[0.24em] text-white/80 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Previous
                      </button>
                      <span className="muted text-sm">
                        Page {page} of {totalPages}
                      </span>
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="rounded-xl border hairline px-4 py-2 text-xs tracking-[0.24em] text-white/80 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </Reveal>
            </div>
          </Reveal>
        </Section>
      </main>

      <CreateAchievementDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

export default AchievementsPage;

