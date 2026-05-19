import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export type DailyFlowItem = { time: string; t: string; d: string };

const easePremium = [0.22, 1, 0.36, 1] as const;

function TimelineEntry({
  item,
  index,
  side,
}: {
  item: DailyFlowItem;
  index: number;
  side: "left" | "right";
}) {
  const fromX = side === "left" ? -36 : 36;

  return (
    <motion.div
      initial={{ opacity: 0, x: fromX }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.07,
        ease: easePremium,
      }}
      className={`group py-0.5 text-left ${side === "left" ? "md:text-right" : "md:text-left"}`}
    >
      <div className="font-display text-lg md:text-xl gradient-gold-text tabular-nums tracking-wide">
        {item.time}
      </div>
      <h5 className="mt-0.5 font-display text-base md:text-lg text-[var(--ivory)] leading-snug">
        {item.t}
      </h5>
      <p className="mt-0.5 font-serif text-xs md:text-sm text-[var(--ivory)]/60 leading-snug line-clamp-2">
        {item.d}
      </p>
    </motion.div>
  );
}

function TimelineNode({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        delay: index * 0.07 + 0.05,
        duration: 0.45,
        type: "spring",
        stiffness: 280,
        damping: 24,
      }}
      className="relative z-20 flex shrink-0 items-center justify-center"
    >
      <motion.div
        className="absolute h-6 w-6 rounded-full bg-[var(--gold)]/15 blur-sm"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 }}
      />
      <div className="timeline-node-ring relative h-3 w-3 rounded-full bg-[var(--gold)] shadow-[0_0_10px_var(--gold)] ring-2 ring-[var(--background)]" />
    </motion.div>
  );
}

function DesktopTimelineRow({
  item,
  index,
  isLeft,
}: {
  item: DailyFlowItem;
  index: number;
  isLeft: boolean;
}) {
  return (
    <div className="relative hidden md:grid md:grid-cols-[1fr_2rem_1fr] md:items-center md:gap-4 md:py-2">
      <div className={`col-start-1 ${isLeft ? "" : "pointer-events-none invisible"}`}>
        {isLeft && <TimelineEntry item={item} index={index} side="left" />}
      </div>
      <div className="col-start-2 flex justify-center py-1">
        <TimelineNode index={index} />
      </div>
      <div className={`col-start-3 ${!isLeft ? "" : "pointer-events-none invisible"}`}>
        {!isLeft && <TimelineEntry item={item} index={index} side="right" />}
      </div>
    </div>
  );
}

function MobileTimelineRow({ item, index }: { item: DailyFlowItem; index: number }) {
  const side = index % 2 === 0 ? "left" : "right";
  return (
    <div className="relative flex gap-4 md:hidden py-2">
      <div className="flex w-6 shrink-0 flex-col items-center pt-1">
        <TimelineNode index={index} />
      </div>
      <div className="min-w-0 flex-1">
        <TimelineEntry item={item} index={index} side={side} />
      </div>
    </div>
  );
}

export function DailyFlowTimeline({
  dayLabel,
  dayTitle,
  items,
}: {
  dayLabel: string;
  dayTitle: string;
  items: DailyFlowItem[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "end 0.1"],
  });

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const ambientY1 = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const ambientY2 = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <div
      ref={containerRef}
      className="relative border-y border-[var(--gold)]/15 bg-[var(--background)] py-8 md:py-10 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          style={{ y: ambientY1 }}
          className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-[var(--gold)]/8 blur-3xl animate-section-glow"
        />
        <motion.div
          style={{ y: ambientY2 }}
          className="absolute -right-24 bottom-0 h-56 w-56 rounded-full bg-[var(--burgundy)]/12 blur-3xl animate-section-drift"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--burgundy)]/10 via-transparent to-[var(--burgundy-deep)]/15" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 md:px-8">
        <header className="mb-6 md:mb-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--gold)]">Daily Rhythm</p>
          <h4 className="mt-2 font-display text-xl md:text-2xl text-[var(--ivory)] tracking-wide">
            {dayLabel}
          </h4>
          <p className="mt-1 font-serif text-sm md:text-base italic text-[var(--ivory)]/60">{dayTitle}</p>
          <div className="gold-divider mx-auto mt-4 max-w-xs" />
        </header>

        <div className="relative">
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-6 -translate-x-1/2 md:block">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[var(--gold)]/10" />
            <motion.div
              style={{ scaleY: lineScale }}
              className="timeline-spine absolute left-1/2 top-0 h-full w-[2px] origin-top -translate-x-1/2"
            />
          </div>

          <div className="pointer-events-none absolute left-3 top-0 h-full w-6 md:hidden">
            <motion.div
              style={{ scaleY: lineScale }}
              className="timeline-spine absolute left-1/2 top-0 h-full w-[2px] origin-top -translate-x-1/2"
            />
          </div>

          <div className="relative">
            {items.map((item, index) => (
              <div key={`${item.time}-${item.t}`}>
                <DesktopTimelineRow item={item} index={index} isLeft={index % 2 === 0} />
                <MobileTimelineRow item={item} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
