
"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Timer } from 'lucide-react';

export function CountdownCTA({ expiryDate, joinLink }: { expiryDate: string; joinLink: string }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

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
    return () => clearInterval(timer);
  }, [expiryDate]);

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-primary to-primary/90 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-headline font-bold mb-6">Ready to Accelerate Your Career?</h2>
        <p className="text-primary-foreground/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
          Join hundreds of professionals mastering our methodology. Limited spots available for this cohort.
        </p>

        {timeLeft && (
          <div className="flex justify-center gap-4 mb-12">
            {[
              { label: 'Days', val: timeLeft.d },
              { label: 'Hours', val: timeLeft.h },
              { label: 'Min', val: timeLeft.m },
              { label: 'Sec', val: timeLeft.s },
            ].map((unit, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="bg-white/10 backdrop-blur-md w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold mb-2 border border-white/20">
                  {unit.val.toString().padStart(2, '0')}
                </div>
                <span className="text-xs uppercase tracking-widest font-medium opacity-70">{unit.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <Button 
            size="lg" 
            className="h-16 px-12 text-lg font-bold bg-accent hover:bg-accent/90 text-white rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
            asChild
          >
            <a href={joinLink || '#'}>JOIN THE PROGRAM NOW</a>
          </Button>
          <div className="flex items-center gap-2 text-sm opacity-80 mt-4">
            <Timer className="w-4 h-4" />
            <span>Secure enrollment ending soon</span>
          </div>
        </div>
      </div>
    </section>
  );
}
