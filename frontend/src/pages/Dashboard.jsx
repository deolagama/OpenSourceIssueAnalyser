import React, { useState, useMemo } from "react";
import { analyzeRepo } from "../api/analyzeApi";
import RepoInput from "../components/RepoInput";
import IssueCard from "../components/IssueCard";
import StatsRow from "../components/StatsRow";
import FiltersBar from "../components/FiltersBar";
import SkeletonGrid from "../components/SkeletonGrid";
import { Icon } from "../components/Icons";

function applySort(issues, sortBy) {
  const arr = [...issues];
  switch (sortBy) {
    case "comments_desc": return arr.sort((a, b) => (b.comments || 0) - (a.comments || 0));
    case "comments_asc":  return arr.sort((a, b) => (a.comments || 0) - (b.comments || 0));
    case "newest":        return arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    case "oldest":        return arr.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    case "title_asc":     return arr.sort((a, b) => a.title.localeCompare(b.title));
    default:              return arr;
  }
}

export default function Dashboard() {
  const [issues, setIssues]         = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [firstTimer, setFirstTimer] = useState([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [currentRepo, setCurrentRepo] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery]   = useState("");
  const [sortBy, setSortBy]             = useState("default");

  const firstTimerIds  = useMemo(() => new Set(firstTimer.map(i => i.id)), [firstTimer]);
  const duplicatePairs = useMemo(() => new Set(duplicates.flat().map(n => Number(n))), [duplicates]);

  //loading, calls backend, update states & trigger UI update  
  const handleAnalyze = async (repo) => {
    setIsLoading(true);
    setError(null);
    setHasAnalyzed(false);
    setCurrentRepo(repo);
    setActiveFilter("all");
    setSearchQuery("");
    setSortBy("default");

    try {
      const data = await analyzeRepo(repo);
      setIssues(data.issues || []);
      setDuplicates(data.duplicates || []);
      setFirstTimer(data.firstTimer || []);
      setHasAnalyzed(true);
    } catch (err) {
      let msg = "Something went wrong. Please try again.";
      if (err.response?.status === 404) {
        msg = `Repository "${repo}" not found. Check the owner/repo format.`;
      } else if (err.response?.status === 403) {
        msg = "GitHub API rate limit reached. Please wait a moment and try again.";
      } else if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
        msg = "Cannot reach backend. Make sure it is running on http://localhost:5000";
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredIssues = useMemo(() => {
    let result = [...issues];
    if (activeFilter === "stale")            result = result.filter(i => i.stale);
    else if (activeFilter === "firstTimer")  result = result.filter(i => firstTimerIds.has(i.id));
    else if (["Easy","Medium","Hard"].includes(activeFilter)) {
      result = result.filter(i => i.difficulty === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i =>
        i.title?.toLowerCase().includes(q) ||
        i.labels?.some(l => l.name.toLowerCase().includes(q)) ||
        String(i.number).includes(q)
      );
    }
    return applySort(result, sortBy);
  }, [issues, activeFilter, searchQuery, sortBy, firstTimerIds]);

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-inner">
            <div className="logo">
              <div className="logo-icon">
                <Icon name="analyze" size={18} color="white" />
              </div>
              <span className="logo-text">IssueAnalyser</span>
            </div>
            <div className="header-badge">
              <span className="pulse-dot" />
              GitHub API Connected
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="container">
          {/* Hero */}
          <section className="hero">
            <div className="hero-tag">
              <Icon name="zap" size={12} color="var(--accent)" />
              Powered by GitHub API
            </div>
            <h1 className="hero-title">
              Analyse Open Source<br />
              <span className="gradient-text">Issues Intelligently</span>
            </h1>
            <p className="hero-subtitle">
              Discover beginner-friendly issues, detect duplicate reports, measure
              staleness, and get difficulty ratings — all in one view.
            </p>
            <RepoInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          </section>

          {/* Error Banner */}
          {error && (
            <div className="error-banner">
              <Icon name="xCircle" size={16} color="var(--red)" />
              <div className="error-msg">
                <strong>Analysis Failed</strong>
                {error}
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && <SkeletonGrid count={6} />} {/*conditional rendering*/}

          {/* Results */}
          {!isLoading && hasAnalyzed && (
            <>
              <StatsRow issues={issues} firstTimer={firstTimer} duplicates={duplicates} />

              <div className="section-header">
                <h2 className="section-title">
                  Issues in{" "}
                  <span style={{ color: "var(--accent)" }}>{currentRepo}</span>
                </h2>
                <span className="section-count">
                  {filteredIssues.length} of {issues.length}
                </span>
              </div>

              <FiltersBar
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              {filteredIssues.length > 0 ? (
                <div className="issues-grid">
                  {filteredIssues.map((issue, idx) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      isFirstTimer={firstTimerIds.has(issue.id)}
                      isDuplicate={duplicatePairs.has(issue.number)}
                      animDelay={Math.min((idx % 5) + 1, 5)}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Icon name="search" size={40} color="var(--text-muted)" />
                  </div>
                  <p className="empty-title">No issues match your filters</p>
                  <p className="empty-desc">Try adjusting the filters or search query above.</p>
                </div>
              )}

              {/* Panels */}
              {(duplicates.length > 0 || firstTimer.length > 0) && (
                <div className="info-section">
                  <div className="info-grid">
                    {duplicates.length > 0 && (
                      <div className="info-card">
                        <div className="info-card-header">
                          <Icon name="gitMerge" size={16} color="var(--text-secondary)" />
                          <span className="info-card-title">
                            Potential Duplicates ({duplicates.length} pair{duplicates.length !== 1 ? "s" : ""})
                          </span>
                        </div>
                        {duplicates.slice(0, 8).map(([a, b], i) => (
                          <div key={i} className="dup-pair">
                            <span className="dup-num">#{a}</span>
                            <span style={{ color: "var(--text-muted)", fontSize: 11 }}>≈</span>
                            <span className="dup-num">#{b}</span>
                          </div>
                        ))}
                        {duplicates.length > 8 && (
                          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
                            +{duplicates.length - 8} more pairs
                          </p>
                        )}
                      </div>
                    )}

                    {firstTimer.length > 0 && (
                      <div className="info-card">
                        <div className="info-card-header">
                          <Icon name="leaf" size={16} color="var(--text-secondary)" />
                          <span className="info-card-title">
                            First Timer Friendly ({firstTimer.length})
                          </span>
                        </div>
                        {firstTimer.slice(0, 5).map((issue) => (
                          <div key={issue.id} className="dup-pair">
                            <span className="dup-num">#{issue.number}</span>
                            <span style={{
                              fontSize: 13,
                              color: "var(--text-secondary)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              flex: 1
                            }}>
                              {issue.title}
                            </span>
                          </div>
                        ))}
                        {firstTimer.length > 5 && (
                          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
                            +{firstTimer.length - 5} more
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Welcome State */}
          {!isLoading && !hasAnalyzed && !error && (
            <div className="empty-state" style={{ paddingTop: 32 }}>
              <div className="empty-icon">
                <Icon name="rocket" size={40} color="var(--text-muted)" />
              </div>
              <p className="empty-title">Ready to Analyse</p>
              <p className="empty-desc">
                Enter any public GitHub repository to get a full breakdown of open issues —
                difficulty, staleness, first-timer opportunities, and more.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>
            Powered by{" "}
            <a href="https://docs.github.com/en/rest" target="_blank" rel="noopener noreferrer">
              GitHub REST API
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
