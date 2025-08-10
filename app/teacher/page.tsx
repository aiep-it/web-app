'use client';
import { BookOpen } from 'lucide-react';

export default function TeacherHome() {
  return (
    <div className="relative isolate overflow-hidden bg-white px-6 py-10 shadow-xl ring-1 ring-gray-200 rounded-xl max-w-xl mx-auto mt-12 text-center">
      <div className="absolute bottom-[-10rem] right-[-10rem] z-0 h-80 w-80 bg-green-100 rounded-full blur-[100px]" />
      <div className="relative z-10">
        <BookOpen className="mx-auto h-12 w-12 text-green-600" />
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">Welcome, Teacher</h2>
        <p className="mt-2 text-gray-600">Manage your classes, students, and teaching schedules.</p>
      </div>
    </div>
  );
}
