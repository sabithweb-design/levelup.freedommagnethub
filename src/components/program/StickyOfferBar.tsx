'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Timer, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StickyOfferBar({ expiryDate, joinLink }: { expiryDate: string; joinLink: string }) {
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const difference = new Date(expiryDate).getTime() - new Date().getTime();
      if (difference <= 0) return null;

      return {
        h: Math.floor(difference / (1000 * 60 * 60)),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => setTimeLeft(calculate()), 1000);
    setTimeLeft(calculate());

    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [expiryDate]);

  if (!timeLeft || !isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-background/60 backdrop-blur-[24px] border-t border-white/10 p-6 md:p-8 shadow-[0_-20px_80px_-15px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-full duration-700 ease-out">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        <div className="flex items-center gap-6 md:gap-10 text-white w-full md:w-auto justify-center md:justify-start">
          <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-3xl fiery-gradient fiery-glow">
            <Timer className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Sparkles className="w-4 h-4 text-accent" />
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-accent">Enrollment Closing:</p>
            </div>
            <div className="flex gap-4 md:gap-6 lg:gap-8">
              {[
                { label: 'HRS', val: timeLeft.h },
                { label: 'MIN', val: timeLeft.m },
                { label: 'SEC', val: timeLeft.s },
              ].map((unit, idx) => (
                <div key={idx} className="flex flex-col items-center min-w-[50px] md:min-w-[70px]">
                  <div className="bg-white/5 backdrop-blur-md rounded-xl md:rounded-2xl p-2 md:p-3 w-full flex items-center justify-center border border-white/10">
                    <span className="text-2xl md:text-4xl lg:text-5xl font-black tabular-nums tracking-tighter leading-none text-white">
                      {unit.val.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-2">{unit.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 md:gap-10 w-full md:w-auto">
          <div className="hidden lg:block text-right border-r border-white/10 pr-10">
            <p className="text-lg font-black text-white tracking-tight uppercase">Limited Cohort Access</p>
            <p className="text-[11px] font-bold text-accent uppercase tracking-[0.2em]">Immediate Grant Applied</p>
          </div>
          <Button 
            size="lg" 
            className="w-full md:w-auto fiery-gradient fiery-glow text-white font-black rounded-full px-12 py-6 h-auto text-lg group uppercase tracking-tighter transition-all hover:scale-105 active:scale-95"
            asChild
          >
            <a href={joinLink || '#'}>
              GRAB YOUR SEAT <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
