import React from "react";

export default function StatsRow({ issues, firstTimer, duplicates }) {
  const total = issues.length;
  const easy = issues.filter((i) => i.difficulty === "Easy").length;
  const medium = issues.filter((i) => i.difficulty === "Medium").length;
  const hard = issues.filter((i) => i.difficulty === "Hard").length;
  const stale = issues.filter((i) => i.stale).length;
  const firstTimerCount = firstTimer?.length || 0;

  const stats = [
    { icon: "📋", value: total, label: "Total Issues", color: "purple" },
    { icon: "🟢", value: easy, label: "Easy", color: "green" },
    { icon: "🟡", value: medium, label: "Medium", color: "orange" },
    { icon: "🔴", value: hard, label: "Hard", color: "red" },
    { icon: "⏱", value: stale, label: "Stale (>90 days)", color: "blue" },
    { icon: "🌱", value: firstTimerCount, label: "First Timer Friendly", color: "pink" }
  ];

  return (
    <div className="stats-row">
      {stats.map((s, i) => (
        <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.07}s` }}>
          <div className={`stat-icon-wrap ${s.color}`}>{s.icon}</div>
          <div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
