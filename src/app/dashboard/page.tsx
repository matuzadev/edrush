'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { UnifiedNavbar } from '@/components/UnifiedNavbar';
import { CheckCircle, Lock, PlayCircle, Star } from 'lucide-react';
import subjectsData from '@/data/subjects.json';

interface CourseChapter {
 id: string | number;
 title: string;
 completed: boolean;
}

interface Course {
 title: string;
 chapters: CourseChapter[];
}

const COURSES = Object.keys(subjectsData).reduce<Record<string, Course>>((acc, slug) => {
 const subject = subjectsData as Record<string, { title: string; chapters: { id: string | number; title: string }[] }>;
 acc[slug] = {
 title: subject[slug].title,
 chapters: subject[slug].chapters.map((c) => ({ id: c.id, title: c.title, completed: false }))
 };
 return acc;
}, {});

export default function DashboardPage() {
 const router = useRouter();
 const { data: session } = useSession();
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 if (!session) {
 router.push('/auth/login');
 } else {
 setLoading(false);
 }
 }, [session, router]);

 if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#020617]"><div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>;

 return (
 <div className="min-h-screen bg-[#020617]">
 <UnifiedNavbar />
 <main className="max-w-7xl mx-auto px-4 py-8">
 <h1 className="text-3xl font-bold text-gradient mb-8">Dashboard</h1>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {Object.entries(COURSES).map(([slug, course]) => (
 <div key={slug} className="glass-card p-6 rounded-xl hover-lift">
 <h2 className="text-xl font-bold text-white mb-4">{course.title}</h2>
 <div className="space-y-2">
 {course.chapters.slice(0, 3).map((chapter) => (
 <div key={chapter.id} className="flex items-center gap-2 text-sm text-slate-400">
 {chapter.completed ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4 text-slate-600" />}
 <span>{chapter.title}</span>
 </div>
 ))}
 </div>
 <Link href={`/dashboard/${slug}`} className="mt-4 inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">Ver todos <PlayCircle className="w-4 h-4" /></Link>
 </div>
 ))}
 </div>
 </main>
 </div>
 );
}