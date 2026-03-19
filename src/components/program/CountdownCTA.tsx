"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Timer, ArrowRight, ShieldCheck } from 'lucide-react';

export function CountdownCTA({ expiryDate, joinLink }: { expiryDate: string; joinLink: string }) {
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    // Use the same personalized 24h timer as the Sticky Bar for consistency
    const STORAGE_KEY = 'fmh_sticky_offer_expiry';
    let targetTime: number;

    const storedExpiry = localStorage.getItem(STORAGE_KEY);
    
    if (storedExpiry) {
      targetTime = parseInt(storedExpiry, 10);
    } else {
      targetTime = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, targetTime.toString());
    }

    const calculate = () => {
      const difference = targetTime - Date.now();
      if (difference <= 0) return null;

      return {
        h: Math.floor(difference / (1000 * 60 * 60)),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => setTimeLeft(calculate()), 1000);
    setTimeLeft(calculate());
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-48 px-6 relative overflow-hidden border-t border-white/5">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2 -z-10"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 mb-10 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span className="text-xs font-black uppercase tracking-[0.3em] text-white">Final Call for Enrolment</span>
        </div>
        
        <h2 className="text-4xl md:text-7xl font-headline font-black mb-8 tracking-tighter leading-none text-white uppercase">Achieve Professional Mastery</h2>
        <p className="text-foreground/80 text-xl md:text-2xl mb-16 max-w-2xl mx-auto font-medium">
          Secure your position in the upcoming cohort and begin your journey toward strategic autonomy.
        </p>

        {timeLeft && (
          <div className="flex justify-center gap-6 mb-16">
            {[
              { label: 'Hours', val: timeLeft.h },
              { label: 'Min', val: timeLeft.m },
              { label: 'Sec', val: timeLeft.s },
            ].map((unit, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="glass-card w-24 h-24 md:w-32 md:h-32 rounded-[2rem] flex items-center justify-center text-4xl md:text-6xl font-black mb-3 border border-white/10 text-white">
                  {unit.val.toString().padStart(2, '0')}
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">{unit.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col items-center gap-6">
          <Button 
            size="lg" 
            className="h-16 px-10 text-lg font-black fiery-gradient fiery-glow hover:brightness-110 text-white rounded-full transition-all hover:scale-105 active:scale-95 group uppercase tracking-tight"
            asChild
          >
            <a href={joinLink || '#'}>
              GRAB YOUR SEAT <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </a>
          </Button>
          <div className="flex items-center gap-3 text-sm text-white/40 mt-4 font-bold uppercase tracking-widest">
            <Timer className="w-5 h-5 text-accent" />
            <span>Registration window closing</span>
          </div>
        </div>
      </div>
    </section>
  );
}
