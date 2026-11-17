import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function countProse(markdown) {
  const prose = markdown
    .replace(/^\s*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\s*\1\s*$/gm, ' ')
    .replace(/<!--[^]*?-->/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/[^\s<>]+/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s*\|?[\s:|-]+\|?\s*$/gm, ' ')
    .replace(/^\s{0,3}(?:#{1,6}\s+|[-*+]\s+|\d+[.)]\s+|>\s?)/gm, '')
    .replace(/[*_|~]/g, ' ')
    .replace(/\s+[—–·]\s+/g, ' ');
  return prose.trim().split(/\s+/u).filter(Boolean).length;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const file = new URL('../README.md', import.meta.url);
  const readme = readFileSync(file, 'utf8');
  const body = readme.split('<!-- prose-start -->')[1];
  if (!body) throw new Error('README prose marker is missing');
  const count = countProse(body);
  const expected = Number(readme.match(/\*\*Prose Word Count: (\d+)\*\*/)?.[1]);
  if (process.argv.includes('--check')) {
    if (count !== expected) throw new Error(`README count is stale: stated ${expected}, actual ${count}`);
  } else writeFileSync(file, readme.replace(/\*\*Prose Word Count: \d+\*\*/, `**Prose Word Count: ${count}**`));
  console.log(`README prose: ${count} words (code and URLs excluded)`);
}
