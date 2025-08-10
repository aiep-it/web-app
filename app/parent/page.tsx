'use client';
import { Users } from 'lucide-react';

export default function ParentHome() {
  return (
    <div className="relative isolate overflow-hidden bg-white px-6 py-10 shadow-xl ring-1 ring-gray-200 rounded-xl max-w-xl mx-auto mt-12 text-center">
      <div className="absolute top-[-10rem] left-[-10rem] z-0 h-80 w-80 bg-pink-100 rounded-full blur-[100px]" />
      <div className="relative z-10">
        <Users className="mx-auto h-12 w-12 text-pink-600" />
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">Welcome, Parent</h2>
        <p className="mt-2 text-gray-600">View your child’s learning journey and stay connected.</p>
      </div>
    </div>
  );
}
