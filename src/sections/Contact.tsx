import Section from "../components/Section";
import Reveal from "../components/Reveal";

export default function Contact() {
  return (
    <Section id="contact" center>
      <div className="w-full">
        <Reveal>
          <div className="label mb-4">CONTACT</div>
        </Reveal>
        <Reveal delayMs={80}>
          <h2 className="title-serif text-3xl md:text-4xl mb-8">
            Let's work together
          </h2>
        </Reveal>
        <Reveal delayMs={140}>
          <div className="card p-6 md:p-8">
            <p className="muted leading-relaxed">
              Contact section content goes here.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

