/**
 * Validates MDX heading hierarchy assuming DocsTitle renders the page H1 from frontmatter.
 * Body headings must start at ## and must not skip levels (e.g. ## → ####).
 */
import { readFile } from 'node:fs/promises';
import { getFiles, CONTENT_DIR } from './helpers';

const HEADING_RE = /^(#{1,6})\s+(.+)$/gm;

type Issue = { file: string; line: number; message: string };

async function main() {
  const files = await getFiles(CONTENT_DIR);
  const issues: Issue[] = [];

  for (const file of files) {
    const content = await readFile(file, 'utf-8');
    const withoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
    const withoutFences = withoutFrontmatter
      .replace(/```[\s\S]*?```/g, '')
      .replace(/~~~[\s\S]*?~~~/g, '');

    let line = 1;
    const offsetLine = (index: number) => {
      const before = withoutFences.slice(0, index);
      return line + (before.match(/\n/g)?.length ?? 0);
    };

    let prevLevel = 1; // DocsTitle renders frontmatter title as h1
    let firstBodyHeading = true;
    let match: RegExpExecArray | null;
    HEADING_RE.lastIndex = 0;

    while ((match = HEADING_RE.exec(withoutFences)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const atLine = offsetLine(match.index);

      if (level === 1) {
        issues.push({
          file,
          line: atLine,
          message: `h1 in body ("${text}") — page title is already h1 via DocsTitle`,
        });
      }

      if (firstBodyHeading) {
        firstBodyHeading = false;
        if (level < 2) {
          issues.push({
            file,
            line: atLine,
            message: `first heading is h${level}; expected h2 (##) under page title`,
          });
        } else if (level > 2) {
          issues.push({
            file,
            line: atLine,
            message: `first heading is h${level} ("${text}"); skips h2 under page title`,
          });
        }
      } else if (level > prevLevel + 1) {
        issues.push({
          file,
          line: atLine,
          message: `h${level} ("${text}") skips h${prevLevel + 1} after h${prevLevel}`,
        });
      }

      prevLevel = level;
    }
  }

  console.log(`Checked ${files.length} files\n`);

  if (issues.length === 0) {
    console.log('✅ All headings follow proper hierarchy (h1 title → h2+ body, no skipped levels).');
    return;
  }

  console.log(`❌ ${issues.length} heading issue(s):\n`);
  for (const { file, line, message } of issues) {
    console.log(`   ${file}:${line}`);
    console.log(`   ${message}\n`);
  }
  process.exit(1);
}

main();
