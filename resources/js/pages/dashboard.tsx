import { AudiobookCard } from '@/components/ui/audiobook-card';
import { HorizontalAudiobookCard } from '@/components/ui/horizontal-audiobook-card';
import ViewPostModal from '@/components/view-post-modal';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import '../../css/swiper.css';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Mock data - replace with actual data from your backend
const heroContent = [
    {
        image: '/images/hero1.png',
        title: 'Be Unique',
        description: 'Unlock your full potential by listening to amazing audiobooks!',
    },
    {
        image: '/images/hero2.png',
        title: 'Discover Stories',
        description: 'Explore a world of captivating narratives and immersive experiences.',
    },
    {
        image: '/images/hero3.jpg',
        title: 'Learn & Grow',
        description: 'Expand your knowledge with our carefully curated collection of audiobooks.',
    },
    {
        image: '/images/hero4.jpg',
        title: 'Share Your Voice',
        description: 'Create and share your own stories with our global community.',
    },
    {
        image: '/images/hero5.jpg',
        title: 'Connect & Inspire',
        description: 'Join a community of storytellers and listeners who share your passion.',
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

// Helper function to get first cover image
const getFirstCoverImage = (coverImage: string | string[]): string => {
    if (Array.isArray(coverImage)) {
        return coverImage[0] || '';
    }
    try {
        const parsed = JSON.parse(coverImage);
        return Array.isArray(parsed) ? parsed[0] || '' : coverImage;
    } catch {
        return coverImage;
    }
};

// Function to shuffle array
const shuffleArray = (array: any[]): any[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export default function Dashboard() {
    const itemsPerBatch = 4;
    const [selectedAudiobookId, setSelectedAudiobookId] = useState<number | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [shuffledRecommendations, setShuffledRecommendations] = useState<any[]>([]);

    const favoritesScrollRef = useRef<HTMLDivElement>(null);
    const recommendationsScrollRef = useRef<HTMLDivElement>(null);
    const josephWorksScrollRef = useRef<HTMLDivElement>(null);

    const [favoritesCanScrollLeft, setFavoritesCanScrollLeft] = useState(false);
    const [favoritesCanScrollRight, setFavoritesCanScrollRight] = useState(false);
    const [recommendationsCanScrollLeft, setRecommendationsCanScrollLeft] = useState(false);
    const [recommendationsCanScrollRight, setRecommendationsCanScrollRight] = useState(false);
    const [josephWorksCanScrollLeft, setJosephWorksCanScrollLeft] = useState(false);
    const [josephWorksCanScrollRight, setJosephWorksCanScrollRight] = useState(false);

    // Get audiobooks from backend
    const userAudiobooks = (usePage().props as any)?.userAudiobooks ?? [];
    const otherAudiobooks = (usePage().props as any)?.otherAudiobooks ?? [];
    const favoriteAudiobooks = (usePage().props as any)?.favoriteAudiobooks ?? [];

    // Shuffle recommendations when component mounts or otherAudiobooks changes
    useEffect(() => {
        if (otherAudiobooks && otherAudiobooks.length > 0) {
            setShuffledRecommendations(shuffleArray(otherAudiobooks));
        }
    }, [otherAudiobooks]);

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

    const handleAudiobookClick = (audiobookId: number) => {
        setSelectedAudiobookId(audiobookId);
        setIsViewModalOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-8">
                {/* Section 1: Hero Carousel */}
                <div className="relative px-10">
                    <section className="h-[400px] w-full overflow-visible">
                        <Swiper
                            modules={[Autoplay, Navigation]}
                            spaceBetween={0}
                            slidesPerView={1}
                            loop={true}
                            navigation={{
                                nextEl: '.hero-next',
                                prevEl: '.hero-prev',
                            }}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            className="hero-swiper"
                        >
                            {heroContent.map((content) => (
                                <SwiperSlide key={content.image}>
                                    <div className="flex h-[400px] w-full flex-col">
                                        <div className="mb-4 flex flex-1 flex-col justify-center">
                                            <h1 className="text-4xl font-bold">{content.title}</h1>
                                            <p className="max-w-2xl text-xl">{content.description}</p>
                                        </div>

                                        <img src={content.image} alt={content.title} className="h-full w-full bg-gray-600 object-contain" />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </section>
                    <div className="swiper-button-prev hero-prev !h-12 !w-12 !rounded-full !bg-white shadow-2xl hover:!bg-white"></div>
                    <div className="swiper-button-next hero-next !h-12 !w-12 !rounded-full !bg-white shadow-2xl hover:!bg-white"></div>
                </div>

                {/* Section 2: Favorites */}
                <div className="relative px-10">
                    <section className="space-y-4">
                        <div className="flex flex-col justify-between gap-2">
                            <h2 className="text-2xl font-semibold">My Favorites</h2>
                            <p className="text-gray-600">Joseph's favorite audiobooks fuel his adventures, mysteries, and discoveries!</p>
                        </div>
                        <div className="relative">
                            <Swiper
                                modules={[Navigation]}
                                spaceBetween={24}
                                slidesPerView={4}
                                navigation={{
                                    nextEl: '.favorites-next',
                                    prevEl: '.favorites-prev',
                                }}
                                breakpoints={{
                                    320: { slidesPerView: 1 },
                                    640: { slidesPerView: 2 },
                                    768: { slidesPerView: 3 },
                                    1024: { slidesPerView: 4 },
                                }}
                                className="favorites-swiper"
                            >
                                {favoriteAudiobooks && favoriteAudiobooks.length > 0 ? (
                                    favoriteAudiobooks.map((book: any) => (
                                        <SwiperSlide key={book.id}>
                                            <div className="audiobook-item cursor-pointer" onClick={() => handleAudiobookClick(book.id)}>
                                                <AudiobookCard
                                                    title={book.title}
                                                    author={book.user?.name || 'Unknown'}
                                                    coverImage={book.cover_image ? `/storage/${getFirstCoverImage(book.cover_image)}` : ''}
                                                    description={book.description}
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))
                                ) : (
                                    <div className="p-4 text-gray-500">You have not added any favorite audiobooks yet.</div>
                                )}
                            </Swiper>
                        </div>
                    </section>
                    <div className="swiper-button-prev favorites-prev !h-12 !w-12 !rounded-full !bg-white !shadow-md hover:!bg-white"></div>
                    <div className="swiper-button-next favorites-next !h-12 !w-12 !rounded-full !bg-white !shadow-md hover:!bg-white"></div>
                </div>

                {/* Section 3: Joseph's Works */}
                <div className="relative px-10">
                    <section className="">
                        <div className="flex flex-col justify-between">
                            <h2 className="text-2xl font-semibold">My Works</h2>
                            {/* <p className="text-gray-600">Explore your creative works and literary contributions</p> */}
                        </div>
                        <div className="relative">
                            <Swiper
                                modules={[Navigation]}
                                spaceBetween={24}
                                slidesPerView={2}
                                navigation={{
                                    nextEl: '.works-next',
                                    prevEl: '.works-prev',
                                }}
                                breakpoints={{
                                    640: { slidesPerView: 2 },
                                    1024: { slidesPerView: 2 },
                                }}
                                className="joseph-works-swiper"
                            >
                                {userAudiobooks && userAudiobooks.length > 0 ? (
                                    userAudiobooks.map((work: any) => (
                                        <SwiperSlide key={work.id}>
                                            <div className="audiobook-item cursor-pointer" onClick={() => handleAudiobookClick(work.id)}>
                                                <HorizontalAudiobookCard
                                                    title={work.title}
                                                    author={work.user?.name || 'You'}
                                                    coverImage={work.cover_image ? `/storage/${getFirstCoverImage(work.cover_image)}` : ''}
                                                    description={work.description}
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))
                                ) : (
                                    <div className="p-4 text-gray-500">You have not published any audiobooks yet.</div>
                                )}
                            </Swiper>
                        </div>
                    </section>
                    <div className="swiper-button-prev works-prev !h-12 !w-12 !rounded-full !bg-white/80 !shadow-md hover:!bg-white"></div>
                    <div className="swiper-button-next works-next !h-12 !w-12 !rounded-full !bg-white/80 !shadow-md hover:!bg-white"></div>
                </div>

                {/* Section 4: Recommendations */}
                <div className="relative px-10">
                    <section className="space-y-4">
                        <div className="flex flex-col justify-between gap-2">
                            <h2 className="text-2xl font-semibold">Recommendations for You</h2>
                            <p className="text-gray-600">Discover new audiobooks tailored just for you!</p>
                        </div>
                        <div className="relative">
                            <Swiper
                                modules={[Navigation]}
                                spaceBetween={24}
                                slidesPerView={4}
                                navigation={{
                                    nextEl: '.recommendations-next',
                                    prevEl: '.recommendations-prev',
                                }}
                                breakpoints={{
                                    320: { slidesPerView: 1 },
                                    640: { slidesPerView: 2 },
                                    768: { slidesPerView: 3 },
                                    1024: { slidesPerView: 4 },
                                }}
                                className="recommendations-swiper"
                            >
                                {otherAudiobooks && otherAudiobooks.length > 0 ? (
                                    otherAudiobooks.map((book: any) => (
                                        <SwiperSlide key={book.id}>
                                            <div className="audiobook-item cursor-pointer" onClick={() => handleAudiobookClick(book.id)}>
                                                <AudiobookCard
                                                    title={book.title}
                                                    author={book.user?.name || 'Unknown'}
                                                    coverImage={book.cover_image ? `/storage/${getFirstCoverImage(book.cover_image)}` : ''}
                                                    description={book.description}
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))
                                ) : (
                                    <div className="p-4 text-gray-500">No recommendations available at the moment.</div>
                                )}
                            </Swiper>
                        </div>
                    </section>
                    <div className="swiper-button-prev recommendations-prev !h-12 !w-12 !rounded-full !bg-white/80 !shadow-md hover:!bg-white"></div>
                    <div className="swiper-button-next recommendations-next !h-12 !w-12 !rounded-full !bg-white/80 !shadow-md hover:!bg-white"></div>
                </div>
                {/* Footer */}
                <div className=" text-center text-sm text-gray-500">
                    <p>© 2025 TaleTunes. All rights reserved.</p>
                    <p>Discover and enjoy a world of audiobooks — anytime, anywhere.</p>
                </div>

                {/* View Post Modal */}
                <ViewPostModal
                    isOpen={isViewModalOpen}
                    onClose={() => {
                        setIsViewModalOpen(false);
                        setSelectedAudiobookId(null);
                    }}
                    audiobookId={selectedAudiobookId}
                />
            </div>
        </AppLayout>
    );
}
