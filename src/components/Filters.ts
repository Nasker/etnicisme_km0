/*
  Client-side filtering for the museum index.
  Reads ?room= / ?person= / ?topic= from the URL, filters the exhibit
  cards (which carry data-room / data-person / data-topics attributes)
  and keeps chips + URL in sync. No framework, no backend.
*/

type FilterKey = 'room' | 'person' | 'topic';

const KEYS: FilterKey[] = ['room', 'person', 'topic'];

function readParams(): Record<FilterKey, string | null> {
  const p = new URLSearchParams(window.location.search);
  return {
    room: p.get('room'),
    person: p.get('person'),
    topic: p.get('topic'),
  };
}

function matches(card: HTMLElement, active: Record<FilterKey, string | null>): boolean {
  if (active.room && card.dataset.room !== active.room) return false;
  if (active.person && card.dataset.person !== active.person) return false;
  if (active.topic) {
    const topics = (card.dataset.topics ?? '').split(/\s+/).filter(Boolean);
    if (!topics.includes(active.topic)) return false;
  }
  return true;
}

function apply(): void {
  const active = readParams();
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>('[data-exhibit]')
  );

  let visible = 0;
  for (const card of cards) {
    const ok = matches(card, active);
    card.classList.toggle('is-hidden', !ok);
    if (ok) visible += 1;
  }

  // Chip active states
  document.querySelectorAll<HTMLAnchorElement>('[data-filter]').forEach((chip) => {
    const key = chip.dataset.filter as FilterKey;
    const value = chip.dataset.value ?? '';
    const isActive = value === '' ? !active[key] : active[key] === value;
    chip.classList.toggle('is-active', isActive);
    chip.setAttribute('aria-pressed', String(isActive));
  });

  const empty = document.querySelector<HTMLElement>('[data-empty]');
  if (empty) empty.classList.toggle('is-hidden', visible !== 0);

  const count = document.querySelector<HTMLElement>('[data-count]');
  if (count) count.textContent = String(visible);
}

function navigate(key: FilterKey, value: string): void {
  const p = new URLSearchParams(window.location.search);
  if (value === '') {
    p.delete(key);
  } else if (p.get(key) === value) {
    // toggle off
    p.delete(key);
  } else {
    p.set(key, value);
  }
  const qs = p.toString();
  const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
  window.history.replaceState({}, '', url);
  apply();
}

function init(): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-filter]').forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const key = chip.dataset.filter as FilterKey;
      const value = chip.dataset.value ?? '';
      if (KEYS.includes(key)) navigate(key, value);
    });
  });
  apply();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
