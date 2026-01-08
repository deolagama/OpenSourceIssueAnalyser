export default function IssueTable({ issues }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Difficulty</th>
          <th>Stale</th>
        </tr>
      </thead>
      <tbody>
        {issues.map(issue => (
          <tr key={issue.id}>
            <td>{issue.title}</td>
            <td>{issue.difficulty}</td>
            <td>{issue.stale ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
