import { useState } from "react";
import { NuqsAdapter } from "nuqs/adapters/react-router";
import {
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString,
  useQueryStates,
} from "nuqs";
import ArtBackground from "../components/ArtBackground";
import Navbar from "../components/Navbar";
import Section from "../components/Section";
import Reveal from "../components/Reveal";
import AchievementsTable from "../components/AchievementsTable";
import CreateAchievementDialog from "../components/CreateAchievementDialog";

function AchievementsPageContent() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // URL sync with NUQS
  const [queryFilters, setQueryFilters] = useQueryStates(
    {
      q: parseAsString.withDefault(""),
      from: parseAsIsoDateTime,
      to: parseAsIsoDateTime,
      tags: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
      pageSize: parseAsInteger.withDefault(10),
    },
    { history: "push" }
  );

  // Convert Date to ISO string for Filters type
  const filters = {
    q: queryFilters.q,
    from: queryFilters.from ? queryFilters.from.toISOString() : null,
    to: queryFilters.to ? queryFilters.to.toISOString() : null,
    tags: queryFilters.tags,
    page: queryFilters.page,
    pageSize: queryFilters.pageSize,
  };

  const setFilters = (updates: Partial<typeof filters>) => {
    const queryUpdates: Parameters<typeof setQueryFilters>[0] = {};

    if (updates.q !== undefined) queryUpdates.q = updates.q;
    if (updates.tags !== undefined) queryUpdates.tags = updates.tags;
    if (updates.page !== undefined) queryUpdates.page = updates.page;
    if (updates.pageSize !== undefined)
      queryUpdates.pageSize = updates.pageSize;

    if (updates.from !== undefined) {
      queryUpdates.from = updates.from ? new Date(updates.from) : null;
    }
    if (updates.to !== undefined) {
      queryUpdates.to = updates.to ? new Date(updates.to) : null;
    }

    setQueryFilters(queryUpdates);
  };

  return (
    <div className="relative min-h-screen">
      <ArtBackground />
      <Navbar />

      <Section id="achievements" className="pt-32">
        <Reveal>
          <div className="mb-8">
            <div className="label mb-4">ACHIEVEMENTS</div>
            <h1 className="title-serif text-4xl md:text-5xl mb-4">
              Milestones & Accomplishments
            </h1>
            <p className="muted max-w-2xl leading-relaxed">
              Track and manage your professional achievements, projects, and
              milestones. All data is stored locally in your browser.
            </p>
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="card p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-white/70">
                {filters.q || filters.tags || filters.from || filters.to
                  ? "Filtered results"
                  : "All achievements"}
              </div>
              <button
                onClick={() => setCreateDialogOpen(true)}
                className="rounded-xl border hairline bg-white/5 px-4 py-2 text-xs tracking-[0.24em] text-white/80 hover:bg-white/10 transition-colors"
              >
                + NEW ACHIEVEMENT
              </button>
            </div>

            <AchievementsTable filters={filters} onFiltersChange={setFilters} />
          </div>
        </Reveal>

        <CreateAchievementDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
        />
      </Section>
    </div>
  );
}

export default function AchievementsPage() {
  return (
    <NuqsAdapter>
      <AchievementsPageContent />
    </NuqsAdapter>
  );
}
