'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { LayoutDashboard, FileText, Image as ImageIcon, MessageSquare, Settings, ArrowUpRight, Plus, ExternalLink, Edit3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const db = useFirestore();
  const programsQuery = useMemoFirebase(() => collection(db, 'programs'), [db]);
  const { data: programs, isLoading } = useCollection(programsQuery);

  const stats = [
    { 
      label: 'Total Programs', 
      value: programs?.length || 0, 
      icon: FileText, 
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      label: 'Gallery Assets', 
      value: programs?.reduce((acc, p) => acc + (p.gallery?.length || 0), 0) || 0, 
      icon: ImageIcon, 
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    { 
      label: 'Student Feedback', 
      value: programs?.reduce((acc, p) => acc + (p.imageTestimonials?.length || 0) + (p.videoTestimonials?.length || 0), 0) || 0, 
      icon: MessageSquare, 
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    }
  ];

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-primary text-white p-6 flex flex-col gap-8">
        <div className="flex flex-col">
          <span className="font-headline font-black text-2xl tracking-tighter leading-none uppercase">
            Freedom
          </span>
          <span className="font-headline font-black text-2xl tracking-tighter text-white/60 leading-none uppercase">
            Magnet Hub
          </span>
        </div>

        <nav className="flex flex-col gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 bg-white/10 p-3 rounded-lg font-bold text-sm transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            DASHBOARD
          </Link>
          <Link href="/admin" className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-lg font-bold text-sm transition-colors text-white/80 hover:text-white">
            <Edit3 className="w-4 h-4" />
            CONTENT EDITOR
          </Link>
          <Link href="/" className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-lg font-bold text-sm transition-colors text-white/80 hover:text-white">
            <ExternalLink className="w-4 h-4" />
            VIEW SITE
          </Link>
          <div className="mt-8 pt-8 border-t border-white/10">
            <Link href="#" className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-lg font-bold text-sm transition-colors text-white/40">
              <Settings className="w-4 h-4" />
              SETTINGS
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-black text-primary uppercase tracking-tight">Management Console</h1>
            <p className="text-muted-foreground">Overview of your LMS ecosystem and performance.</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-white font-bold rounded-full px-6">
            <Plus className="w-4 h-4 mr-2" />
            CREATE PROGRAM
          </Button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <Card key={idx} className="border-none shadow-sm overflow-hidden">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-foreground">{isLoading ? '...' : stat.value}</p>
                </div>
                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Programs List */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline font-black text-xl uppercase">Active Programs</CardTitle>
            <CardDescription>Direct links to manage your live landing pages.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="py-10 text-center text-muted-foreground">Loading programs...</div>
              ) : programs && programs.length > 0 ? (
                programs.map((program) => (
                  <div key={program.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">{program.title}</h4>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{program.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none font-bold">
                        <Link href={`/program/${program.id}`} target="_blank">
                          Preview <ArrowUpRight className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                      <Button size="sm" asChild className="flex-1 sm:flex-none font-bold bg-primary">
                        <Link href="/admin">
                          <Edit3 className="w-3 h-3 mr-2" />
                          Edit Content
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center bg-muted/20 rounded-2xl border-2 border-dashed border-border/50">
                  <p className="text-muted-foreground font-medium mb-4">No programs found in your database.</p>
                  <Button asChild variant="outline">
                    <Link href="/admin">Initialize First Program</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-primary text-white border-none">
            <CardHeader>
              <Badge className="w-fit mb-2 bg-accent text-white border-none font-bold">PRO TIP</Badge>
              <CardTitle className="font-headline font-black uppercase">Optimize Your Gallery</CardTitle>
              <CardDescription className="text-white/60">High-resolution images lead to 40% higher conversion rates for professional programs.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-2 border-accent/20 bg-accent/5">
            <CardHeader>
              <CardTitle className="font-headline font-black text-accent uppercase">Global Reach</CardTitle>
              <CardDescription className="text-accent/60">Your landing pages are optimized for global performance using Freedom Magnet Hub's CDN backbone.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
