import { SimpleCarousel } from '@/components/SimpleCarousel';
import { AudiobookCard } from '@/components/ui/audiobook-card';
import { HorizontalAudiobookCard } from '@/components/ui/horizontal-audiobook-card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Mock data - replace with actual data from your backend
const heroImages = ['/images/hero1.png', '/images/hero2.png', '/images/hero3.jpg', '/images/hero4.jpg', '/images/hero5.jpg'];

const favoriteAudiobooks = [
    {
        title: 'The Great Adventure',
        author: 'John Smith',
        coverImage: '/images/book1.jpg',
        description: 'An epic journey through uncharted territories.',
    },
    {
        title: 'Mystery Manor',
        author: 'Jane Doe',
        coverImage: '/images/book2.jpg',
        description: 'A thrilling mystery that will keep you guessing.',
    },
    {
        title: 'Space Odyssey',
        author: 'Robert Johnson',
        coverImage: '/images/book3.jpg',
        description: 'Explore the vastness of space in this sci-fi adventure.',
    },
    {
        title: 'The Great Adventure',
        author: 'John Smith',
        coverImage: '/images/book1.jpg',
        description: 'An epic journey through uncharted territories.',
    },
    {
        title: 'Mystery Manor',
        author: 'Jane Doe',
        coverImage: '/images/book2.jpg',
        description: 'A thrilling mystery that will keep you guessing.',
    },
];

const josephWorks = [
    {
        title: 'Creative Writing',
        author: 'Joseph',
        coverImage: '/images/work1.jpg',
        description: 'A collection of short stories and poems.',
    },
    {
        title: 'Poetry Collection',
        author: 'Joseph',
        coverImage: '/images/work2.jpg',
        description: 'Beautiful verses that touch the soul.',
    },
    {
        title: 'The Silent Echo',
        author: 'Joseph',
        coverImage: '/images/work3.jpg',
        description: 'A novel exploring the depths of human connection.',
    },
    {
        title: 'Whispers of Time',
        author: 'Joseph',
        coverImage: '/images/work4.jpg',
        description: 'A journey through memories and forgotten moments.',
    },
    {
        title: 'Urban Tales',
        author: 'Joseph',
        coverImage: '/images/work5.jpg',
        description: 'Stories from the city streets and its inhabitants.',
    },
    {
        title: "Nature's Symphony",
        author: 'Joseph',
        coverImage: '/images/work6.jpg',
        description: 'Poems inspired by the beauty of the natural world.',
    },
    {
        title: 'The Last Chapter',
        author: 'Joseph',
        coverImage: '/images/work7.jpg',
        description: 'A mystery novel that keeps readers guessing until the end.',
    },
    {
        title: 'Echoes of Yesterday',
        author: 'Joseph',
        coverImage: '/images/work8.jpg',
        description: 'A collection of historical fiction short stories.',
    },
];

const recommendations = [
    {
        title: 'The Lost City',
        author: 'Sarah Wilson',
        coverImage: '/images/recommendation1.jpg',
        description: 'A fascinating archaeological adventure.',
    },
    {
        title: 'Future Tech',
        author: 'Mike Brown',
        coverImage: '/images/rec2.jpg',
        description: 'Exploring the possibilities of tomorrow.',
    },
    {
        title: 'Ocean Depths',
        author: 'Lisa Chen',
        coverImage: '/images/rec3.jpg',
        description: 'Discover the mysteries of the deep sea.',
    },
    {
        title: 'The Lost City',
        author: 'Sarah Wilson',
        coverImage: '/images/rec1.jpg',
        description: 'A fascinating archaeological adventure.',
    },
    {
        title: 'Future Tech',
        author: 'Mike Brown',
        coverImage: '/images/rec2.jpg',
        description: 'Exploring the possibilities of tomorrow.',
    },
];

export default function Dashboard() {
    const itemsPerBatch = 4;

    const favoritesScrollRef = useRef<HTMLDivElement>(null);
    const recommendationsScrollRef = useRef<HTMLDivElement>(null);
    const josephWorksScrollRef = useRef<HTMLDivElement>(null);

    const [favoritesCanScrollLeft, setFavoritesCanScrollLeft] = useState(false);
    const [favoritesCanScrollRight, setFavoritesCanScrollRight] = useState(false);
    const [recommendationsCanScrollLeft, setRecommendationsCanScrollLeft] = useState(false);
    const [recommendationsCanScrollRight, setRecommendationsCanScrollRight] = useState(false);
    const [josephWorksCanScrollLeft, setJosephWorksCanScrollLeft] = useState(false);
    const [josephWorksCanScrollRight, setJosephWorksCanScrollRight] = useState(false);

    useEffect(() => {
        const favoritesContainer = favoritesScrollRef.current;
        const recommendationsContainer = recommendationsScrollRef.current;
        const josephWorksContainer = josephWorksScrollRef.current;

        const checkFavoritesScroll = () => {
            if (favoritesContainer) {
                setFavoritesCanScrollLeft(favoritesContainer.scrollLeft > 10);
                setFavoritesCanScrollRight(favoritesContainer.scrollLeft < favoritesContainer.scrollWidth - favoritesContainer.clientWidth - 10);
            }
        };

        const checkRecommendationsScroll = () => {
            if (recommendationsContainer) {
                setRecommendationsCanScrollLeft(recommendationsContainer.scrollLeft > 10);
                setRecommendationsCanScrollRight(
                    recommendationsContainer.scrollLeft < recommendationsContainer.scrollWidth - recommendationsContainer.clientWidth - 10,
                );
            }
        };

        const checkJosephWorksScroll = () => {
            if (josephWorksContainer) {
                setJosephWorksCanScrollLeft(josephWorksContainer.scrollLeft > 10);
                setJosephWorksCanScrollRight(
                    josephWorksContainer.scrollLeft < josephWorksContainer.scrollWidth - josephWorksContainer.clientWidth - 10,
                );
            }
        };

        // Check initially and whenever the containers resize or content changes
        checkFavoritesScroll();
        checkRecommendationsScroll();
        checkJosephWorksScroll();

        // Add event listeners for scrolling
        favoritesContainer?.addEventListener('scroll', checkFavoritesScroll);
        recommendationsContainer?.addEventListener('scroll', checkRecommendationsScroll);
        josephWorksContainer?.addEventListener('scroll', checkJosephWorksScroll);

        // Cleanup event listeners
        return () => {
            favoritesContainer?.removeEventListener('scroll', checkFavoritesScroll);
            recommendationsContainer?.removeEventListener('scroll', checkRecommendationsScroll);
            josephWorksContainer?.removeEventListener('scroll', checkJosephWorksScroll);
        };
    }, [favoriteAudiobooks, recommendations, josephWorks]);

    const handleNextSlide = (containerRef: React.RefObject<HTMLDivElement | null>) => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: containerRef.current.clientWidth,
                behavior: 'smooth',
            });
        }
    };

    const handlePreviousSlide = (containerRef: React.RefObject<HTMLDivElement | null>) => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: -containerRef.current.clientWidth,
                behavior: 'smooth',
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-8 p-4">
                {/* Section 1: Hero Carousel */}
                <div>
                    <h1 className="text-3xl font-bold">Be Unique</h1>
                    <p className="text-xl text-gray-700">Unlock your full potential by listening to amazing audiobooks!</p>
                </div>
                <section className="relative h-[400px] w-full overflow-hidden">
                    <SimpleCarousel
                        items={heroImages.map((image) => (
                            <div key={image} className="h-[400px] w-full">
                                <img src={image} alt="Hero" className="h-full w-full object-contain" />
                            </div>
                        ))}
                    />
                </section>

                {/* Section 2: Favorites */}
                <section className="space-y-4">
                    <div className="flex flex-col justify-between gap-2">
                        <h2 className="text-2xl font-semibold">My Favorites</h2>
                        <p className="text-gray-600">Joseph's favorite audiobooks fuel his adventures, mysteries, and discoveries!</p>
                    </div>
                    <div className="relative">
                        <div ref={favoritesScrollRef} className="no-scrollbar flex snap-x snap-mandatory space-x-6 overflow-x-auto pb-4">
                            {favoriteAudiobooks.map((book) => (
                                <div key={book.title} className="audiobook-item flex-shrink-0 snap-start" style={{ width: `calc(25% - 18px)` }}>
                                    <AudiobookCard {...book} />
                                </div>
                            ))}
                            <div className="flex-shrink-0" style={{ width: '1px' }}></div>
                        </div>

                        {favoritesCanScrollLeft && (
                            <button
                                onClick={() => handlePreviousSlide(favoritesScrollRef)}
                                className="absolute top-1/2 left-0 z-10 -ml-5 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-gray-700"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}

                        {favoritesCanScrollRight && (
                            <button
                                onClick={() => handleNextSlide(favoritesScrollRef)}
                                className="absolute top-1/2 right-0 z-10 -mr-5 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-gray-700"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                    </div>
                </section>

                {/* Section 3: Joseph's Works */}
                <section className="space-y-4">
                    <div className="flex flex-col justify-between gap-2">
                        <h2 className="text-2xl font-semibold">Joseph Works</h2>
                        <p className="text-gray-600">Explore Joseph's creative works and literary contributions</p>
                    </div>
                    <div className="relative">
                        <div
                            ref={josephWorksScrollRef}
                            className="no-scrollbar flex snap-x snap-mandatory space-x-6 overflow-x-auto pb-4"
                            style={{ scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}
                        >
                            {josephWorks.map((work) => (
                                <div key={work.title} className="audiobook-item w-[350px] flex-shrink-0 snap-start">
                                    <HorizontalAudiobookCard {...work} />
                                </div>
                            ))}
                            <div className="flex-shrink-0" style={{ width: '1px' }}></div>
                        </div>

                        {josephWorksCanScrollLeft && (
                            <button
                                onClick={() => handlePreviousSlide(josephWorksScrollRef)}
                                className="absolute top-1/2 left-0 z-10 -ml-5 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-gray-700"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}

                        {josephWorksCanScrollRight && (
                            <button
                                onClick={() => handleNextSlide(josephWorksScrollRef)}
                                className="absolute top-1/2 right-0 z-10 -mr-5 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-gray-700"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                    </div>
                </section>

                {/* Section 4: Recommendations */}
                <section className="space-y-4">
                    <div className="flex flex-col justify-between gap-2">
                        <h2 className="text-2xl font-semibold">Recommendations for You</h2>
                        <p className="text-gray-600">Discover new audiobooks tailored just for you!</p>
                    </div>
                    <div className="relative">
                        <div ref={recommendationsScrollRef} className="no-scrollbar flex snap-x snap-mandatory space-x-6 overflow-x-auto pb-4">
                            {recommendations.map((book) => (
                                <div key={book.title} className="audiobook-item flex-shrink-0 snap-start" style={{ width: `calc(25% - 18px)` }}>
                                    <AudiobookCard {...book} />
                                </div>
                            ))}
                            <div className="flex-shrink-0" style={{ width: '1px' }}></div>
                        </div>

                        {recommendationsCanScrollLeft && (
                            <button
                                onClick={() => handlePreviousSlide(recommendationsScrollRef)}
                                className="absolute top-1/2 left-0 z-10 -ml-5 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-gray-700"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}

                        {recommendationsCanScrollRight && (
                            <button
                                onClick={() => handleNextSlide(recommendationsScrollRef)}
                                className="absolute top-1/2 right-0 z-10 -mr-5 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-gray-700"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
