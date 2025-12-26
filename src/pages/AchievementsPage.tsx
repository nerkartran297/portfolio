import { useState } from "react";
import { NuqsAdapter } from "nuqs/adapters/react-router";
import { parseAsInteger, parseAsIsoDateTime, parseAsString, useQueryStates } from "nuqs";
import ArtBackground from "../components/ArtBackground";
import Navbar from "../components/Navbar";
import Section from "../components/Section";
import Reveal from "../components/Reveal";
import AchievementsTable from "../components/AchievementsTable";
import CreateAchievementDialog from "../components/CreateAchievementDialog";

function AchievementsPageContent() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // URL sync with NUQS
  const [filters, setFilters] = useQueryStates(
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
              Track and manage your professional achievements, projects, and milestones.
              All data is stored locally in your browser.
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

            <AchievementsTable
              filters={filters}
              onFiltersChange={setFilters}
            />
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
