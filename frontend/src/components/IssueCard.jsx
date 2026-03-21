import React from "react";

function getPriorityDots(difficulty) {
  const levels = { Easy: 1, Medium: 2, Hard: 3 };
  const filled = levels[difficulty] || 1;
  return Array.from({ length: 3 }, (_, i) => ({
    filled: i < filled,
    cls: difficulty?.toLowerCase()
  }));
}

function getDaysSince(dateStr) {
  if (!dateStr) return null;
  const days = Math.floor((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export default function IssueCard({ issue, isFirstTimer, isDuplicate, animDelay }) {
  const diff = issue.difficulty || "Medium";
  const cardClass = `issue-card ${diff.toLowerCase()}-card animate-delay-${animDelay}`;
  const dots = getPriorityDots(diff);

  return (
    <div className={cardClass}>
      <div className="card-top">
        <span className="card-number">#{issue.number}</span>
        <div className="card-badges">
          <span className={`badge badge-${diff.toLowerCase()}`}>
            {diff === "Easy" ? "🟢" : diff === "Hard" ? "🔴" : "🟡"} {diff}
          </span>
          {issue.stale && <span className="badge badge-stale">⏱ Stale</span>}
          {isFirstTimer && <span className="badge badge-first-timer">🌱 First Timer</span>}
          {isDuplicate && <span className="badge badge-duplicate">🔀 Duplicate</span>}
        </div>
      </div>

      <h3 className="card-title">
        <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
          {issue.title}
        </a>
      </h3>

      <div className="card-meta">
        {issue.comments !== undefined && (
          <span className="meta-item">
            <span className="icon">💬</span>
            {issue.comments} comment{issue.comments !== 1 ? "s" : ""}
          </span>
        )}
        {issue.updated_at && (
          <span className="meta-item">
            <span className="icon">🕐</span>
            {getDaysSince(issue.updated_at)}
          </span>
        )}
        {issue.user?.login && (
          <span className="meta-item">
            <span className="icon">👤</span>
            {issue.user.login}
          </span>
        )}
        {issue.assignee && (
          <span className="meta-item">
            <span className="icon">📎</span>
            Assigned
          </span>
        )}
      </div>

      {issue.labels?.length > 0 && (
        <div className="card-labels">
          {issue.labels.slice(0, 4).map((label) => (
            <span
              key={label.id}
              className="label-tag"
              style={{
                background: `#${label.color}22`,
                color: `#${label.color}`,
                borderColor: `#${label.color}44`
              }}
            >
              {label.name}
            </span>
          ))}
          {issue.labels.length > 4 && (
            <span className="label-tag">+{issue.labels.length - 4} more</span>
          )}
        </div>
      )}

      <div className="card-footer">
        <a
          href={issue.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="card-link-btn"
        >
          View on GitHub →
        </a>
        <div className="priority-bar">
          <span>Priority</span>
          <div className="priority-dots">
            {dots.map((d, i) => (
              <span
                key={i}
                className={`dot ${d.filled ? `filled ${d.cls}` : ""}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
