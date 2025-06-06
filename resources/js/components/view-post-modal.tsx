import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Heart, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Audiobook {
    id: number;
    title: string;
    description: string;
    cover_image: string[];
    audio_file: string;
    category: string;
    is_public: boolean;
    is_favorite: boolean;
    user: {
        id: number;
        name: string;
        username: string;
    };
}

interface ViewPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    audiobookId: number | null;
}

export default function ViewPostModal({ isOpen, onClose, audiobookId }: ViewPostModalProps) {
    const [audiobook, setAudiobook] = useState<Audiobook | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [audio] = useState(new Audio());

    // Helper function to get cover images
    const getCoverImages = (coverImage: string | string[]): string[] => {
        if (Array.isArray(coverImage)) {
            return coverImage;
        }
        try {
            // Try to parse if it's a JSON string
            const parsed = JSON.parse(coverImage);
            return Array.isArray(parsed) ? parsed : [coverImage];
        } catch {
            // If parsing fails, return as single item array
            return [coverImage];
        }
    };

    useEffect(() => {
        if (audiobookId && isOpen) {
            fetchAudiobook();
        }
    }, [audiobookId, isOpen]);

    useEffect(() => {
        return () => {
            audio.pause();
            audio.src = '';
        };
    }, []);

    const fetchAudiobook = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(route('audiobooks.show', { audiobook: audiobookId }));
            const data = response.data.audiobook;
            // Ensure cover_image is properly handled
            data.cover_image = getCoverImages(data.cover_image);
            setAudiobook(data);
            setCurrentImageIndex(0);
        } catch (error) {
            console.error('Error fetching audiobook:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePlay = () => {
        if (!audiobook) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.src = `/storage/${audiobook.audio_file}`;
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleFavorite = async () => {
        if (!audiobook) return;

        try {
            await axios.post(route('audiobooks.toggle-favorite', { audiobook: audiobook.id }));
            setAudiobook((prev) => (prev ? { ...prev, is_favorite: !prev.is_favorite } : null));
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const nextImage = () => {
        if (!audiobook) return;
        setCurrentImageIndex((prev) => (prev + 1) % audiobook.cover_image.length);
    };

    const previousImage = () => {
        if (!audiobook) return;
        setCurrentImageIndex((prev) => (prev - 1 + audiobook.cover_image.length) % audiobook.cover_image.length);
    };

    if (!audiobook) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[1500px] max-w-[95vw] overflow-hidden p-0">
                <div className="flex h-[85vh]">
                    {/* Left: Cover Image Carousel */}
                    <div className="relative w-1/2 bg-black">
                        {audiobook.cover_image && audiobook.cover_image.length > 0 && (
                            <>
                                <img
                                    src={`/storage/${audiobook.cover_image[currentImageIndex]}`}
                                    alt={`${audiobook.title} - Image ${currentImageIndex + 1}`}
                                    className="h-full w-full object-contain"
                                />

                                {/* Navigation Buttons */}
                                {audiobook.cover_image.length > 1 && (
                                    <>
                                        <button
                                            onClick={previousImage}
                                            className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                                        >
                                            <ChevronLeft className="h-6 w-6" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                                        >
                                            <ChevronRight className="h-6 w-6" />
                                        </button>

                                        {/* Image Counter */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                                            {currentImageIndex + 1} / {audiobook.cover_image.length}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className="w-1/2 overflow-y-auto p-8">
                        <DialogHeader>
                            <DialogTitle className="mb-2 text-3xl font-bold">{audiobook.title}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">Author</h3>
                                <p className="text-gray-600">{audiobook.user.name}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">Category</h3>
                                <p className="text-gray-600">{audiobook.category}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">Description</h3>
                                <p className="whitespace-pre-line text-gray-600">{audiobook.description}</p>
                            </div>
                        </div>

                        {/* Audio Controls */}
                        <div className="sticky bottom-0 mt-6 bg-white pt-4 pb-2">
                            <div className="flex items-center gap-4">
                                <Button
                                    onClick={togglePlay}
                                    className="flex items-center gap-2 rounded-full bg-blue-800 px-6 py-2 text-white hover:bg-blue-900"
                                >
                                    {isPlaying ? (
                                        <>
                                            <Pause className="h-5 w-5" />
                                            Pause
                                        </>
                                    ) : (
                                        <>
                                            <Play className="h-5 w-5" />
                                            Play
                                        </>
                                    )}
                                </Button>

                                <Button
                                    onClick={toggleFavorite}
                                    variant="ghost"
                                    className={`flex items-center gap-2 rounded-full ${audiobook.is_favorite ? 'text-red-500' : 'text-gray-500'}`}
                                >
                                    <Heart className={`h-5 w-5 ${audiobook.is_favorite ? 'fill-current' : ''}`} />
                                    {audiobook.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
