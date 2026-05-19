import { motion } from "framer-motion";

export type FacultyMember = {
  n: string;
  r?: string;
  y?: string;
  image?: string;
};

export function FacultyCard({ member, index }: { member: FacultyMember; index: number }) {
  const initial = member.n
    .split(" ")
    .slice(1)
    .map((p) => p[0])
    .join("") || "✦";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="group ornament-frame flex gap-5 overflow-hidden glass p-4 transition-all duration-500 hover:bg-[var(--burgundy)]/45 md:gap-6 md:p-5"
    >
      <div className="relative h-36 w-28 shrink-0 overflow-hidden border border-[var(--gold)]/25 bg-[var(--burgundy-deep)] md:h-40 md:w-32">
        {member.image ? (
          <img
            src={member.image}
            alt={member.n}
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--gold)]/90 to-[var(--burgundy)] font-display text-2xl text-[var(--burgundy-deep)]">
            {initial}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[var(--gold)]/10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[var(--burgundy-deep)]/50 to-transparent" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
        <h4 className="font-display text-lg leading-snug text-[var(--ivory)] md:text-xl">{member.n}</h4>
        {member.r && (
          <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.12em] text-[var(--gold-soft)] md:text-sm">
            {member.r}
          </p>
        )}
        {member.y && (
          <p className="mt-2 text-xs leading-relaxed text-[var(--ivory)]/60 md:text-sm">{member.y}</p>
        )}
        <div className="gold-divider mt-4 w-12 opacity-40 transition-all duration-500 group-hover:w-full group-hover:opacity-80" />
      </div>
    </motion.article>
  );
}
