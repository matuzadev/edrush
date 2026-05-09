import { redirect } from 'next/navigation';
import subjects from '@/data/subjects.json';

export default async function LegacyChapter({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // try to find subject that contains chapter id
  for (const slug of Object.keys(subjects)) {
    const subj = (subjects as any)[slug];
    if (subj.chapters.some((c: any) => String(c.id) === String(id))) {
      redirect(`/dashboard/chapter/${slug}/${id}`);
    }
  }
  // fallback
  redirect('/dashboard');
}
