'use client';

import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ProgramForm } from '@/components/admin/ProgramForm';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <FirebaseClientProvider>
      <div className="min-h-screen bg-muted/30 pb-20">
        <nav className="bg-white border-b px-6 py-4 mb-8 sticky top-0 z-50 shadow-sm">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <h1 className="font-headline font-bold text-xl uppercase tracking-tight">
                Admin Panel <span className="text-muted-foreground font-normal">| Freedom Magnet Hub</span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="default" size="sm" asChild className="hidden sm:flex gap-2 bg-accent hover:bg-accent/90 text-white font-bold">
                <Link href="/" target="_blank">
                  <ExternalLink className="w-4 h-4" />
                  View Public Site
                </Link>
              </Button>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest hidden lg:block ml-4">
                Content Management
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-headline font-black text-primary uppercase">Edit Program Content</h2>
            <div className="flex gap-2 sm:hidden">
              <Button variant="default" size="icon" className="bg-accent" asChild>
                <Link href="/" target="_blank">
                  <ExternalLink className="w-4 h-4 text-white" />
                </Link>
              </Button>
            </div>
          </div>
          <ProgramForm programId="nextjs-mastery" />
        </main>
      </div>
    </FirebaseClientProvider>
  );
}
