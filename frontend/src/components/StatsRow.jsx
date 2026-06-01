import React from "react";
import { Icon } from "./Icons";

export default function StatsRow({ issues, firstTimer, duplicates }) {
  const total = issues.length;
  const easy = issues.filter((i) => i.difficulty === "Easy").length;
  const medium = issues.filter((i) => i.difficulty === "Medium").length;
  const hard = issues.filter((i) => i.difficulty === "Hard").length;
  const stale = issues.filter((i) => i.stale).length;
  const firstTimerCount = firstTimer?.length || 0;

  const stats = [
    { icon: "list",        value: total,           label: "Total Issues",         color: "purple" },
    { icon: "checkCircle", value: easy,             label: "Easy",                 color: "green"  },
    { icon: "bar",         value: medium,           label: "Medium",               color: "orange" },
    { icon: "alertTriangle",value: hard,            label: "Hard",                 color: "red"    },
    { icon: "clock",       value: stale,            label: "Stale (>90 days)",     color: "blue"   },
    { icon: "leaf",        value: firstTimerCount,  label: "First Timer Friendly", color: "pink"   }
  ];

  const iconColors = {
    purple: "var(--accent)",
    green:  "var(--green)",
    orange: "var(--orange)",
    red:    "var(--red)",
    blue:   "var(--blue)",
    pink:   "var(--pink)"
  };

  return (
    <div className="stats-row">
      {stats.map((s, i) => (
        <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.07}s` }}>
          <div className={`stat-icon-wrap ${s.color}`}>
            <Icon name={s.icon} size={18} color={iconColors[s.color]} />
          </div>
          <div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
