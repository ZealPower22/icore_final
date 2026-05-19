import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { DailyFlowTimeline } from "./DailyFlowTimeline";
import { FacultyCard, type FacultyMember } from "./FacultyCard";
import { MasterclassesSection } from "./Masterclasses";
import { Ornament, SectionLabel } from "./Ornament";

type CartItemPayload = {
  id: string;
  title: string;
  label: string;
  price: number;
  source: string;
};

const reserveButtonClasses =
  "mt-8 w-full inline-flex items-center justify-center rounded-xl border border-[var(--gold)]/70 bg-[var(--burgundy)] py-3 px-4 text-xs uppercase tracking-[0.3em] font-semibold text-[var(--ivory)] shadow-gold transition-all hover:bg-[var(--gold)] hover:text-[var(--burgundy-deep)]";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};

function SectionShell({ id, label, title, subtitle, children, dark = false }: {
  id: string; label: string; title: string; subtitle?: string; children: React.ReactNode; dark?: boolean;
}) {
  return (
    <section id={id} className={`relative overflow-hidden py-28 md:py-40 px-6 ${dark ? "bg-[var(--burgundy-deep)] backdrop-blur-sm" : "bg-[var(--background)] backdrop-blur-sm"}`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-16 h-80 w-80 rounded-full bg-[var(--gold)]/10 blur-3xl animate-section-glow" />
        <div className="absolute -right-16 bottom-14 h-72 w-72 rounded-full bg-[var(--burgundy)]/15 blur-3xl animate-section-drift" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-20"
        >
          <SectionLabel>{label}</SectionLabel>
          <h2 className="mt-6 font-display text-4xl md:text-6xl text-[var(--ivory)] tracking-wide">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-6 max-w-2xl mx-auto font-serif italic text-lg text-[var(--ivory)]/70">
              {subtitle}
            </p>
          )}
          <Ornament className="mt-8" />
        </motion.div>
        {children}
      </div>
    </section>
  );
}

/* ---------------- TRUST ---------------- */
export function Trust() {
  const items = [
    { num: "500+", label: "Surgeons", desc: "Global participation" },
    { num: "5-Year", label: "Patient Follow-up", desc: "Documented outcomes" },
    { num: "100%", label: "CBCT Documented", desc: "Complete dataset" },
    { num: "Indexed", label: "Research Pathway", desc: "Peer-reviewed" },
    { num: "World", label: "Record Attempt", desc: "Largest implant cohort" },
  ];
  return (
    <section className="relative py-20 px-6 border-y border-[var(--gold)]/15 bg-[var(--burgundy-deep)]">
      <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-5 gap-px">
        {items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="text-center px-4 py-6"
          >
            <div className="font-display text-3xl md:text-4xl gradient-gold-text">{it.num}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.25em] text-[var(--ivory)]">{it.label}</div>
            <div className="mt-1 text-[11px] text-[var(--ivory)]/50">{it.desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- CORE STORY ---------------- */
export function CoreStory() {
  return (
    <SectionShell
      id="about"
      label="The Union"
      title="Two Schools. One Historic Union."
      subtitle="For decades, two philosophies of implantology evolved in parallel. ICORE 2026 brings them together — for the first time."
    >
      <div className="grid md:grid-cols-2 gap-10">
        {[
          {
            title: "Osseointegration",
            tag: "Branemark Legacy",
            desc: "The classical paradigm — biological bonding of titanium with cortical & cancellous bone, refined over 50 years of academic rigor.",
            image: "/images/osseointegration.png",
            imageAlt: "Osseointegration — classical implantology paradigm",
          },
          {
            title: "Corticobasal Implantology",
            tag: "Immediate Function",
            desc: "The contemporary paradigm — engaging dense cortical plates for immediate loading, full-arch rehabilitation, and faster return to function.",
            image: "/images/corticobasal-implantology.png",
            imageAlt: "Corticobasal implantology — immediate function paradigm",
          },
        ].map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="group ornament-frame overflow-hidden glass"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={s.image}
                alt={s.imageAlt}
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                loading="lazy"
              />
              <motion.div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--burgundy-deep)] via-[var(--burgundy-deep)]/50 to-[var(--burgundy)]/10" aria-hidden />
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-[var(--gold)]/10 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/60 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 md:bottom-5 md:left-6 md:right-6">
                <div className="text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">{s.tag}</div>
                <h3 className="mt-2 font-display text-2xl md:text-3xl text-[var(--ivory)] drop-shadow-lg">
                  {s.title}
                </h3>
              </div>
            </div>
            <div className="relative p-8 md:p-10">
              <div className="gold-divider mb-5 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <p className="font-serif text-base md:text-lg leading-relaxed text-[var(--ivory)]/75">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-16 text-center max-w-3xl mx-auto">
        <p className="font-serif italic text-2xl md:text-3xl text-[var(--gold-soft)]">
          “One Biology. One Mission. The cortex unites.”
        </p>
      </div>
    </SectionShell>
  );
}

/* ---------------- PRINCIPLES ---------------- */
export function Principles() {
  const items = [
    { n: "01", t: "Evidence Over Ideology", d: "Decisions driven by 5-year CBCT outcomes — not preference or tradition." },
    { n: "02", t: "Results Over Tradition", d: "Patient function, aesthetics and longevity supersede inherited dogma." },
    { n: "03", t: "Unified Approach", d: "Cortical and cancellous strategies combined into a single decision algorithm." },
    { n: "04", t: "Immediate Function", d: "Same-day teeth as a clinical standard — not a marketing claim." },
  ];
  return (
    <SectionShell id="principles" label="Foundations" title="Four Principles" dark>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((it, i) => (
          <motion.div
            key={it.n}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.7 }}
            whileHover={{ y: -6 }}
            className="group p-8 border border-[var(--gold)]/20 hover:border-[var(--gold)]/60 bg-[var(--burgundy)]/30 transition-all"
          >
            <div className="font-display text-5xl gradient-gold-text">{it.n}</div>
            <div className="gold-divider my-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            <h3 className="font-display text-xl text-[var(--ivory)] tracking-wide">{it.t}</h3>
            <p className="mt-3 text-sm text-[var(--ivory)]/65 leading-relaxed">{it.d}</p>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ---------------- ROI / WHAT YOU GET ---------------- */
export function WhatYouGet() {
  const items = [
    { t: "NDC  Certificate", d: "recognized continuing education credits." },
    { t: "Digital Asset Pack", d: "Surgical videos, CBCT scans, prosthetic libraries — yours forever." },
    { t: "Clinical Hands-on Log", d: "Place 5–20 implants under direct mentor supervision." },
    { t: "Indexed Publication", d: "Co-author opportunity on peer-reviewed indexed journals." },
    { t: "Limca Book of records", d: "Personalized letter from program directors upon completion." },
    { t: "Professional Network", d: "Lifetime access to the ICORE alumni & mentor circle." },
  ];
  return (
    <SectionShell id="roi" label="Return On Attendance" title="What You Take Home">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it, i) => (
          <motion.div
            key={it.t}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.7 }}
            className="p-8 glass hover:bg-[var(--burgundy)]/40 transition-all group"
          >
            <div className="w-10 h-10 border border-[var(--gold)]/60 flex items-center justify-center text-[var(--gold)] group-hover:bg-[var(--gold)] group-hover:text-[var(--burgundy-deep)] transition-all">
              ✦
            </div>
            <h3 className="mt-5 font-display text-xl text-[var(--ivory)]">{it.t}</h3>
            <p className="mt-2 text-sm text-[var(--ivory)]/65 leading-relaxed">{it.d}</p>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ====== INDIVIDUAL DAY TIMELINES ====== */
// Timelines are now embedded directly in the Program component for each day

/* ====== MAIN PROGRAM COMPONENT ====== */
export function Program() {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  
  const days = [
    { d: "Day 1", t: "Basics of Immediate Loading", date: "21 Nov" },
    { d: "Day 2", t: " Advanced Biocortical & Tricortical Anchorage", date: "22 Nov" },
    { d: "Day 3", t: "Camp event + Live Patient Hands-On", date: "23 Nov" },
    { d: "Day 4", t: "Camp event + Ozone Masterclass", date: "24 Nov" },
    { d: "Day 5", t: "Camp + Research + Photography", date: "25 Nov" },
    { d: "Day 6", t: "Camp + Final cases", date: "26 Nov" },
    { d: "Day 7", t: "Certificate and Award ceremony", date: "27 Nov" },
  ];

  const getTimelineItems = (index: number) => {
    switch (index) {
      case 0:
        return [
          { time: "09:00", t: "Debate Registration & Welcome"},
          { time: "10:00", t: "Inaugural Lectures - Fundamentals of Immediate loading"},
          { time: "12:30", t: "High Tea / Brunch"},
          { time: "13:30", t: "Inaugration and Opening Ceremony"},
          { time: "15:00", t: "Lunch Break"},
          { time: "16:00", t: "Afternoon Lectures"},
          { time: "17:00", t: "Cultural Evening celebrations"},
          { time: "20:00"},
        ];
      case 1:
        return [
          { time: "09:00", t: "Lectures - Advanced Biocortical & Tricortical Anchorage Concepts"},
          { time: "10:30", t: "High Tea / Brunch"},
          { time: "11:00", t: "Lectures and Continued Advanced Sessions"},
          { time: "12:30", t: "High Tea / Brunch"},
          { time: "13:00", t: "Lectures - Clinical Applications"},
          { time: "14:30", t: "Lunch"},
          { time: "15:30", t: "Afternoon Lectures"},
          { time: "19:00", t: "Gala night 1"},
          { time: "22:00"},
        ];
      case 2:
        return [
          { time: "09:00", t: "Zygomatic Masterclass (Dr. Johnson Raja James) +  3D Model Hands on"},
          { time: "12:00", t: "Prosthodontics 3D printing Master class"},
          { time: "12:00", t: "Zygomatic Live Surgery"},
          { time: "12:00", t: "FMR Implantology Live Surgery - Hands on"},
          { time: "18:00", t: "Prosthodontics  3D Printing Digital Workflow - hands on"},
          { time: "20:00"},
        ];
      case 3:
        return [
          { time: "09:00", t: "Ozone Theraphy Masterclass (Dr. Sudhir Doley)"},
          { time: "12:00", t: "FMR Implantology Live Surgery - Hands on"},
          { time: "12:00", t: "Ozone Theraphy Live Patient -  Hands on"},
          { time: "12:00", t: "Digital Workflow Prosthodontics 3D Printing"},
          { time: "18:00", t: "3D Printed Prosthetics Patient Delivery - Hands on"},
          { time: "20:00"},
        ];
      case 4:
        return [
          { time: "09:00", t: "Research KAR Masterclass"},
          { time: "09:00", t: "Dental Photgraphy Masterclass"},
          { time: "12:00", t: "FMR Implantology Live Surgery - Hands on"},
          { time: "12:00", t: "Dental Photgraphy Hands on - Live Patient demos"},
          { time: "12:00", t: "Digital Workflow Prosthodontics 3D Printing"},
          { time: "18:00", t: "3D Printed Prosthetics Patient Delivery - Hands on"},
          { time: "20:00"},
        ];
      case 5:
        return [
          { time: "09:00", t: "Research Masterclass - Advanced Topics"},
          { time: "12:00", t: "FMR Implantology Live Surgery - Hands on"},
          { time: "12:00", t: "Digital Workflow Prosthodontics 3D Printing"},
          { time: "18:00", t: "3D Printed Prosthetics Patient Delivery - Hands on"},
          { time: "20:00"},
        ];
      case 6:
        return [
          { time: "09:00", t: "FMR Implantology Live Surgery - Hands on"},
          { time: "12:00", t: "FMR Implantology Live Surgery - Continued Hands on"},
          { time: "18:00", t: "3D Printed Prosthetics Patient Delivery - Hands on"},
          { time: "21:00", t: "Victory Gala Party - Certificate and Awards Night"},
          { time: "23:59"},
        ];
      default:
        return [];
    }
  };

  return (
    <SectionShell 
      id="program" 
      label="The Itinerary" 
      title="7 Days · Raw Science" 
      subtitle="A meticulously curated week — lectures, live surgery, masterclasses and ceremony."
      dark
    >
      {/* Original Grid Layout */}
      <div className="space-y-4">
        {days.map((d, i) => (
          <div key={d.d}>
            <motion.button
              onClick={() => setExpandedDay(expandedDay === i ? null : i)}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.6 }}
              className={`w-full grid md:grid-cols-[180px_1fr] gap-6 p-5 md:p-6 border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group ${
                expandedDay === i
                  ? "border-[var(--gold)]/50 bg-[var(--burgundy)]/40"
                  : "border-[var(--gold)]/15 hover:border-[var(--gold)]/50 bg-[var(--burgundy)]/20 hover:bg-[var(--burgundy)]/40"
              }`}
            >
              <div className="text-left">
                <div className="font-display text-3xl gradient-gold-text">{d.d}</div>
                <div className="text-xs uppercase tracking-[0.3em] text-[var(--ivory)]/60 mt-1">{d.date}</div>
              </div>
              <div>
                <h3 className="font-display text-2xl text-[var(--ivory)]">{d.t}</h3>
                <div className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--gold)]/70">
                  {expandedDay === i ? "Collapse details ↑" : "View timeline →"}
                </div>
              </div>
            </motion.button>

            <AnimatePresence initial={false}>
              {expandedDay === i && (
                <motion.div
                  key={`day-timeline-${i}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="relative left-1/2 mt-4 w-screen max-w-[100vw] -translate-x-1/2"
                  >
                    <DailyFlowTimeline
                      dayLabel={d.d}
                      dayTitle={d.t}
                      items={getTimelineItems(i)}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ---------------- FACULTY ---------------- */
export function Faculty() {
  const img = (file: string) => `/images/faculty/${file}`;

  const groups: { title: string; members: FacultyMember[] }[] = [
    {
      title: "Specialist Faculty",
      members: [
        { n: "Dr. Ashish Sethi", r: "MOI SWITZERLAND · MS IMPLANT", y: "FFA · FAFO (Ortho) · FILI London · Master of Oral Implantology", image: img("ashish-sethi.jpeg") },
        { n: "Dr. N.B Singh", r: "SENIOR STRATEGIC IMPLANTOLOGIST", y: "Advanced corticobasal techniques · Clinical mentor", image: img("nb-singh.jpeg") },
        { n: "Dr. Abhaydeep Singh", r: "IMPLANT DESIGN EXPERT", y: "Bi Cortical Implantologist · 10+ Years · Developing macro-thread designs that dissipate masticatory stress across the basal bone, preventing localized pressure and crestal resorption", image: img("abhaydeep-singh.jpeg") },
        { n: "Dr. Sudhir Doley", r: "PIONEER TRAINER FOR OZONE DENTISTRY IN INDIA", y: "Ozone–Basal Synergy protocol architect · Bio-logical approach advocate", image: img("Dr. Sudhir Doley.jpeg") },
        { n: "Dr. Shahul Hameed", r: "BDS · MDS PROSTHODONTICS", y: "Ozone Fellow & Diplomate BOCI · Prosthodontic–implant interface · Full-arch specialist", image: img("Shahul Hameed.jpeg") },
      ],
    },
    {
      title: "Clinical Heads",
      members: [
        { n: "Dr. Kanak Pareek", r: "BDS MDS OMFR (CPS)", y: "Founder of Metagnostic · Inventor of the Angle Assist and IOPA surgical systems · Project Director of Robotic & Guided Surgery Technical R&D", image: img("Dr. Kanak Pareek.jpeg") },
        { n: "Dr. Ayush Shrivastava", r: "BDS MDS OMFS (CPS)", y: "Bicortical Implantologist · Chief Scientist at Metagnostics · Expert in Robotic Innovations in dental surgery", image: img("Dr. Ayush Shrivastava.jpeg") },
        { n: "Dr. Vishwas Sharma", r: "BI CORTICAL SURGEON", y: "Implantologist · Perioperative Care Specialist", image: img("vishwas-sharma.jpeg") },
        { n: "Dr. Shiva Kumar S.A.", r: "BDS · DIGITAL WORKFLOW", y: "Master of 3D Printing and Digital Workflow · Digital dentistry pioneer · 2-day intensive lead", image: img("shiva-kumar.jpeg") },
      ],
    },
    {
      title: "Program Directors",
      members: [
        { n: "Dr. Kanak Pareek", y: "Founder & Chief Innovator · Inventor of the Angle Assist and IOPA surgical systems · Project Director of Robotic & Guided Surgery Technical R&D", image: img("Dr. Kanak Pareek.jpeg") },
        { n: "Dr. Ayush Shrivastava", y: "Founder & Chief Scientist · Bicortical Implantologist · Chief Scientist at Metagnostics · Expert in Robotic Innovations in dental surgery", image: img("Dr. Ayush Shrivastava.jpeg") },
        { n: "Dr. Kailash Pareek", y: "Senior Physician · Medical Examiner (LIC) · 43 yrs experience", image: img("kailash-pareek.jpeg") },
        { n: "Dr. Ashish Shrivastava", y: "Senior Dental Surgeon · 35 yrs of clinical experience", image: img("Dr. Ashish Shrivastava.jpeg") },
        { n: "Dr. Manju Shrivastava", y: "Senior Implantologist · 30 years of clinical experience", image: img("Manju Shrivastava.jpeg") },
        { n: "Dr. Sapt Rishi Patel", y: "Oral & Maxillofacial Surgeon · IDA President Alwar", image: img("sapt-rishi-patel.jpeg") },
        { n: "Dr. Abhaydeep Singh", y: "Bi Cortical Implantologist · 15+ Years", image: img("abhaydeep-singh.jpeg") },
        { n: "Dr. Reha Patel", y: "Senior Aesthetic Expert · Chief Co-Ordinator I.C.O.R.E 2026", image: img("reha-patel.jpeg") },
        { n: "Dr. Vishwas Sharma", y: "Bi Cortical Surgeon · Implantologist · Perioperative Care Specialist", image: img("vishwas-sharma.jpeg") },
      ],
    },
  ];

  return (
    <SectionShell id="faculty" label="The Mentors" title="Faculty & Program Leaders" dark>
      <div className="space-y-16">
        {groups.map((g) => (
          <div key={g.title}>
            <div className="mb-8 flex items-center gap-4">
              <h3 className="font-display text-2xl tracking-wide text-[var(--gold)]">{g.title}</h3>
              <div className="h-px flex-1 bg-[var(--gold)]/20" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {g.members.map((m, i) => (
                <FacultyCard key={`${g.title}-${m.n}-${i}`} member={m} index={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ---------------- MEDICAL PANEL ---------------- */
export function MedicalPanel() {
  const panel = [
    { t: "Neurology", d: "Cranial nerve protection · Pain pathways · TMJ neurology", icon: "✦" },
    { t: "Psychiatry", d: "Patient anxiety · Body-image rehabilitation · Behavioral medicine", icon: "✦" },
    { t: "Bone Health", d: "Endocrinology · Bisphosphonate management · Osteoporosis protocols", icon: "✦" },
    { t: "Nuclear Medicine", d: "Consent counseling · Long-term satisfaction · Outcome perception", icon: "✦" },
  ];
  return (
    <SectionShell
      id="panel"
      label="Beyond Dentistry"
      title="The Interdisciplinary Panel"
      subtitle="Implantology does not exist in isolation. ICORE convenes specialists across medicine to treat the patient — not the tooth."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {panel.map((p, i) => (
          <motion.div
            key={p.t}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="ornament-frame p-8 text-center bg-[var(--card)]/40"
          >
            <div className="text-3xl text-[var(--gold)]">{p.icon}</div>
            <h3 className="mt-4 font-display text-xl text-[var(--ivory)]">{p.t}</h3>
            <p className="mt-3 text-sm text-[var(--ivory)]/65 leading-relaxed">{p.d}</p>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ---------------- MASTERCLASSES ---------------- */
export function Masterclasses() {
  return (
    <SectionShell id="masterclasses" label="Deep Dives" title="Masterclasses" dark>
      <MasterclassesSection />
    </SectionShell>
  );
}

/* ---------------- RESEARCH ---------------- */
export function Research() {
  return (
    <SectionShell id="research" label="The Dataset" title="India’s Largest Research Dataset">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="space-y-6">
            {[
              { n: "500+", t: "Live Cases", d: "Documented implant placements across the 7-day program." },
              { n: "100%", t: "CBCT Documented", d: "Pre-op, post-op and follow-up volumetric scans." },
              { n: "5 Years", t: "Patient Follow-up", d: "Longitudinal data already in active analysis." },
              { n: "Indexed", t: "Publication Pathway", d: "Structured authorship in peer-reviewed journals." },
            ].map((r) => (
              <div key={r.t} className="flex gap-5 p-5 border-l-2 border-[var(--gold)]/60 bg-[var(--burgundy)]/20">
                <div className="font-display text-3xl gradient-gold-text shrink-0 w-24">{r.n}</div>
                <div>
                  <div className="font-display text-lg text-[var(--ivory)]">{r.t}</div>
                  <div className="text-sm text-[var(--ivory)]/60 mt-1">{r.d}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="ornament-frame p-12 text-center bg-[var(--burgundy)]/40">
          <div className="text-xs uppercase tracking-[0.4em] text-[var(--gold)]">Headline</div>
          <h3 className="mt-6 font-display text-4xl md:text-5xl text-[var(--ivory)] leading-tight">
            India’s Largest <span className="gradient-gold-text">Research Dataset</span>
          </h3>
          <p className="mt-6 font-serif italic text-lg text-[var(--ivory)]/70">
            “What was once anecdote becomes evidence. What was once tradition becomes science.”
          </p>
          <div className="gold-divider mt-10" />
          <p className="mt-6 text-xl uppercase tracking-[0.3em] text-[var(--gold-soft)]">World-Record Attempt</p>
        </motion.div>
      </div>
    </SectionShell>
  );
}

/* ---------------- VENUE ---------------- */
export function Venue() {
  const f = [
    { t: "Auditorium", d: "500+ capacity · Tiered seating · 4K projection", n: "01" },
    { t: "Mega OT", d: "6 surgical chairs · Live broadcast · Sterile zones", n: "02" },
    { t: "War Room", d: "Case planning · CBCT review · Mentor pods", n: "03" },
    { t: "Food Court", d: "Royal Rajasthani cuisine · Networking lounges", n: "04" },
  ];
  return (
    <SectionShell id="venue" label="The Ground" title="Venue · SIAM Institute , Jaipur" dark>
      <div className="grid md:grid-cols-4 gap-6">
        {f.map((x, i) => (
          <motion.div
            key={x.t}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 border border-[var(--gold)]/20 hover:border-[var(--gold)]/60 bg-[var(--burgundy)]/30 hover:bg-[var(--burgundy)]/50 transition-all group"
          >
            <div className="font-display text-5xl gradient-gold-text">{x.n}</div>
            <div className="gold-divider my-4" />
            <h3 className="font-display text-xl text-[var(--ivory)]">{x.t}</h3>
            <p className="mt-2 text-sm text-[var(--ivory)]/65">{x.d}</p>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ---------------- PRICING ---------------- */
export function Pricing({ onReserve }: { onReserve: (item: CartItemPayload) => void }) {
  const tiers = [
    {
      id: "conference",
      t: "Conference",
      p: "₹9,999",
      price: 9999,
      tagline: "Observer Pass",
      features: ["All keynote lectures", "Live surgery viewing", "Digital handouts", "CME certificate"],
    },
    {
      id: "initiate",
      t: "The Initiate",
      p: "₹29,999",
      price: 29999,
      tagline: "Engaged Learner",
      features: ["Everything in Conference", "Hands-on workshop access", "Cadaver simulation", "Networking dinner"],
    },
    {
      id: "specialist",
      t: "The Specialist",
      p: "₹49,999",
      price: 49999,
      tagline: "Clinical Path",
      featured: true,
      features: ["Everything in Initiate", "5–10 implants placement log", "Mentor pairing", "Digital asset pack"],
    },
    {
      id: "pro-titan",
      t: "The Pro Titan",
      p: "₹89,999",
      price: 89999,
      tagline: "All Access · All Glory",
      features: ["Everything in Specialist", "20+ implant placements", "Indexed publication slot", "Recommendation letter", "Royal gala VIP table"],
    },
  ];
  return (
    <SectionShell id="pricing" label="Registration" title="Choose Your Path" subtitle="Four tiers — from observation to full immersion. All prices in INR.">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative p-8 flex flex-col ${
              t.featured
                ? "border-2 border-[var(--gold)] bg-[var(--burgundy)]/60 shadow-gold scale-105"
                : "border border-[var(--gold)]/20 bg-[var(--burgundy)]/20"
            }`}
          >
            {t.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--gold)] text-[var(--burgundy-deep)] text-[10px] uppercase tracking-[0.3em] px-4 py-1">
                Most Popular
              </div>
            )}
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">{t.tagline}</div>
            <h3 className="mt-3 font-display text-2xl text-[var(--ivory)]">{t.t}</h3>
            <div className="mt-4 font-display text-4xl gradient-gold-text">{t.p}</div>
            <div className="gold-divider my-6" />
            <ul className="space-y-3 flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[var(--ivory)]/75">
                  <span className="text-[var(--gold)] mt-0.5">✦</span> {f}
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => onReserve({ id: t.id, title: t.t, label: t.p, price: t.price, source: "Tier" })} className={reserveButtonClasses}>
              Reserve →
            </button>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ---------------- ADD-ONS ---------------- */
export function AddOns({ onReserve }: { onReserve: (item: CartItemPayload) => void }) {
  const items = [
    { id: "3d-print", t: "3D Printing Workshop", p: "+ ₹19,999", price: 19999, d: "2-day intensive · Bring your own scanner files." },
    { id: "zygomatic", t: "Zygomatic Add-On", p: "+ ₹7,999", price: 7999, d: "Cadaver lab + extended live OT access." },
    { id: "ozone", t: "Ozone Therapy Module", p: "+ ₹3,499", price: 3499, d: "Half-day certification with equipment training." },
    { id: "research", t: "Research Package", p: "+ ₹99,999", price: 99999, d: "Manuscript mentorship + indexed publication co-authorship." },
  ];
  return (
    <SectionShell id="addons" label="Optional" title="Add-On Workshops" dark>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((it, i) => (
          <motion.div
            key={it.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="p-7 border border-[var(--gold)]/20 hover:border-[var(--gold)]/60 bg-[var(--burgundy)]/30 transition-all"
          >
            <h3 className="font-display text-lg text-[var(--ivory)]">{it.t}</h3>
            <div className="mt-3 font-display text-2xl gradient-gold-text">{it.p}</div>
            <p className="mt-3 text-sm text-[var(--ivory)]/65">{it.d}</p>
            <button type="button" onClick={() => onReserve({ id: it.id, title: it.t, label: it.p, price: it.price, source: "Add-on" })} className={reserveButtonClasses}>
              Reserve →
            </button>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ---------------- JAIPUR ---------------- */
export function Jaipur() {
  const places = [
    { img: "/images/hawa-mahal.jpg", t: "Hawa Mahal", d: "The Palace of Winds — 953 jharokha windows in pink sandstone." },
    { img: "/images/amber-fort.jpg", t: "Amber Fort", d: "Hilltop fortress where Rajput valor meets Mughal artistry." },
    { img: "/images/city-palace.jpg", t: "City Palace", d: "The royal residence — courtyards, museums, and living heritage." },
  ];
  return (
    <SectionShell id="jaipur" label="The Pink City" title="An Experience Beyond Science" subtitle="Curated cultural evenings, royal dining, and guided heritage tours — Jaipur is part of the program.">
      <div className="grid md:grid-cols-3 gap-6">
        {places.map((p, i) => (
          <motion.div
            key={p.t}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            whileHover={{ y: -8 }}
            className="group overflow-hidden border border-[var(--gold)]/20"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img src={p.img} alt={p.t} loading="lazy" width={1280} height={1280} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="p-6 bg-[var(--burgundy)]/40">
              <h3 className="font-display text-2xl text-[var(--ivory)]">{p.t}</h3>
              <div className="gold-divider my-3" />
              <p className="text-sm text-[var(--ivory)]/65">{p.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <p className="font-serif italic text-xl text-[var(--gold-soft)]">
          “A conference at the heart of India’s royal heritage.”
        </p>
      </div>
    </SectionShell>
  );
}

/* ---------------- FINAL CTA ---------------- */
export function FinalCTA() {
  return (
    <section id="cta" className="relative py-32 px-6 overflow-hidden bg-[var(--burgundy-deep)]">
      <div
        className="absolute inset-0 opacity-15"
        style={{ backgroundImage: "url(/images/jaipur-pattern.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--burgundy-deep)] via-[var(--burgundy-deep)]/70 to-[var(--burgundy-deep)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <SectionLabel>Final Call</SectionLabel>
        <h2 className="mt-6 font-display text-5xl md:text-7xl text-[var(--ivory)] leading-tight">
          Take Your Seat in <span className="gradient-gold-text">History</span>
        </h2>
        <p className="mt-8 font-serif italic text-xl text-[var(--ivory)]/75 max-w-2xl mx-auto">
          Limited to 200 surgeons. The cortex unites only once. The Pink City awaits.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
          <a
            href="#pricing"
            className="px-12 py-5 bg-[var(--gold)] text-[var(--burgundy-deep)] uppercase tracking-[0.3em] text-xs font-medium shadow-gold hover:shadow-luxe transition-all"
          >
            Register Now →
          </a>
          <a
            href="tel:+917722840535"
            className="px-12 py-5 border border-[var(--gold)]/60 text-[var(--gold)] uppercase tracking-[0.3em] text-xs hover:bg-[var(--gold)]/10 transition-all"
          >
            Call +91 77228 40535
          </a>
        </div>
        <Ornament className="mt-16" />
        <div className="mt-10 grid sm:grid-cols-3 gap-6 text-sm text-[var(--ivory)]/70">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]">Date</div>
            <div className="mt-2 font-display text-lg text-[var(--ivory)]">21–27 Nov 2026</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]">Venue</div>
            <div className="mt-2 font-display text-lg text-[var(--ivory)]">SIAM Institute, Jaipur</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]">Email</div>
            <a href="mailto:titanium@corticocore.com" className="mt-2 font-display text-lg text-[var(--ivory)] hover:text-[var(--gold)] block">
              titanium@corticocore.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
export function Footer() {
  return (
    <footer className="border-t border-[var(--gold)]/15 bg-[var(--burgundy-deep)] py-10 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-[var(--ivory)]/50">
        <div>© 2026 Cortico Core · ICORE</div>
        <div className="text-[var(--gold)]">✦ One Biology · One Mission ✦</div>
        <div>Jaipur · Rajasthan · India</div>
      </div>
    </footer>
  );
}