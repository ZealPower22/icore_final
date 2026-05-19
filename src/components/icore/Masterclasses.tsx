import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type HighlightGroup = { title: string; items: string[] };
type Module = { title: string; items: string[] };
type FormatRow = { label: string; value: string };

type MasterclassData = {
  tag: string;
  title: string;
  subtitle?: string;
  duration: string;
  description: string;
  quote?: string;
  speaker: {
    name: string;
    credentials: string;
    about: string;
    image?: string;
  };
  highlights?: HighlightGroup[];
  learnItems?: string[];
  protocolItems?: string[];
  modules?: Module[];
  format: FormatRow[];
  footerQuote?: string;
  badge?: string;
};

const easePremium = [0.22, 1, 0.36, 1] as const;

const masterclasses: MasterclassData[] = [
  {
    tag: "A",
    title: "3D Printing & Same-Day Dentistry",
    duration: "Days 23–24 Nov · 2-Day Intensive",
    description:
      "Learn same-day dentistry with digital workflows, intensive hands-on printing, and complete material science training.",
    quote: "You walk in with a drill. You walk out with a digital lab.",
    speaker: {
      name: "Dr. Shiva Kumar S.A.",
      credentials: "BDS · MASTER OF 3D PRINTING & DIGITAL WORKFLOW",
      about:
        "Digital dentistry pioneer · Expert in SLA, DLP & material-jetting workflows · Clinical adopter of same-day delivery protocols · Architect of the full 2-day hands-on 3D printing curriculum for I.C.O.R.E 2026",
      image: "/images/faculty/shiva-kumar.jpeg",
    },
    highlights: [
      { title: "Learn 3D Printing Technologies", items: ["SLA", "DLP", "Material Jetting comparison"] },
      { title: "Same-Day Dentistry Workflow", items: ["Scan", "Design", "Print", "Deliver in one visit"] },
      { title: "Material Science & Resin Types", items: ["Strength", "Biocompatibility", "Shade matching"] },
      { title: "Digital Workflow Integration", items: ["Clinic-level CAD/CAM implementation"] },
      { title: "Post-Processing Mastery", items: ["Finishing", "Glazing", "Polishing techniques"] },
    ],
    modules: [
      {
        title: "Module 1 — Foundation",
        items: [
          "Introduction to 3D Printing",
          "Additive vs subtractive manufacturing",
          "Resin system",
          "Software & settings overview",
        ],
      },
      {
        title: "Module 2 — Advanced",
        items: [
          "Full-mouth rehabilitation of corticobasal cases",
          "Hands-on 3D printing demonstration",
          "Post-processing techniques",
        ],
      },
      {
        title: "Module 3 — Material Science",
        items: ["Resin material science", "Strength & physical properties", "Market guidance", "Certification"],
      },
    ],
    format: [
      { label: "Duration", value: "2-Day Intensive · 23–24 Nov" },
      { label: "Format", value: "Lecture + Hands-On + Live Demonstrations" },
      { label: "Focus", value: "Same-day digital workflow mastery" },
    ],
    footerQuote:
      "The gap between lab-dependent dentists and clinic-owned digital workflows is measured in days, not years. I close that gap in 48 hours.",
  },
  {
    tag: "B",
    title: "Zygomatic Surgery",
    subtitle: "ZYGOMATIC Masterclass",
    duration: "4 hours · Day 3 (23 Nov)",
    description:
      "Four-hour uninterrupted live zygomatic implant placement with lecture, hands-on elements, and annotated surgery documentation.",
    speaker: {
      name: "Dr. Johnson Raja James",
      credentials: "B.D.S · M.D.S · MS(ITALY) · PhD · DIPLOMATE ICOI",
      about:
        "Implant surgeon, professor, and international certified mentor with 23 years of experience in advanced implantology — FMR, pterygoid & zygomatic — and peri-implant regeneration.",
        image: "images/faculty/Dr. Johnson Raja James.jpeg",
    },
    
    learnItems: [
      "Zygomatic implant indications & anatomy",
      "Zygomatic implant techniques",
      "Live surgery",
      "Sinus bypass without lift procedures",
      "Full-mouth rehabilitation (FMR)",
      "Peri-implant tissue management",
    ],
    format: [
      { label: "Duration", value: "4 hours · Day 3 (23 Nov)" },
      { label: "Format", value: "Lecture + Live Surgery + Hands-On" },
      { label: "Take-home", value: "Annotated surgery video" },
      { label: "Note", value: "Separate add-on course" },
    ],
    badge: "ZYGOMATIC Masterclass",
  },
  {
    tag: "C",
    title: "Ozone Therapy",
    subtitle: "THE OZONE-BASAL SYNERGY",
    duration: "Day 4 (Nov 24) · Full-day workshop",
    description:
      "From Mechanical Loading to Biological Integration. The traditional mechanical approach to implantology is being disrupted. At I.C.O.R.E 2026, we introduce the Ozone-Integrated Protocol — a paradigm shift that views the oral cavity as a reflection of systemic health. This masterclass teaches how to harness medical-grade O₃ to achieve superior tissue aesthetics, faster healing, and long-term cortical stability — with minimal pharmaceutical dependence.",
    speaker: {
      name: "Dr. Sudhir Doley",
      credentials: "Pioneer Trainer for Ozone Dentistry in India",
      about:
        "Pioneer Trainer for Ozone Dentistry in India · Architect of Ozone-Basal Synergy Protocol",
        image: "images/faculty/Dr. Sudhir Doley.jpeg",
    },
    protocolItems: [
      "Transition from dentist → biological surgeon",
      "Long-term cortical stability",
      "Live cases",
      "Medical-grade O₃ cortical locking",
      "Superior tissue aesthetics, no pharma",
      "Systemic-oral health integration",
    ],
    format: [
      { label: "Day", value: "Day 4 (Nov 24)" },
      { label: "Format", value: "Lecture + live ozone applications" },
      { label: "Hands-On", value: "Patient protocol demonstrations" },
      { label: "Note", value: "Separate add-on course" },
    ],
    badge: "OZONE Therapy",
  },
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--ivory)]/80">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--gold)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SpeakerBlock({ speaker }: { speaker: MasterclassData["speaker"] }) {
  const initials = speaker.name
    .replace("Dr.", "")
    .trim()
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-6 border-b border-[var(--gold)]/15 p-6 md:flex-row md:gap-8 md:p-8">
      <div className="relative mx-auto h-44 w-36 shrink-0 overflow-hidden border border-[var(--gold)]/30 bg-[var(--burgundy-deep)] md:mx-0 md:h-48 md:w-40">
        {speaker.image ? (
          <img
            src={speaker.image}
            alt={speaker.name}
            className="h-full w-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--gold)]/90 to-[var(--burgundy)] font-display text-3xl text-[var(--burgundy-deep)]">
            {initials}
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[var(--burgundy-deep)]/70 to-transparent" />
      </div>
      <div className="min-w-0 flex-1 text-center md:text-left">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--gold)]">Masterclass Lead</p>
        <h4 className="mt-2 font-display text-2xl text-[var(--ivory)] md:text-3xl">{speaker.name}</h4>
        <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--gold-soft)] md:text-sm">
          {speaker.credentials}
        </p>
        <p className="mt-4 font-serif text-sm leading-relaxed text-[var(--ivory)]/70 md:text-base">{speaker.about}</p>
      </div>
    </div>
  );
}

function DetailPanel({ data }: { data: MasterclassData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, ease: easePremium }}
      className="ornament-frame overflow-hidden glass"
    >
      <div className="border-b border-[var(--gold)]/15 bg-[var(--burgundy)]/25 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-display text-2xl text-[var(--gold)]">{data.tag}</span>
          {data.badge && (
            <span className="rounded border border-[var(--gold)]/30 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.25em] text-[var(--gold-soft)]">
              {data.badge}
            </span>
          )}
        </div>
        <h3 className="mt-3 font-display text-2xl text-[var(--ivory)] md:text-4xl">{data.title}</h3>
        {data.subtitle && (
          <p className="mt-2 text-xs uppercase tracking-[0.35em] text-[var(--gold)]/80">{data.subtitle}</p>
        )}
        <p className="mt-4 text-sm uppercase tracking-[0.2em] text-[var(--gold-soft)]">{data.duration}</p>
        <p className="mt-4 font-serif text-base leading-relaxed text-[var(--ivory)]/75 md:text-lg">{data.description}</p>
        {data.quote && (
          <blockquote className="mt-6 border-l-2 border-[var(--gold)]/60 pl-4 font-serif text-lg italic text-[var(--gold-soft)] md:text-xl">
            &ldquo;{data.quote}&rdquo;
          </blockquote>
        )}
      </div>

      <SpeakerBlock speaker={data.speaker} />

      <div className="space-y-8 p-6 md:p-8">
        {data.highlights && (
          <section>
            <h5 className="font-display text-lg tracking-wide text-[var(--gold)] md:text-xl">Course Highlights</h5>
            <div className="gold-divider my-4 max-w-xs" />
            <div className="grid gap-6 sm:grid-cols-2">
              {data.highlights.map((group) => (
                <div key={group.title} className="border border-[var(--gold)]/10 bg-[var(--burgundy)]/20 p-4 md:p-5">
                  <h6 className="font-display text-sm text-[var(--ivory)] md:text-base">{group.title}</h6>
                  <div className="mt-3">
                    <BulletList items={group.items} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.learnItems && (
          <section>
            <h5 className="font-display text-lg tracking-wide text-[var(--gold)] md:text-xl">What You&apos;ll Learn</h5>
            <div className="gold-divider my-4 max-w-xs" />
            <BulletList items={data.learnItems} />
          </section>
        )}

        {data.protocolItems && (
          <section>
            <h5 className="font-display text-lg tracking-wide text-[var(--gold)] md:text-xl">The Ozone Protocol</h5>
            <div className="gold-divider my-4 max-w-xs" />
            <div className="grid gap-2 sm:grid-cols-2">
              {data.protocolItems.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 border border-[var(--gold)]/10 bg-[var(--burgundy)]/20 px-3 py-2.5 text-sm text-[var(--ivory)]/80"
                >
                  <span className="text-[var(--gold)]">◆</span>
                  {item}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.modules && (
          <section>
            <h5 className="font-display text-lg tracking-wide text-[var(--gold)] md:text-xl">Curriculum</h5>
            <div className="gold-divider my-4 max-w-xs" />
            <div className="space-y-4">
              {data.modules.map((mod, i) => (
                <div key={mod.title} className="border-l-2 border-[var(--gold)]/40 pl-4 md:pl-5">
                  <h6 className="font-display text-base text-[var(--ivory)]">
                    <span className="mr-2 text-[var(--gold)]/60">0{i + 1}</span>
                    {mod.title}
                  </h6>
                  <div className="mt-2">
                    <BulletList items={mod.items} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h5 className="font-display text-lg tracking-wide text-[var(--gold)] md:text-xl">Format & Inclusion</h5>
          <div className="gold-divider my-4 max-w-xs" />
          <div className="grid gap-3 sm:grid-cols-2">
            {data.format.map((row) => (
              <div key={row.label} className="border border-[var(--gold)]/15 bg-[var(--burgundy-deep)]/40 px-4 py-3">
                <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold)]/70">{row.label}</div>
                <div className="mt-1 text-sm text-[var(--ivory)]/85">{row.value}</div>
              </div>
            ))}
          </div>
        </section>

        {data.footerQuote && (
          <blockquote className="border border-[var(--gold)]/20 bg-[var(--burgundy)]/30 p-5 text-center font-serif text-base italic text-[var(--gold-soft)] md:text-lg">
            &ldquo;{data.footerQuote}&rdquo;
          </blockquote>
        )}
      </div>
    </motion.div>
  );
}

export function MasterclassesSection() {
  const [active, setActive] = useState(0);
  const current = masterclasses[active];

  return (
    <div className="grid gap-8 md:grid-cols-[280px_1fr]">
      <div className="space-y-2">
        {masterclasses.map((it, i) => (
          <button
            key={it.tag}
            type="button"
            onClick={() => setActive(i)}
            className={`w-full border p-5 text-left transition-all duration-300 ${
              active === i
                ? "border-[var(--gold)] bg-[var(--burgundy)]/60 shadow-gold"
                : "border-[var(--gold)]/15 bg-[var(--burgundy)]/20 hover:border-[var(--gold)]/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`font-display text-2xl ${active === i ? "text-[var(--gold)]" : "text-[var(--ivory)]/40"}`}
              >
                {it.tag}
              </span>
              <span className="font-display text-sm leading-snug text-[var(--ivory)] md:text-base">{it.title}</span>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <DetailPanel key={current.tag} data={current} />
      </AnimatePresence>
    </div>
  );
}
