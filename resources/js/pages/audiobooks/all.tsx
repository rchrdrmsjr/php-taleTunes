import { AudiobookCard } from '@/components/ui/audiobook-card';
import ViewPostModal from '@/components/view-post-modal';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import '../../../css/swiper.css';

interface Audiobook {
    id: number;
    title: string;
    description: string;
    cover_image: string | string[];
    category: string;
    user: {
        name: string;
    };
}

interface Props {
    audiobooks: Record<string, Audiobook[]>;
    categories: string[];
}

export default function AllAudiobooks({ audiobooks = {}, categories = [] }: Props) {
    const [selectedAudiobookId, setSelectedAudiobookId] = useState<number | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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

    const handleAudiobookClick = (audiobookId: number) => {
        setSelectedAudiobookId(audiobookId);
        setIsViewModalOpen(true);
    };

    return (
        <AppLayout>
            <Head title="All Audiobooks" />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 border-b-3 border-black pb-4 dark:border-white">
                    <h1 className="mb-4 pb-4 text-center text-4xl font-extrabold">TALETUNES AUDIOBOOKS</h1>
                </div>

                {/* Category Sections */}
                {categories.map((category) => {
                    const books = audiobooks[category] || [];

                    if (!books || books.length === 0) return null;

                    const categoryId = category.toLowerCase().replace(/\s+/g, '-');

                    return (
                        <div key={category} className="relative px-10">
                            <section className="space-y-4">
                                <div className="flex flex-col justify-between gap-2">
                                    <h2 className="text-2xl font-semibold">{category}</h2>
                                    <span className="text-sm text-gray-500">{books.length} audiobooks</span>
                                </div>
                                <div className="relative">
                                    <Swiper
                                        modules={[Navigation]}
                                        spaceBetween={24}
                                        slidesPerView={1}
                                        navigation={{
                                            prevEl: `.${categoryId}-prev`,
                                            nextEl: `.${categoryId}-next`,
                                        }}
                                        breakpoints={{
                                            640: { slidesPerView: 2 },
                                            768: { slidesPerView: 3 },
                                            1024: { slidesPerView: 4 },
                                        }}
                                        className="favorites"
                                    >
                                        {books.map((book) => (
                                            <SwiperSlide key={book.id}>
                                                <div onClick={() => handleAudiobookClick(book.id)}>
                                                    <AudiobookCard
                                                        title={book.title}
                                                        author={book.user.name}
                                                        coverImage={`/storage/${getFirstCoverImage(book.cover_image)}`}
                                                        description={book.description}
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </section>
                            <div
                                className={`swiper-button-prev ${categoryId}-prev !h-12 !w-12 !rounded-full !bg-white !shadow-md hover:!bg-white`}
                            ></div>
                            <div
                                className={`swiper-button-next ${categoryId}-next !h-12 !w-12 !rounded-full !bg-white !shadow-md hover:!bg-white`}
                            ></div>
                        </div>
                    );
                })}

                {/* Empty State */}
                {(!audiobooks || Object.values(audiobooks).every((books) => !books || books.length === 0)) && (
                    <div className="mt-8 text-center">
                        <p className="text-gray-500">No audiobooks found.</p>
                    </div>
                )}

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
