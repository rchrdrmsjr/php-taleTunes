import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import axios from 'axios';
import { Heart, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Audiobook {
    id: number;
    title: string;
    description: string;
    cover_image: string;
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
    const [audio] = useState(new Audio());

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
            setAudiobook(response.data.audiobook);
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

    if (!audiobook) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[1500px] max-w-[95vw] overflow-hidden p-0">
                <div className="flex h-[85vh]">
                    {/* Left: Cover Image */}
                    <div className="w-1/2 bg-black">
                        <img src={`/storage/${audiobook.cover_image}`} alt={audiobook.title} className="h-full w-full object-contain" />
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
