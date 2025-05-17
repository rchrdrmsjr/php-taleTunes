import React, { useEffect, useRef, useState } from 'react';

interface SimpleCarouselProps {
    items: React.ReactNode[];
    interval?: number; // ms
    showDots?: boolean;
}

export const SimpleCarousel: React.FC<SimpleCarouselProps> = ({ items, interval = 3000, showDots = true }) => {
    const [current, setCurrent] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-slide effect
    useEffect(() => {
        if (items.length <= 1) return;
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % items.length);
        }, interval);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [items.length, interval]);
    // Reset timer and go to slide on dot click
    const goTo = (idx: number) => {
        setCurrent(idx);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setCurrent((prev) => (prev + 1) % items.length);
            }, interval);
        }
    };

    return (
        <div className="relative h-[400px] w-full">
            <div className="h-full w-full overflow-hidden rounded-xl">
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-700 ${idx === current ? 'z-10 opacity-100' : 'z-0 opacity-0'}`}
                        aria-hidden={idx !== current}
                    >
                        {item}
                    </div>
                ))}
            </div>
            {showDots && items.length > 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 pt-">
                    {items.map((_, idx) => (
                        <button
                            key={idx}
                            className={`h-2 w-2 rounded-full transition-all ${idx === current ? 'scale-125 bg-black' : 'bg-gray-300'}`}
                            onClick={() => goTo(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
