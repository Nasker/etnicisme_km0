const DRAFT_KEY = 'etnicisme-km0:contribute:draft';

const form = document.getElementById('contribute-form') as HTMLFormElement | null;
if (!form) throw new Error('Contribute form not found');

const rooms: { id: string; title: string }[] = JSON.parse(form.dataset.rooms || '[]');
const people: { id: string; name: string }[] = JSON.parse(form.dataset.people || '[]');
const existingIds: string[] = JSON.parse(form.dataset.existingIds || '[]');

const personSelect = document.getElementById('person') as HTMLSelectElement;
const newPersonFields = document.getElementById('new-person-fields') as HTMLElement;
const newPersonName = document.getElementById('new_person_name') as HTMLInputElement;
const newPersonSlug = document.getElementById('new_person_slug') as HTMLInputElement;

const idInput = document.getElementById('id') as HTMLInputElement;
const dateInput = document.getElementById('date') as HTMLInputElement;
const suggestIdBtn = document.getElementById('suggest-id') as HTMLButtonElement;

const output = document.getElementById('output') as HTMLElement;
const outputExhibit = document.getElementById('output-exhibit') as HTMLElement;
const outputPerson = document.getElementById('output-person') as HTMLElement;
const outputPersonMd = document.getElementById('output-person-md') as HTMLElement;

const copyExhibitBtn = document.getElementById('copy-exhibit') as HTMLButtonElement;
const downloadExhibitBtn = document.getElementById('download-exhibit') as HTMLButtonElement;
const copyPersonBtn = document.getElementById('copy-person') as HTMLButtonElement;
const resetBtn = document.getElementById('reset-form') as HTMLButtonElement;

let currentExhibitMd = '';
let currentPersonMd = '';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function yamlValue(value: string): string {
  if (!value) return '""';
  if (value.includes('\n')) {
    const lines = value.split('\n');
    return '|-\n' + lines.map((l) => '  ' + l).join('\n');
  }
  const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return '"' + escaped + '"';
}

function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

function suggestNextId(dateValue: string): string {
  const year = dateValue.split('-')[0];
  const prefix = 'EX-' + year + '-';
  const sameYear = existingIds
    .filter((id) => id.toLowerCase().startsWith(prefix.toLowerCase()))
    .sort();
  let n = 1;
  if (sameYear.length) {
    const last = sameYear[sameYear.length - 1];
    const match = last.match(/EX-\d{4}-(\d{3})/i);
    if (match) n = parseInt(match[1], 10) + 1;
  }
  return 'EX-' + year + '-' + String(n).padStart(3, '0');
}

function saveDraft(): void {
  const data: Record<string, unknown> = {};
  for (const el of Array.from(form!.elements)) {
    if (
      el instanceof HTMLInputElement ||
      el instanceof HTMLSelectElement ||
      el instanceof HTMLTextAreaElement
    ) {
      if (el.type === 'checkbox') data[el.name] = (el as HTMLInputElement).checked;
      else data[el.name] = el.value;
    }
  }
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
}

function loadDraft(): void {
  const saved = localStorage.getItem(DRAFT_KEY);
  if (!saved) return;
  try {
    const data = JSON.parse(saved) as Record<string, unknown>;
    for (const [name, value] of Object.entries(data)) {
      const el = form!.elements.namedItem(name);
      if (!el) continue;
      if (el instanceof HTMLInputElement && el.type === 'checkbox') {
        el.checked = Boolean(value);
      } else if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLSelectElement ||
        el instanceof HTMLTextAreaElement
      ) {
        el.value = value == null ? '' : String(value);
      }
    }
    if (newPersonName.value && newPersonSlug.value) {
      newPersonSlug.dataset.manual = 'true';
    }
  } catch {
    // ignore malformed draft
  }
}

function toggleNewPerson(): void {
  if (personSelect.value === '__new__') {
    newPersonFields.classList.remove('is-hidden');
    newPersonName.required = true;
    newPersonSlug.required = true;
  } else {
    newPersonFields.classList.add('is-hidden');
    newPersonName.required = false;
    newPersonSlug.required = false;
  }
}

function getField(name: string): string {
  const el = form!.elements.namedItem(name) as HTMLInputElement | null;
  return el ? el.value.trim() : '';
}

function validate(): string[] {
  const errors: string[] = [];
  if (!getField('id')) errors.push('Falta l\'identificador.');
  if (!getField('title')) errors.push('Falta el títol.');
  if (!getField('date')) errors.push('Falta la data.');
  if (!getField('person')) errors.push('Falta la persona.');
  if (getField('person') === '__new__') {
    if (!getField('new_person_name')) errors.push('Falta el nom de la nova persona.');
    if (!getField('new_person_slug')) errors.push('Falta el slug de la nova persona.');
  }
  if (!getField('room')) errors.push('Falta la sala.');
  if (!getField('quote')) errors.push('Falta la cita.');
  if (!getField('source_platform')) errors.push('Falta la plataforma de la font.');
  if (!getField('source_url')) errors.push('Falta l\'URL de la publicació.');
  if (existingIds.includes(getField('id'))) {
    errors.push('Aquest identificador ja existeix.');
  }
  return errors;
}

function buildExhibitMarkdown(): string {
  const id = getField('id');
  const title = getField('title');
  const date = getField('date') || todayString();
  const room = getField('room');
  const quote = getField('quote');
  const platform = getField('source_platform');
  const url = getField('source_url');
  const archiveUrl = getField('source_archive_url');
  const topics = getField('topics')
    .split(/[,;\n]+/)
    .map((t) => t.trim())
    .filter(Boolean);
  const contextPublication = getField('context_publication');
  const contextTitle = getField('context_title');
  const contextUrl = getField('context_url');
  const mediaImage = getField('media_image');
  const mediaAlt = getField('media_alt');
  const context = getField('context');
  const whatWeKnow = getField('what_we_know');
  const reading = getField('reading');

  let personName: string;
  let personSlug: string;

  if (personSelect.value === '__new__') {
    personName = getField('new_person_name');
    personSlug = getField('new_person_slug');
  } else {
    const found = people.find((p) => p.id === personSelect.value);
    if (!found) throw new Error('Persona desconeguda');
    personName = found.name;
    personSlug = found.id;
  }

  let md = '---\n';
  md += 'id: ' + yamlValue(id) + '\n';
  md += 'title: ' + yamlValue(title) + '\n';
  md += 'date: ' + yamlValue(date) + '\n';
  md += 'person:\n';
  md += '  name: ' + yamlValue(personName) + '\n';
  md += '  slug: ' + yamlValue(personSlug) + '\n';
  md += 'room: ' + yamlValue(room) + '\n';

  if (topics.length) {
    md += 'topics:\n';
    for (const t of topics) md += '  - ' + yamlValue(t) + '\n';
  }

  md += 'source:\n';
  md += '  platform: ' + yamlValue(platform) + '\n';
  md += '  url: ' + yamlValue(url) + '\n';
  if (archiveUrl) md += '  archive_url: ' + yamlValue(archiveUrl) + '\n';

  if (contextPublication && contextTitle) {
    md += 'contextual_sources:\n';
    md += '  - publication: ' + yamlValue(contextPublication) + '\n';
    md += '    title: ' + yamlValue(contextTitle) + '\n';
    if (contextUrl) md += '    url: ' + yamlValue(contextUrl) + '\n';
  }

  if (mediaImage || mediaAlt) {
    md += 'media:\n';
    if (mediaImage) md += '  image: ' + yamlValue(mediaImage) + '\n';
    if (mediaAlt) md += '  alt: ' + yamlValue(mediaAlt) + '\n';
  }

  md += 'quote: ' + yamlValue(quote) + '\n';
  md += 'verification:\n';
  md += '  status: "unverified"\n';
  md += '  checked: ' + yamlValue(todayString()) + '\n';
  md += 'fictional: true\n';
  md += 'featured: false\n';
  md += '---\n\n';

  md += '## Context\n\n' + (context || '') + '\n\n';
  md += '## El que sabem\n\n' + (whatWeKnow || '') + '\n\n';
  md += '## Lectura\n\n' + (reading || '') + '\n';

  return md;
}

function buildPersonMarkdown(): string {
  if (personSelect.value !== '__new__') return '';
  const name = getField('new_person_name');
  const slug = getField('new_person_slug');
  if (!name || !slug) return '';

  let md = '---\n';
  md += 'name: ' + yamlValue(name) + '\n';
  md += 'fictional: false\n';
  md += '---\n\n';
  md += 'Persona proposada des del formulari d\'afegir peça.\n';
  return md;
}

function download(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function copyToClipboard(text: string): void {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => alert('Copiat al porta-retalls.'));
  } else {
    alert('El navegador no permet copiar automàticament.');
  }
}

newPersonName.addEventListener('input', () => {
  if (!newPersonSlug.dataset.manual) {
    newPersonSlug.value = slugify(newPersonName.value);
  }
});

newPersonSlug.addEventListener('input', () => {
  newPersonSlug.dataset.manual = 'true';
});

personSelect.addEventListener('change', () => {
  toggleNewPerson();
  saveDraft();
});

suggestIdBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (dateInput.value) {
    idInput.value = suggestNextId(dateInput.value);
    saveDraft();
  }
});

dateInput.addEventListener('change', () => {
  if (!idInput.value && dateInput.value) {
    idInput.value = suggestNextId(dateInput.value);
  }
  saveDraft();
});

form.addEventListener('input', () => {
  saveDraft();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const errors = validate();
  if (errors.length) {
    alert('Hi ha errors:\n\n' + errors.join('\n'));
    return;
  }

  currentExhibitMd = buildExhibitMarkdown();
  currentPersonMd = buildPersonMarkdown();

  outputExhibit.textContent = currentExhibitMd;
  output.classList.remove('is-hidden');

  if (currentPersonMd) {
    outputPersonMd.textContent = currentPersonMd;
    outputPerson.classList.remove('is-hidden');
  } else {
    outputPerson.classList.add('is-hidden');
  }
});

copyExhibitBtn.addEventListener('click', () => copyToClipboard(currentExhibitMd));
downloadExhibitBtn.addEventListener('click', () => download((getField('id') || 'exhibit') + '.md', currentExhibitMd));
copyPersonBtn.addEventListener('click', () => copyToClipboard(currentPersonMd));

resetBtn.addEventListener('click', () => {
  form.reset();
  localStorage.removeItem(DRAFT_KEY);
  output.classList.add('is-hidden');
  outputPerson.classList.add('is-hidden');
  newPersonSlug.dataset.manual = '';
  toggleNewPerson();
});

loadDraft();
toggleNewPerson();
