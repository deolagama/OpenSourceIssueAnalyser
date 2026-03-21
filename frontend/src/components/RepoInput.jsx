import React, { useState } from "react";

const POPULAR_REPOS = [
  "sugarlabs/musicblocks",
  "facebook/react",
  "microsoft/vscode",
  "tensorflow/tensorflow"
];

export default function RepoInput({ onAnalyze, isLoading }) {
  const [repo, setRepo] = useState("sugarlabs/musicblocks");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (repo.trim()) onAnalyze(repo.trim());
  };

  const handleChipClick = (selected) => {
    setRepo(selected);
    onAnalyze(selected);
  };

  return (
    <div className="search-section">
      <form onSubmit={handleSubmit}>
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            id="repo-input"
            className="search-input"
            type="text"
            placeholder="owner/repository  e.g. facebook/react"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            disabled={isLoading}
          />
          <button
            id="analyze-btn"
            className="search-btn"
            type="submit"
            disabled={isLoading || !repo.trim()}
          >
            {isLoading ? (
              <>
                <span className="btn-spinner" />
                Analyzing…
              </>
            ) : (
              <>
                ✦ Analyze
              </>
            )}
          </button>
        </div>
      </form>

      <div className="popular-repos">
        <span className="popular-label">Try:</span>
        {POPULAR_REPOS.map((r) => (
          <button
            key={r}
            className="repo-chip"
            onClick={() => handleChipClick(r)}
            type="button"
            disabled={isLoading}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
