"use client"

import { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

export function CountdownCTA({ expiryDate }: { expiryDate: string; joinLink: string }) {
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number } | null>(null);

  useEffect(() => {
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

  if (!timeLeft) return null;

  return (
    <section id="join" className="py-24 md:py-32 px-6 relative overflow-hidden border-t border-white/5 scroll-mt-20">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2 -z-10"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 mb-12 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span className="text-xs font-black uppercase tracking-[0.3em] text-white">Enrollment Opportunity Closing</span>
        </div>

        <div className="flex justify-center gap-4 md:gap-8">
          {[
            { label: 'Hours', val: timeLeft.h },
            { label: 'Min', val: timeLeft.m },
            { label: 'Sec', val: timeLeft.s },
          ].map((unit, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="glass-card w-24 h-24 md:w-40 md:h-40 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-4xl md:text-7xl font-black mb-4 border border-white/10 text-white shadow-2xl">
                {unit.val.toString().padStart(2, '0')}
              </div>
              <span className="text-[11px] uppercase tracking-[0.4em] font-black text-white/30">{unit.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
