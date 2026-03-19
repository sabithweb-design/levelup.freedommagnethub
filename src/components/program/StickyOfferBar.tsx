'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Timer, ArrowRight } from 'lucide-react';

export function StickyOfferBar({ expiryDate, joinLink }: { expiryDate: string; joinLink: string }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; m: number; s: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Timer calculation logic
    const calculate = () => {
      // For testing purposes, if no date is provided or it's invalid, we use a 24h default
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

    // Visibility logic (show after scroll)
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
      className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:py-4 md:px-6 shadow-2xl animate-in slide-in-from-bottom-full duration-700 ease-out"
      style={{
        backgroundColor: 'rgba(10, 11, 26, 0.85)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Glowing Top Border */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px]" 
        style={{ background: 'linear-gradient(to right, #FF6B6B, #FF8E53)' }}
      />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Pricing Typography */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <p className="text-[#94A3B8] text-sm">
            Join <span className="line-through">₹1000/month</span>
          </p>
          <div className="flex flex-col">
            <p className="text-white text-sm">
              Now Pay <span className="text-white font-bold text-xl">₹589 today</span>
            </p>
            <p className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider">
              (+ GST) Lifetime Access
            </p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-4">
          {[
            { label: 'days', val: timeLeft.d },
            { label: 'mins', val: timeLeft.m },
            { label: 'secs', val: timeLeft.s },
          ].map((unit, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div 
                className="w-12 h-12 flex items-center justify-center rounded-lg font-black text-xl"
                style={{
                  border: '1px solid #FF6B6B',
                  color: '#FF6B6B',
                  background: 'rgba(255, 107, 107, 0.05)'
                }}
              >
                {unit.val.toString().padStart(2, '0')}
              </div>
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] mt-1 tracking-widest">{unit.label}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button 
          className="rounded-full px-10 py-7 h-auto text-lg font-black text-white transition-all hover:scale-105 active:scale-95 group uppercase tracking-tight"
          style={{
            background: 'linear-gradient(to right, #FF6B6B, #FF8E53)',
            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
          }}
          asChild
        >
          <a href={joinLink || '#'}>
            Become a Member <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </Button>

      </div>
    </div>
  );
}
