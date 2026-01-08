import { useState } from "react";

export default function RepoInput({ onAnalyze }) {
  const [repo, setRepo] = useState("");

  return (
    <div>
      <input
        placeholder="sugarlabs/musicblocks"
        onChange={(e) => setRepo(e.target.value)}
      />
      <button onClick={() => onAnalyze(repo)}>Analyze</button>
    </div>
  );
}
