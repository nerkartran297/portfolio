import Section from "../components/Section";
import Reveal from "../components/Reveal";

export default function About() {
  return (
    <Section id="about" center>
      <div className="grid gap-8 md:grid-cols-12 md:items-start">
        <div className="md:col-span-5">
          <Reveal>
            <div className="label mb-4">ABOUT</div>
          </Reveal>
          <Reveal delayMs={80}>
            <h2 className="title-serif text-3xl md:text-4xl">
              A simple story,
              <br />
              built with passion.
            </h2>
          </Reveal>
        </div>

        <div className="md:col-span-7">
          <Reveal delayMs={140}>
            <div className="card p-6 md:p-8">
              <p className="muted leading-relaxed">
                With a passion for programming, I’m a disciplined and
                detail-oriented final-year college student at UIT-HCM VNU that
                hope to make life more convenient with apps and automation. With
                a belief in the convenience of UI/UX, I'm always looking for
                ways to improve the user experience.
              </p>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {[
                  "React + TypeScript",
                  "TailwindCSS styling",
                  "Scroll-based animation",
                  "Responsive layout",
                ].map((t) => (
                  <div
                    key={t}
                    className="rounded-xl border hairline bg-white/5 px-4 py-3 text-sm text-white/80"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
