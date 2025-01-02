export function formatWords(words: string[]): string {
  let result = '';
  for (let i = 0; i < words.length; i += 4) {
    const line = words.slice(i, i + 4).map((word, index) => `${i + index + 1}. ${word}`).join('  ');
    result += line + '\n';
  }
  return result;
}