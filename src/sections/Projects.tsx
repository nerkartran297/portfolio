import Section from "../components/Section";
import Reveal from "../components/Reveal";

export default function Projects() {
  return (
    <Section id="projects" center>
      <div className="w-full">
        <Reveal>
          <div className="label mb-4">PROJECTS</div>
        </Reveal>
        <Reveal delayMs={80}>
          <h2 className="title-serif text-3xl md:text-4xl mb-8">
            Selected Works
          </h2>
        </Reveal>
        <Reveal delayMs={140}>
          <div className="card p-6 md:p-8">
            <p className="muted leading-relaxed">
              Projects section content goes here.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

