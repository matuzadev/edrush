type SubjectRecord = {
  name: string;
  chapters: number[];
};

const STORAGE_KEY = 'foco_subjects_v1';

function readStore(): SubjectRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SubjectRecord[];
  } catch (e) {
    console.error('Failed to read subjects store', e);
    return [];
  }
}

function writeStore(subjects: SubjectRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
  } catch (e) {
    console.error('Failed to write subjects store', e);
  }
}

export function getSubjects(): string[] {
  return readStore().map(s => s.name);
}

export function getSubjectRecords(): SubjectRecord[] {
  return readStore();
}

export function addSubject(name: string) {
  const items = readStore();
  if (items.find(s => s.name === name)) return;
  items.push({ name, chapters: [] });
  writeStore(items);
}

export function removeSubject(name: string) {
  let items = readStore();
  items = items.filter(s => s.name !== name);
  writeStore(items);
}

export function getChapters(subject: string): number[] {
  const items = readStore();
  const s = items.find(x => x.name === subject);
  return s ? s.chapters.slice().sort((a,b)=>a-b) : [];
}

export function addChapter(subject: string, chapter: number) {
  if (!chapter || chapter < 1) return;
  const items = readStore();
  let s = items.find(x => x.name === subject);
  if (!s) {
    s = { name: subject, chapters: [chapter] };
    items.push(s);
  } else if (!s.chapters.includes(chapter)) {
    s.chapters.push(chapter);
  }
  writeStore(items);
}

export function removeChapter(subject: string, chapter: number) {
  const items = readStore();
  const s = items.find(x => x.name === subject);
  if (!s) return;
  s.chapters = s.chapters.filter(c => c !== chapter);
  writeStore(items);
}

export function ensureDefaults(defaults: string[]) {
  const items = readStore();
  const names = items.map(i => i.name);
  let changed = false;
  defaults.forEach(d => {
    if (!names.includes(d)) {
      items.push({ name: d, chapters: [] });
      changed = true;
    }
  });
  if (changed) writeStore(items);
}
