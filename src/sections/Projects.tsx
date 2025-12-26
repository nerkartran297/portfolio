import Section from "../components/Section";
import Reveal from "../components/Reveal";

type Project = {
  title: string;
  description: string;
  tags: string[];
  url: string;
};

const PROJECTS: Project[] = [
  {
    title: "Classroom Manager",
    description:
      "A web-based classroom management system with real-time test results and analytics designed for teachers. Allowing teachers to create and manage classes, tests, and view test results and analytics.",
    tags: ["React", "TypeScript", "TailwindCSS", "MongoDB"],
    url: "https://toanthaybien.com",
  },
  {
    title: "DevForum Website",
    description:
      "A forum website built with Next.js, TailwindCSS, and TypeScript. It allows users to write posts and comments, and like/dislike them.",
    tags: ["Next.js", "TailwindCSS", "TypeScript"],
    url: "https://www.make1move.net/",
  },
  {
    title: "Microservices Elearning Platform",
    description:
      "A microservices e-learning platform built with React, TypeScript, and TailwindCSS. It allows users to create and manage courses, lessons, and quizzes, and view course progress and analytics.",
    tags: ["React", "TypeScript", "TailwindCSS", "Docker", "RabitMQ"],
    url: "https://github.com/nerkartran297/elearn-da2",
  },
];

export default function Projects() {
  return (
    <Section id="projects" center>
      {/* ===== Section header ===== */}
      <div className="mb-14 max-w-xl">
        <Reveal>
          <div className="label mb-4">PROJECTS</div>
        </Reveal>

        <Reveal delayMs={80}>
          <h2 className="title-serif text-3xl md:text-4xl">Selected Works</h2>
        </Reveal>

        <Reveal delayMs={140}>
          <p className="muted mt-4 leading-relaxed">
            A selection of frontend projects focusing on real-time interaction,
            system structure, and UI clarity.
          </p>
        </Reveal>
      </div>

      {/* ===== Projects grid ===== */}
      <div className="grid gap-6 md:grid-cols-12">
        {PROJECTS.map((project, idx) => (
          <Reveal
            key={project.title}
            delayMs={idx * 90} // 👈 STAGGER Ở ĐÂY
            className="md:col-span-4"
          >
            <article className="card p-6 md:p-7 h-full flex flex-col">
              {/* header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <span className="label text-[10px]">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>

              {/* description */}
              <p className="muted mt-4 leading-relaxed flex-1">
                {project.description}
              </p>

              {/* tags */}
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border hairline bg-white/5 px-3 py-1 text-xs text-white/75"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* action */}
              <div className="mt-6">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/80 hover:text-white underline decoration-white/20 underline-offset-4"
                >
                  View project →
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
