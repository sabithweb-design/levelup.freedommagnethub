'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface StickyOfferBarProps {
  expiryDate: string;
  joinLink: string;
  oldPriceLabel?: string;
  currentPriceLabel?: string;
  priceSubtext?: string;
}

export function StickyOfferBar({ 
  expiryDate, 
  joinLink, 
  oldPriceLabel = 'Join ₹1000 / month', 
  currentPriceLabel = 'Now Pay ₹589 today', 
  priceSubtext = '(₹499 + GST) Lifetime Access' 
}: StickyOfferBarProps) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; m: number; s: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Personalized 24-hour timer logic
    const STORAGE_KEY = 'fmh_sticky_offer_expiry';
    let targetTime: number;

    const storedExpiry = localStorage.getItem(STORAGE_KEY);
    
    if (storedExpiry) {
      targetTime = parseInt(storedExpiry, 10);
    } else {
      // Set expiry to 24 hours from now
      targetTime = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, targetTime.toString());
    }

    const calculate = () => {
      const difference = targetTime - Date.now();
      
      if (difference <= 0) return null;

      return {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => {
      const remaining = calculate();
      setTimeLeft(remaining);
    }, 1000);

    setTimeLeft(calculate());

    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
                  className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-lg font-black text-2xl md:text-3xl border border-white/40 text-white bg-white/10"
                >
                  {unit.val.toString().padStart(2, '0')}
                </div>
                <span className="text-[10px] md:text-[11px] font-bold text-white/90 mt-1 uppercase tracking-tighter">{unit.label}</span>
              </div>
            ))}
          </div>

          {/* Pricing Typography */}
          <div className="text-right md:text-left text-white">
            <p className="text-xs md:text-sm opacity-90 leading-tight">
              <span className="line-through opacity-70">{oldPriceLabel}</span>
            </p>
            <div className="flex flex-col mt-0.5">
              <p className="text-lg md:text-2xl lg:text-3xl leading-tight font-medium">
                {currentPriceLabel.split('₹').length > 1 ? (
                  <>
                    {currentPriceLabel.split('₹')[0]}
                    <span className="font-black">₹{currentPriceLabel.split('₹')[1]}</span>
                  </>
                ) : (
                  <span className="font-black">{currentPriceLabel}</span>
                )}
              </p>
              <p className="text-xs md:text-sm font-black opacity-95">
                {priceSubtext}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full md:w-auto md:min-w-[280px] rounded-full py-8 md:py-8 text-xl md:text-2xl font-black bg-white text-[#FF4B2B] hover:bg-white/95 transition-all shadow-lg active:scale-95 group uppercase tracking-tight"
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
