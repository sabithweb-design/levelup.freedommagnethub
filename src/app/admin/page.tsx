'use client';

import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ProgramForm } from '@/components/admin/ProgramForm';
import { ShieldCheck } from 'lucide-react';

export default function AdminPage() {
  return (
    <FirebaseClientProvider>
      <div className="min-h-screen bg-muted/30 pb-20">
        <nav className="bg-white border-b px-6 py-4 mb-8">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <h1 className="font-headline font-bold text-xl uppercase tracking-tight">
                Admin Panel <span className="text-muted-foreground font-normal">| Freedom Magnet Hub</span>
              </h1>
            </div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              LMS Content Management
            </div>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-6">
          <ProgramForm programId="nextjs-mastery" />
        </main>
      </div>
    </FirebaseClientProvider>
  );
}
