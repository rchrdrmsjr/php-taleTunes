import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@inertiajs/core';
import { router, useForm } from '@inertiajs/react';
import { CheckIcon, ChevronDownIcon, ImageIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast, Toaster } from 'sonner';

interface AudiobookFormData {
    [key: string]: File | File[] | string | boolean | null | undefined;
    title: string;
    description: string;
    cover_image: File[] | null;
    audio_file: File | null;
    category: string;
    is_public: boolean;
    author: string;
    duration?: string;
    generated_code?: string;
}

interface AudiobookFormErrors {
    [key: string]: string | undefined;
    title?: string;
    description?: string;
    cover_image?: string;
    audio_file?: string;
    category?: string;
    is_public?: string;
    author?: string;
    duration?: string;
    generated_code?: string;
}

interface RoomAudiobookUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId: number;
}

export default function RoomAudiobookUploadModal({ isOpen, onClose, roomId }: RoomAudiobookUploadModalProps) {
    const [category, setCategory] = useState('');
    const [coverPreview, setCoverPreview] = useState<string[]>([]);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset, transform } = useForm<AudiobookFormData>({
        title: '',
        description: '',
        cover_image: null,
        audio_file: null,
        category: '',
        is_public: false,
        author: '',
        generated_code: '',
    });

    // Transform data before sending to ensure generated_code is always set
    transform((data) => ({
        ...data,
        generated_code: data.generated_code || Math.random().toString(36).substring(2, 10).toUpperCase(),
    }));

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            if (files.length > 10) {
                toast.error('Maximum 10 images allowed');
                return;
            }
            const newPreviews: string[] = [];
            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result as string);
                    setCoverPreview([...newPreviews]);
                };
                reader.readAsDataURL(file);
            });
            setData('cover_image', Array.from(files));
        }
    };

    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create a temporary audio element to get duration
            const audio = new Audio(URL.createObjectURL(file));
            audio.addEventListener('loadedmetadata', () => {
                const minutes = Math.floor(audio.duration / 60);
                const seconds = Math.floor(audio.duration % 60);
                const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                setData('audio_file', file);
                setData('duration', duration);
            });
        }
    };

    const handleRemoveCoverImage = (indexToRemove: number) => {
        // Remove from coverPreview state
        setCoverPreview((prevPreviews) => prevPreviews.filter((_, index) => index !== indexToRemove));

        // Remove from form data (data.cover_image)
        setData((prevData) => {
            if (prevData.cover_image) {
                const newCoverImages = Array.from(prevData.cover_image).filter((_, index) => index !== indexToRemove);
                return { ...prevData, cover_image: newCoverImages.length > 0 ? newCoverImages : null };
            }
            return prevData;
        });

        // If no images are left, clear the file input as well
        if (coverPreview.length === 1 && coverInputRef.current) {
            coverInputRef.current.value = '';
        }
    };

    const clearAllFields = () => {
        reset();
        setCategory('');
        setCoverPreview([]);
        if (coverInputRef.current) coverInputRef.current.value = '';
        if (audioInputRef.current) audioInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // All data is already in the `data` state of useForm, including files.
        // We just need to ensure generated_code is set in the data state.
        const generatedCode = Math.random().toString(36).substring(2, 10).toUpperCase(); // Simple 8-char alphanumeric code
        setData('generated_code', generatedCode);

        // Validate required fields
        if (!data.title || !data.cover_image || !data.audio_file || !data.category || !data.author) {
            toast.error('Please fill in all required fields');
            return;
        }

        let toastId: string | number | undefined;

        post(route('rooms.audiobooks.store', roomId), {
            onProgress: (progress?: Progress) => {
                if (progress && progress.loaded && progress.total) {
                    const percentage = Math.round((progress.loaded * 100) / progress.total);
                    if (toastId) {
                        toast.dismiss(toastId);
                    }
                    toastId = toast.loading(`Uploading... ${percentage}%`);
                }
            },
            onSuccess: () => {
                if (toastId) {
                    toast.dismiss(toastId);
                }
                toast.success('Audiobook added to room successfully!');
                clearAllFields();
                onClose();
                // Refresh the room data to show the new audiobook
                router.reload({ only: ['room', 'audiobooks'] });
            },
            onError: (errors: AudiobookFormErrors) => {
                if (toastId) {
                    toast.dismiss(toastId);
                }
                console.error('Upload errors:', errors);
                Object.values(errors).forEach((error) => {
                    toast.error(error);
                });
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-[800px]">
                <DialogHeader className="border-b px-6 py-4">
                    <DialogTitle className="ml-8 text-xl font-bold text-gray-600 dark:text-white">Add Audiobook to Room</DialogTitle>
                </DialogHeader>

                <div className="px-6 py-6">
                    <Toaster position="top-right" />
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {/* Left: Cover Upload */}
                            <div className="md:col-span-1">
                                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 dark:bg-transparent">
                                    <div
                                        className="flex w-full cursor-pointer flex-col items-center justify-center"
                                        onClick={() => coverInputRef.current?.click()}
                                    >
                                        {coverPreview.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-2">
                                                {coverPreview.map((preview, index) => (
                                                    <div key={index} className="relative">
                                                        <img
                                                            src={preview}
                                                            alt={`Cover preview ${index + 1}`}
                                                            className="h-24 w-full rounded-lg object-cover"
                                                        />
                                                        <Button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveCoverImage(index);
                                                            }}
                                                            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
                                                            aria-label={`Remove image ${index + 1}`}
                                                        >
                                                            &times;
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <>
                                                <ImageIcon className="h-12 w-12 text-gray-400" />
                                                <span className="mt-2 text-sm text-gray-500">Select from computer</span>
                                            </>
                                        )}
                                    </div>
                                    <Input
                                        id="cover_image"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={coverInputRef}
                                        onChange={handleCoverChange}
                                        multiple
                                    />
                                    {errors.cover_image && <p className="mt-2 text-sm text-red-500">{errors.cover_image}</p>}
                                </div>
                            </div>

                            {/* Right: Form */}
                            <div className="md:col-span-2">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="title" className="font-bold">
                                            Title
                                        </Label>
                                        <Input
                                            id="title"
                                            placeholder="Enter audiobook title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                        />
                                        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="author" className="font-bold">
                                            Author
                                        </Label>
                                        <Input
                                            id="author"
                                            placeholder="Enter author name"
                                            value={data.author ?? ''}
                                            onChange={(e) => setData('author', e.target.value)}
                                        />
                                        {errors.author && <p className="mt-1 text-sm text-red-500">{errors.author}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="description" className="font-bold">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            rows={3}
                                            maxLength={2000}
                                            placeholder="Enter a description..."
                                            className="w-full resize-none"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                        />
                                        <div className="mt-1 text-right text-xs text-gray-500">{data.description.length}/2000</div>
                                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="audio_file" className="font-bold">
                                            Audio Book File (MP3)
                                        </Label>
                                        <Input id="audio_file" type="file" accept="audio/mp3" ref={audioInputRef} onChange={handleAudioChange} />
                                        {errors.audio_file && <p className="mt-1 text-sm text-red-500">{errors.audio_file}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="category" className="font-bold">
                                            Category
                                        </Label>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between">
                                                    {category || 'Select a category'}
                                                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent sideOffset={4} align="end" className="min-w-[12rem]">
                                                <DropdownMenuLabel>Category</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem
                                                        onSelect={() => {
                                                            setCategory('Fantasy');
                                                            setData('category', 'Fantasy');
                                                        }}
                                                    >
                                                        <CheckIcon className="mr-2 h-4 w-4" />
                                                        Fantasy
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onSelect={() => {
                                                            setCategory('Romance');
                                                            setData('category', 'Romance');
                                                        }}
                                                    >
                                                        <CheckIcon className="mr-2 h-4 w-4" />
                                                        Romance
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onSelect={() => {
                                                            setCategory('Motivation');
                                                            setData('category', 'Motivation');
                                                        }}
                                                    >
                                                        <CheckIcon className="mr-2 h-4 w-4" />
                                                        Motivation
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onSelect={() => {
                                                            setCategory('Horror');
                                                            setData('category', 'Horror');
                                                        }}
                                                    >
                                                        <CheckIcon className="mr-2 h-4 w-4" />
                                                        Horror
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onSelect={() => {
                                                            setCategory('Non-Fiction');
                                                            setData('category', 'Non-Fiction');
                                                        }}
                                                    >
                                                        <CheckIcon className="mr-2 h-4 w-4" />
                                                        Non-Fiction
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onSelect={() => {
                                                            setCategory('Memoir');
                                                            setData('category', 'Memoir');
                                                        }}
                                                    >
                                                        <CheckIcon className="mr-2 h-4 w-4" />
                                                        Memoir
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onSelect={() => {
                                                            setCategory('Science Fiction');
                                                            setData('category', 'Science Fiction');
                                                        }}
                                                    >
                                                        <CheckIcon className="mr-2 h-4 w-4" />
                                                        Science Fiction
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onSelect={() => {
                                                            setCategory('Mystery');
                                                            setData('category', 'Mystery');
                                                        }}
                                                    >
                                                        <CheckIcon className="mr-2 h-4 w-4" />
                                                        Mystery
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onSelect={() => {
                                                            setCategory('Historical Fiction');
                                                            setData('category', 'Historical Fiction');
                                                        }}
                                                    >
                                                        <CheckIcon className="mr-2 h-4 w-4" />
                                                        Historical Fiction
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex justify-end space-x-3 border-t bg-gray-50/50 px-6 py-4 dark:bg-transparent">
                    <Button type="button" variant="outline" onClick={onClose} className="text-gray-600 dark:text-white">
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleSubmit} className="bg-blue-600 text-white hover:bg-blue-700" disabled={processing}>
                        {processing ? 'Adding...' : 'Add to Room'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
