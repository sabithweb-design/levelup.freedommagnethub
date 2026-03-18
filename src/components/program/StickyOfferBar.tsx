'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Timer, ArrowRight, Sparkles } from 'lucide-react';
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
      // Show the bar after scrolling down 400px for better visibility
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
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-primary/98 backdrop-blur-2xl border-t-2 border-accent/30 p-6 md:p-8 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom-full duration-700 ease-out">
      {/* Decorative Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
        <div className="flex items-center gap-6 text-white w-full md:w-auto justify-center md:justify-start">
          <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-accent shadow-lg shadow-accent/20 animate-pulse">
            <Timer className="w-7 h-7 text-white" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-accent" />
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-accent">Limited Time Opportunity</p>
            </div>
            <div className="flex gap-6">
              {[
                { label: 'DAYS', val: timeLeft.d },
                { label: 'HRS', val: timeLeft.h },
                { label: 'MIN', val: timeLeft.m },
                { label: 'SEC', val: timeLeft.s },
              ].map((unit, idx) => (
                <div key={idx} className="flex flex-col items-center md:items-start min-w-[40px]">
                  <span className="text-3xl md:text-4xl font-black tabular-nums tracking-tighter leading-none">{unit.val.toString().padStart(2, '0')}</span>
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">{unit.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="hidden lg:block text-right border-r border-white/10 pr-6">
            <p className="text-sm font-bold text-white tracking-tight">Claim Your 85% Discount</p>
            <p className="text-[10px] font-medium text-white/50 uppercase tracking-widest">Next Cohort Starts Soon</p>
          </div>
          <Button 
            size="lg" 
            className="w-full md:w-auto bg-accent hover:bg-accent/90 text-white font-black rounded-full px-12 py-8 h-auto text-xl shadow-2xl shadow-accent/40 group uppercase tracking-tight transition-all hover:scale-105 active:scale-95"
            asChild
          >
            <a href={joinLink || '#'}>
              SECURE YOUR SPOT <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
