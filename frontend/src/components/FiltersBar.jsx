import React from "react";
import { Icon } from "./Icons";

const FILTERS = [
  { key: "all",       label: "All Issues",   icon: "list"          },
  { key: "Easy",      label: "Easy",         icon: "checkCircle",  colorClass: "green"  },
  { key: "Medium",    label: "Medium",       icon: "bar",          colorClass: "orange" },
  { key: "Hard",      label: "Hard",         icon: "alertTriangle",colorClass: "red"    },
  { key: "stale",     label: "Stale",        icon: "clock",        colorClass: "blue"   },
  { key: "firstTimer",label: "First Timer",  icon: "leaf",         colorClass: "red"    }
];

const SORT_OPTIONS = [
  { value: "default",       label: "Default order"  },
  { value: "comments_desc", label: "Most comments"  },
  { value: "comments_asc",  label: "Fewest comments"},
  { value: "newest",        label: "Newest first"   },
  { value: "oldest",        label: "Oldest first"   },
  { value: "title_asc",     label: "Title A–Z"      }
];

export default function FiltersBar({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange
}) {
  return (
    <div className="filters-bar">
      <div className="filter-group">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            id={`filter-${f.key}`}
            className={`filter-btn ${activeFilter === f.key ? `active ${f.colorClass || ""}` : ""}`}
            onClick={() => onFilterChange(f.key)}
          >
            <Icon
              name={f.icon}
              size={13}
              color={activeFilter === f.key ? "white" : "var(--text-muted)"}
            />
            {f.label}
          </button>
        ))}
      </div>

      <select
        className="sort-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        id="sort-select"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <input
        id="search-filter-input"
        className="search-filter"
        type="text"
        placeholder="Search issues…"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
