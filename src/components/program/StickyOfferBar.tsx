'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function StickyOfferBar({ expiryDate, joinLink }: { expiryDate: string; joinLink: string }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; m: number; s: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const target = expiryDate ? new Date(expiryDate).getTime() : new Date().getTime() + 24 * 60 * 60 * 1000;
      const difference = target - new Date().getTime();
      
      if (difference <= 0) return null;

      return {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
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
    <div 
      className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:py-4 md:px-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500 ease-out bg-[#FF4B2B]"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left/Middle Content Group: Timer and Pricing */}
        <div className="flex items-center justify-between md:justify-start gap-4 md:gap-12 flex-1">
          
          {/* Countdown Timer */}
          <div className="flex items-center gap-2 md:gap-3">
            {[
              { label: 'days', val: timeLeft.d },
              { label: 'mint', val: timeLeft.m },
              { label: 'sec', val: timeLeft.s },
            ].map((unit, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div 
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg font-bold text-lg md:text-xl border border-white/40 text-white"
                >
                  {unit.val.toString().padStart(2, '0')}
                </div>
                <span className="text-[9px] md:text-[10px] font-medium text-white/90 mt-1 uppercase tracking-tighter">{unit.label}</span>
              </div>
            ))}
          </div>

          {/* Pricing Typography */}
          <div className="text-right md:text-left text-white">
            <p className="text-[10px] md:text-xs opacity-90 leading-tight">
              Join <span className="line-through opacity-70">₹1000 / month</span>
            </p>
            <div className="flex flex-col">
              <p className="text-xs md:text-base leading-tight">
                Now <span className="font-bold">Pay ₹589 today</span>
              </p>
              <p className="text-[9px] md:text-[11px] font-bold opacity-90">
                (₹499 + GST) Lifetime Access
              </p>
            </div>
          </div>
        </div>

        {/* Action Button: Now sits on the same line on desktop */}
        <Button 
          className="w-full md:w-auto md:min-w-[240px] rounded-full py-7 md:py-6 text-base md:text-lg font-black bg-white text-[#FF4B2B] hover:bg-white/95 transition-all shadow-lg active:scale-95 group uppercase tracking-tight"
          asChild
        >
          <a href={joinLink || '#'}>
            Become a Member
          </a>
        </Button>

      </div>
    </div>
  );
}
