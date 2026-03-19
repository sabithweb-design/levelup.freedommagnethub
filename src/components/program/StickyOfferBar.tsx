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
      className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:py-6 md:px-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500 ease-out bg-[#FF4B2B]"
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Top Section: Timer and Pricing */}
        <div className="flex items-center justify-between gap-4">
          
          {/* Countdown Timer */}
          <div className="flex items-center gap-2 md:gap-4">
            {[
              { label: 'days', val: timeLeft.d },
              { label: 'mint', val: timeLeft.m },
              { label: 'sec', val: timeLeft.s },
            ].map((unit, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div 
                  className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-xl font-bold text-lg md:text-2xl border border-white/40 text-white"
                >
                  {unit.val.toString().padStart(2, '0')}
                </div>
                <span className="text-[10px] md:text-xs font-medium text-white/90 mt-1">{unit.label}</span>
              </div>
            ))}
          </div>

          {/* Pricing Typography */}
          <div className="text-right text-white">
            <p className="text-xs md:text-sm opacity-90">
              Join <span className="line-through">₹1000 / month</span>
            </p>
            <div className="flex flex-col">
              <p className="text-sm md:text-lg">
                Now <span className="font-bold">Pay ₹589 today</span>
              </p>
              <p className="text-[10px] md:text-xs font-bold">
                (₹499 + GST) Lifetime Access
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: CTA Button */}
        <Button 
          className="w-full rounded-full py-8 text-lg md:text-xl font-black bg-white text-[#FF4B2B] hover:bg-white/95 transition-all shadow-lg active:scale-95 group"
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
