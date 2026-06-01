import { similarity } from "../utils/textSimilarity.js"; 
export const findDuplicates = (issues) => {
  let duplicates = [];

  for (let i = 0; i < issues.length; i++) {
    for (let j = i + 1; j < issues.length; j++) {
      if (similarity(issues[i].title, issues[j].title) > 0.6) {
        duplicates.push([issues[i].number, issues[j].number]);
      }
    }
  }
  return duplicates;
};
