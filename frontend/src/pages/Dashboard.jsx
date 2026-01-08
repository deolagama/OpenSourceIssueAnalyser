import { useState } from "react";
import { analyzeRepo } from "../api/analyzeApi";
import RepoInput from "../components/RepoInput";
import IssueTable from "../components/IssueTable";

export default function Dashboard() {
  const [issues, setIssues] = useState([]);

  const handleAnalyze = async (repo) => {
    const data = await analyzeRepo(repo);
    setIssues(data.issues);
  };

  return (
    <>
      <RepoInput onAnalyze={handleAnalyze} />
      <IssueTable issues={issues} />
    </>
  );
}
