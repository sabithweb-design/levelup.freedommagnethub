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
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-primary/95 backdrop-blur-2xl border-t-4 border-accent p-4 md:p-6 lg:p-8 shadow-[0_-20px_80px_-15px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-full duration-700 ease-out">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-100"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
        <div className="flex items-center gap-4 md:gap-8 text-white w-full md:w-auto justify-center md:justify-start">
          <div className="hidden sm:flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-accent shadow-[0_0_20px_rgba(255,0,0,0.4)] animate-pulse">
            <Timer className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <div className="flex flex-col gap-1 md:gap-2">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Sparkles className="w-3 h-3 md:w-4 h-4 text-accent" />
              <p className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] text-accent">Offer Ends In:</p>
            </div>
            <div className="flex gap-2 md:gap-4 lg:gap-6">
              {[
                { label: 'DAYS', val: timeLeft.d },
                { label: 'HRS', val: timeLeft.h },
                { label: 'MIN', val: timeLeft.m },
                { label: 'SEC', val: timeLeft.s },
              ].map((unit, idx) => (
                <div key={idx} className="flex flex-col items-center min-w-[45px] md:min-w-[65px] lg:min-w-[75px]">
                  <div className="bg-white/10 backdrop-blur-md rounded-lg md:rounded-xl p-1.5 md:p-3 w-full flex items-center justify-center border border-white/20 shadow-inner">
                    <span className="text-xl md:text-3xl lg:text-5xl font-black tabular-nums tracking-tighter leading-none text-white">
                      {unit.val.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[8px] md:text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mt-1 md:mt-2">{unit.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
          <div className="hidden lg:block text-right border-r border-white/20 pr-8">
            <p className="text-lg font-black text-white tracking-tight uppercase">Limited Cohort Access</p>
            <p className="text-[11px] font-bold text-accent uppercase tracking-[0.2em]">85% Discount Applied</p>
          </div>
          <Button 
            size="lg" 
            className="w-full md:w-auto bg-accent hover:bg-accent/90 text-white font-black rounded-full px-6 md:px-10 lg:px-12 py-3 md:py-6 lg:py-8 h-auto text-base md:text-xl lg:text-2xl shadow-[0_0_40px_rgba(255,0,0,0.5)] group uppercase tracking-tighter transition-all hover:scale-105 active:scale-95"
            asChild
          >
            <a href={joinLink || '#'}>
              SECURE SPOT NOW <ArrowRight className="ml-2 md:ml-3 w-4 h-4 md:w-7 md:h-7 lg:w-8 lg:h-8 group-hover:translate-x-2 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
