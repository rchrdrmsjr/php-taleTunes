import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Download, Heart, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import ConfirmationDialog from './confirmation-dialog';

interface Audiobook {
    id: number;
    title: string;
    description: string;
    cover_image: string[];
    audio_file: string;
    category: string;
    is_public: boolean;
    author: string;
    user: {
        id: number;
        name: string;
        avatar: string;
    };
    duration?: string;
    favorited_by?: Array<{
        id: number;
    }>;
    comments?: Array<{
        id: number;
        content: string;
        user: {
            id: number;
            name: string;
            avatar: string;
        };
        created_at: string;
    }>;
    generated_code?: string;
}

interface ViewPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    audiobookId: number | null;
}

const ViewPostModal = ({ isOpen, onClose, audiobookId }: ViewPostModalProps) => {
    const { auth } = usePage<SharedData>().props;
    const [audiobook, setAudiobook] = useState<Audiobook | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [comment, setComment] = useState('');
    const [audio] = useState(new Audio());
    const [isFavorited, setIsFavorited] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);

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
    }, [audiobookId, isOpen, isUpdated]);

    useEffect(() => {
        return () => {
            audio.pause();
            audio.src = '';
        };
    }, []);

    useEffect(() => {
        if (!audiobook || !auth.user) {
            setIsFavorited(false);
            return;
        }
        const favorited = audiobook.favorited_by?.some((user) => user.id === auth.user!.id) ?? false;
        setIsFavorited(favorited);
    }, [audiobook, auth.user]);

    const fetchAudiobook = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(route('audiobooks.show', { audiobook: audiobookId }));
            const data = response.data.audiobook;
            // Ensure cover_image is properly handled
            data.cover_image = getCoverImages(data.cover_image);
            setAudiobook(data);
            setIsUpdated(false); // Reset update flag after fetching new data
            // Update isFavorited state based on the fetched data
            if (auth.user) {
                const favorited = data.favorited_by?.some((user: { id: number }) => user.id === auth.user!.id) ?? false;
                setIsFavorited(favorited);
            } else {
                setIsFavorited(false);
            }
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
        if (!audiobook || !auth.user) return;

        const userId = auth.user.id;

        try {
            const response = await axios.post(
                route('audiobooks.toggle-favorite', { audiobook: audiobook.id }),
                {},
                {
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                },
            );

            // Update the audiobook state with the new favorite status
            setAudiobook((prev) => {
                if (!prev) return null;
                const isCurrentlyFavorited = prev.favorited_by?.some((user) => user.id === userId) ?? false;
                const updatedFavoritedBy = isCurrentlyFavorited
                    ? prev.favorited_by?.filter((user) => user.id !== userId) || []
                    : [...(prev.favorited_by || []), { id: userId }];

                return {
                    ...prev,
                    favorited_by: updatedFavoritedBy,
                };
            });

            // Force a re-render by updating the isFavorited state
            setIsFavorited((prev) => !prev);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const handleDownload = () => {
        if (audiobook) {
            window.open(route('audiobooks.download', { audiobook: audiobook.id }));
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

    const handleDelete = async () => {
        setShowConfirmDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!audiobook) return;

        try {
            setShowConfirmDialog(false);
            setIsLoading(true);
            await axios.delete(route('audiobooks.destroy', { audiobook: audiobook.id }));
            onClose();
        } catch (error) {
            console.error('Error deleting audiobook:', error);
            alert('Failed to delete audiobook.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCommentSubmit = async () => {
        if (!audiobook || !comment.trim()) return;
        try {
            const response = await axios.post(`/comments`, {
                audiobook_id: audiobook.id,
                content: comment,
            });
            setAudiobook({
                ...audiobook,
                comments: [...(audiobook.comments || []), response.data],
            });
            setComment('');
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    if (!audiobook) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[1500px] max-w-[95vw] overflow-hidden p-0 [&>button]:text-white">
                <DialogTitle className="sr-only">{audiobook.title}</DialogTitle>
                <DialogDescription className="sr-only">Details and actions for the audiobook titled {audiobook.title}</DialogDescription>
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
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                                            {currentImageIndex + 1}/{audiobook.cover_image.length}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className="w-1/2 overflow-y-auto">
                        {/* Div 1: Cover Image and Actions */}
                        <div className="flex items-start gap-4 border-b border-gray-400 p-4">
                            <img
                                src={`/storage/${audiobook.cover_image[currentImageIndex]}`}
                                alt={audiobook.title}
                                className="h-10 w-10 object-cover"
                            />
                            <h1 className="mt-1 text-lg font-bold">{audiobook.title}</h1>
                            <div className="mt-2 flex flex-1 flex-col">
                                <p className="text-sm text-gray-600 dark:text-white">by {audiobook.author}</p>
                            </div>
                            <div className="mt-2 flex gap-2">
                                <Button
                                    onClick={toggleFavorite}
                                    variant="ghost"
                                    className={`flex items-center gap-2 ${isFavorited ? 'text-red-500' : 'text-black dark:text-white'}`}
                                >
                                    <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                                </Button>
                                <Button variant="ghost" className="" onClick={handleDownload}>
                                    <Download className="h-5 w-5" />
                                </Button>
                                {auth.user && audiobook?.user?.id === auth.user.id && (
                                    <Button variant="ghost" className="rounded-full bg-red-800 text-white" onClick={handleDelete}>
                                        DELETE
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Div 2: User Info and Description */}
                        <div className="flex items-start gap-4 border-b border-gray-400 p-4">
                            <img src={audiobook.user.avatar} alt={audiobook.user.name} className="h-10 w-10 rounded-full" />
                            <div>
                                <p className="mt-2 font-medium">{audiobook.user.name}</p>
                                <p className="mt-2 text-gray-600 dark:text-white">{audiobook.description}</p>
                            </div>
                        </div>

                        {/* Div 3: Audio Player */}
                        <div className="flex items-center gap-4 border-b border-gray-400 p-4">
                            <Button onClick={togglePlay} variant="ghost" className="h-12 w-12 rounded-full hover:bg-gray-200">
                                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                            </Button>

                            {/* Main container with justify-between and full width */}
                            <div className="flex w-full items-center justify-between">
                                {/* Title & Author */}
                                <div className="flex flex-col">
                                    <p className="text-lg font-bold">{audiobook.title}</p>
                                    <p className="text-sm text-gray-600 dark:text-white">by {audiobook.author}</p>
                                    {audiobook.generated_code && (
                                        <p className="mt-1 rounded-md bg-blue-100 px-2 py-1 text-sm font-bold text-blue-700 dark:bg-blue-900 dark:text-white">
                                            Book Code: {audiobook.generated_code}
                                        </p>
                                    )}
                                </div>

                                {/* Duration */}
                                <div className="text-sm">{audiobook.duration}</div>
                            </div>
                        </div>

                        {/* Div 4: Comments */}
                        <div className="space-y-4 border-b border-gray-400 p-4">
                            <h3 className="font-medium">Comments</h3>
                            {audiobook.comments?.map((comment) => (
                                <div key={comment.id} className="flex gap-4">
                                    <img src={comment.user.avatar} alt={comment.user.name} className="h-8 w-8 rounded-full" />
                                    <div className="rounded-md bg-gray-200 p-2 dark:bg-black">
                                        <p className="font-bold">{comment.user.name}</p>
                                        <p className="">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Div 5: Add Comment */}
                        <div className="flex items-center gap-4 p-4">
                            {auth.user && (
                                <>
                                    <img src={auth.user.avatar} alt={auth.user.name} className="h-8 w-8 rounded-full" />
                                    <Input
                                        type="text"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleCommentSubmit();
                                            }
                                        }}
                                        placeholder="Add a comment..."
                                        className="flex-1"
                                    />
                                    <Button className="bg-blue-800 dark:text-white" onClick={handleCommentSubmit}>
                                        Post
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
            <ConfirmationDialog
                isOpen={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                description={`Are you sure you want to delete "${audiobook.title}"? This action cannot be undone.`}
            />
        </Dialog>
    );
};

export default ViewPostModal;
