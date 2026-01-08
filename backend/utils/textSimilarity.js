export const similarity = (a, b) => {
  const setA = new Set(a.toLowerCase().split(" "));
  const setB = new Set(b.toLowerCase().split(" "));
  const common = [...setA].filter(x => setB.has(x));
  return common.length / Math.min(setA.size, setB.size);
};
