import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay'; // Import the Autoplay plugin
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this is your utility for classnames
import { useEffect, useRef } from 'react';

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
    items: React.ReactNode[];
    showArrows?: boolean;
    showDots?: boolean;
    autoplay?: boolean; // New prop to enable/disable autoplay
    autoplayDelay?: number; // New prop for autoplay delay
}

export function Carousel({
    items,
    showArrows = true,
    showDots = true,
    autoplay = true, // Default to true, so it autoplays by default
    autoplayDelay = 2000, // Default delay of 5 seconds
    className,
    ...props
}: CarouselProps) {
    // Initialize the Autoplay plugin if enabled
    const plugins = React.useMemo(() => (autoplay ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: true, stopOnMouseEnter: true })] : []), [autoplay, autoplayDelay]);

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true, // Recommended for autoplay to ensure smooth continuous looping
            align: 'start',
        },
        plugins // Pass the plugins array to useEmblaCarousel
    );

    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]); // To store snap points for dot navigation
    const [containerReady, setContainerReady] = React.useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollPrev = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = React.useCallback((index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
    }, [emblaApi]);

    const onInit = React.useCallback(() => {
        if (!emblaApi) return;
        setScrollSnaps(emblaApi.scrollSnapList());
    }, [emblaApi]);

    const onSelect = React.useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    React.useEffect(() => {
        if (containerRef.current && containerRef.current.offsetWidth > 0) {
            setContainerReady(true);
        }
    }, []);

    React.useEffect(() => {
        if (!emblaApi) return;

        onInit(); // Get scroll snaps on init
        onSelect(); // Set initial selected index

        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onInit); // Re-fetch scroll snaps on reInit
        emblaApi.on('reInit', onSelect); // Re-set selected index on reInit

        return () => {
            // No need to explicitly call emblaApi.off for these core events if the API instance is destroyed
            // However, if you had custom listeners on the plugin, you'd manage them here.
        };
    }, [emblaApi, onInit, onSelect]);

    // Add this useEffect for ResizeObserver
    useEffect(() => {
        if (!emblaApi || !containerRef.current) return;

        const observer = new ResizeObserver(() => {
            emblaApi.reInit();
        });

        observer.observe(containerRef.current);

        return () => {
            observer.disconnect();
        };
    }, [emblaApi]);

    return (
        <div ref={containerRef} className={cn('relative', className)} {...props}>
            <div className="overflow-hidden" ref={containerReady ? emblaRef : undefined}>
                <div className="flex">
                    {items.map((item, index) => (
                        <div key={index} className="flex-[0_0_100%] min-w-0">
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {showArrows && items.length > 1 && (
                <>
                    <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 disabled:opacity-30"
                        onClick={scrollPrev}
                        disabled={!emblaApi?.canScrollPrev()} // Optionally disable if not scrollable
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 disabled:opacity-30"
                        onClick={scrollNext}
                        disabled={!emblaApi?.canScrollNext()} // Optionally disable if not scrollable
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </>
            )}

            {showDots && items.length > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            className={cn(
                                'h-2 w-2 rounded-full transition-all',
                                index === selectedIndex
                                    ? 'bg-black scale-125'
                                    : 'bg-gray-300'
                            )}
                            onClick={() => scrollTo(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}