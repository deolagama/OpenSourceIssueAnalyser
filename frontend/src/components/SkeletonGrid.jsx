import React from "react";

export default function SkeletonGrid({ count = 6 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 0.06}s` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div className="skeleton-line" style={{ width: "30%", height: 14 }} />
            <div className="skeleton-line small" />
          </div>
          <div className="skeleton-line long" />
          <div className="skeleton-line medium" />
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <div className="skeleton-line" style={{ width: "20%", height: 22, borderRadius: "100px" }} />
            <div className="skeleton-line" style={{ width: "20%", height: 22, borderRadius: "100px" }} />
          </div>
          <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid #1e293b", display: "flex", justifyContent: "space-between" }}>
            <div className="skeleton-line" style={{ width: "35%", height: 14 }} />
            <div className="skeleton-line" style={{ width: "20%", height: 14 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
