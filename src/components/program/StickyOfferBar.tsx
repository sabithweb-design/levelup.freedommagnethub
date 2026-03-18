'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Timer, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StickyOfferBar({ expiryDate, joinLink }: { expiryDate: string; joinLink: string }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const difference = new Date(expiryDate).getTime() - new Date().getTime();
      if (difference <= 0) return null;

      return {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => setTimeLeft(calculate()), 1000);
    setTimeLeft(calculate());

    const handleScroll = () => {
      // Show the bar after scrolling down 600px
      setIsVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [expiryDate]);

  if (!timeLeft || !isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-primary/95 backdrop-blur-md border-t border-white/10 p-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-full duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-white">
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-accent/20 text-accent">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-0.5">Enrollment Closing In:</p>
            <div className="flex gap-4">
              {[
                { label: 'd', val: timeLeft.d },
                { label: 'h', val: timeLeft.h },
                { label: 'm', val: timeLeft.m },
                { label: 's', val: timeLeft.s },
              ].map((unit, idx) => (
                <div key={idx} className="flex items-baseline gap-1">
                  <span className="text-xl font-black tabular-nums">{unit.val.toString().padStart(2, '0')}</span>
                  <span className="text-[9px] font-bold text-white/30 uppercase">{unit.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="hidden lg:block text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-accent">Limited Cohort Access</p>
            <p className="text-[9px] font-bold text-white/40">Secure Your Placement Today</p>
          </div>
          <Button size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-white font-black rounded-full px-10 py-6 h-auto text-base shadow-lg shadow-accent/20 group uppercase tracking-tight" asChild>
            <a href={joinLink || '#'}>
              Enroll Now <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
