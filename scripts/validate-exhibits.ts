import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const EXHIBITS_DIR = path.resolve('./src/content/exhibits');
const PUBLIC_DIR = path.resolve('./public');
const ROOMS_DIR = path.resolve('./src/content/rooms');
const PEOPLE_DIR = path.resolve('./src/content/people');

function listFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.parse(f).name);
}

function validate(): void {
  const errors: string[] = [];

  if (!fs.existsSync(EXHIBITS_DIR)) {
    console.error('ERROR: missing exhibits directory', EXHIBITS_DIR);
    process.exit(1);
  }

  const roomSlugs = listFiles(ROOMS_DIR);
  const personSlugs = listFiles(PEOPLE_DIR);

  const files = fs
    .readdirSync(EXHIBITS_DIR)
    .filter((f) => f.endsWith('.md'));

  const ids = new Set<string>();

  for (const file of files) {
    const fullPath = path.join(EXHIBITS_DIR, file);
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const parsed = matter(raw);
    const d = parsed.data;

    const fileLabel = `${file}`;

    // id
    if (!d.id || typeof d.id !== 'string') {
      errors.push(`ERROR ${fileLabel}\n  Missing: id`);
    } else if (ids.has(d.id)) {
      errors.push(`ERROR ${d.id}\n  Duplicate id: ${d.id}`);
    } else {
      ids.add(d.id);
    }

    // title, date
    if (!d.title) errors.push(`ERROR ${d.id ?? fileLabel}\n  Missing: title`);
    if (!d.date) errors.push(`ERROR ${d.id ?? fileLabel}\n  Missing: date`);
    else if (isNaN(new Date(d.date).getTime())) {
      errors.push(`ERROR ${d.id ?? fileLabel}\n  Invalid date: ${d.date}`);
    }

    // person reference
    if (!d.person?.slug) {
      errors.push(`ERROR ${d.id ?? fileLabel}\n  Missing: person.slug`);
    } else {
      const ps = d.person.slug;
      const slug = typeof ps === 'string' ? ps : ps.id;
      if (!personSlugs.includes(slug)) {
        errors.push(`ERROR ${d.id ?? fileLabel}\n  Unknown person: ${slug}`);
      }
    }

    // room reference
    if (!d.room) {
      errors.push(`ERROR ${d.id ?? fileLabel}\n  Missing: room`);
    } else {
      const rs = d.room;
      const slug = typeof rs === 'string' ? rs : rs.id;
      if (!roomSlugs.includes(slug)) {
        errors.push(`ERROR ${d.id ?? fileLabel}\n  Unknown room: ${slug}`);
      }
    }

    // source
    if (!d.source?.url) {
      errors.push(`ERROR ${d.id ?? fileLabel}\n  Missing: source.url`);
    }
    if (!d.source?.platform) {
      errors.push(`ERROR ${d.id ?? fileLabel}\n  Missing: source.platform`);
    }

    // quote
    if (!d.quote) errors.push(`ERROR ${d.id ?? fileLabel}\n  Missing: quote`);

    // image existence if specified
    if (d.media?.image) {
      const imgPath = d.media.image.startsWith('/')
        ? path.join(PUBLIC_DIR, d.media.image)
        : path.resolve(d.media.image);
      if (!fs.existsSync(imgPath)) {
        errors.push(`ERROR ${d.id ?? fileLabel}\n  Missing image: ${d.media.image}`);
      }
    }
  }

  // uniqueness check across IDs already handled

  if (errors.length > 0) {
    for (const e of errors) console.error(e);
    console.error(`\n${errors.length} validation error(s). Build blocked.`);
    process.exit(1);
  }

  console.log(`✓ ${files.length} exhibit(s) validated`);
}

validate();
