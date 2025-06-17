import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import Switch from 'react-switch';
import { toast, Toaster } from 'sonner';

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
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { CheckIcon, ChevronDownIcon, ImageIcon } from 'lucide-react';

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

export default function Upload() {
    const [isPublic, setIsPublic] = useState(true);
    const [category, setCategory] = useState('');
    const [coverPreview, setCoverPreview] = useState<string[]>([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showContinueModal, setShowContinueModal] = useState(false);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset, transform } = useForm<AudiobookFormData>({
        title: '',
        description: '',
        cover_image: null,
        audio_file: null,
        category: '',
        is_public: true,
        author: '',
        duration: '',
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

    const clearAllFields = () => {
        reset();
        setCategory('');
        setCoverPreview([]);
        setIsPublic(true);
        if (coverInputRef.current) coverInputRef.current.value = '';
        if (audioInputRef.current) audioInputRef.current.value = '';
    };

    const handlePublish = () => {
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

        post(route('audiobooks.store'), {
            method: 'post',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            onProgress: (progress: any) => {
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
                setShowSuccessModal(true);
                toast.success('Audiobook published successfully!');
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

    // When success modal closes, show continue modal
    const handleSuccessModalChange = (open: boolean) => {
        setShowSuccessModal(open);
        if (!open) setShowContinueModal(true);
    };

    // Handle continue modal actions
    const handleContinue = () => {
        clearAllFields();
        setShowContinueModal(false);
        // Refresh dashboard data to show the new audiobook
        router.reload({ only: ['userAudiobooks', 'otherAudiobooks', 'favoriteAudiobooks'] });
    };

    const handleGoToDashboard = () => {
        clearAllFields();
        setShowContinueModal(false);
        // Refresh dashboard data to show the new audiobook
        router.visit('/dashboard', {
            only: ['userAudiobooks', 'otherAudiobooks', 'favoriteAudiobooks'],
            replace: true,
        });
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

    return (
        <AppLayout onPublish={handlePublish} isPublishing={processing} title={data.title}>
            <Head title="Upload Audiobook" />
            <Toaster position="top-right" />

            <Dialog open={showSuccessModal} onOpenChange={handleSuccessModalChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl font-bold text-green-600">Congratulations!</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-4">
                        <p className="text-center text-lg">Your work has been successfully published!</p>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Continue Modal */}
            <Dialog open={showContinueModal} onOpenChange={setShowContinueModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-lg font-bold">Do you want to continue?</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center gap-4 py-4">
                        <div className="flex gap-4">
                            <Button className="bg-blue-800 text-white hover:bg-blue-900" onClick={handleContinue}>
                                Yes
                            </Button>
                            <Button variant="outline" onClick={handleGoToDashboard}>
                                No, go to Dashboard
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="flex flex-col gap-8 p-4 md:flex-row">
                {/* Left: Cover Upload */}
                <div className="w-full md:w-1/3">
                    <Card className="flex flex-col items-center justify-center bg-blue-800 p-6 text-white">
                        <div
                            className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white"
                            onClick={() => coverInputRef.current?.click()}
                        >
                            {coverPreview.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {coverPreview.map((preview: string, index: number) => {
                                        return (
                                            <div key={index} className="relative">
                                                <img
                                                    src={preview}
                                                    alt={`Cover preview ${index + 1}`}
                                                    className="h-20 w-full rounded-lg object-cover"
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
                                        );
                                    })}
                                </div>
                            ) : (
                                <>
                                    <ImageIcon className="h-12 w-12" />
                                    <span className="mt-2">Select from computer</span>
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
                        <Label htmlFor="cover_image" className="mt-4 w-full">
                            <Button asChild variant="outline" className="w-full border-white text-white hover:bg-white hover:text-blue-600">
                                Browse...
                            </Button>
                        </Label>
                        {errors.cover_image && <p className="mt-2 text-sm text-red-400">{errors.cover_image}</p>}
                    </Card>
                </div>

                {/* Right: Form */}
                <div className="w-full md:w-2/3">
                    <Card className="p-6">
                        {/* Tab Header */}
                        <div className="mb-6 border-b-2 border-blue-800 pb-2">
                            <h2 className="text-lg">Audio Book Details</h2>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <Label htmlFor="audiobook_title" className="font-bold">
                                    Title
                                </Label>
                                <Input
                                    id="audiobook_title"
                                    placeholder="Enter audiobook title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                            </div>

                            <div>
                                <Label htmlFor="audiobook_author" className="font-bold">
                                    Author
                                </Label>
                                <Input
                                    id="audiobook_author"
                                    placeholder="Enter author name"
                                    value={data.author}
                                    onChange={(e) => setData('author', e.target.value)}
                                />
                                {errors.author && <p className="mt-1 text-sm text-red-500">{errors.author}</p>}
                            </div>

                            <div>
                                <Label htmlFor="audiobook_description" className="font-bold">
                                    Description
                                </Label>
                                <textarea
                                    id="audiobook_description"
                                    rows={3}
                                    maxLength={2000}
                                    placeholder="Enter a description..."
                                    className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                <div className="mt-1 text-right text-xs text-gray-500">{data.description.length}/2000</div>
                                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                            </div>

                            <div>
                                <Label htmlFor="audiobook_audio" className="font-bold">
                                    Audio Book File (MP3)
                                </Label>
                                <Input id="audiobook_audio" type="file" accept="audio/mp3" ref={audioInputRef} onChange={handleAudioChange} />
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

                            {/* Public Toggle */}
                            <div className="mb-4 flex items-center gap-4">
                                <Label htmlFor="audiobook_public" className="text-lg leading-tight font-semibold text-gray-900 dark:text-white">
                                    Public
                                </Label>
                                <Switch
                                    id="audiobook_public"
                                    checked={isPublic}
                                    onChange={(checked) => {
                                        setIsPublic(checked);
                                        setData('is_public', checked);
                                    }}
                                    onColor="#3b82f6"
                                    offColor="#6b7280"
                                    checkedIcon={
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                height: '100%',
                                                width: 48,
                                                color: 'white',
                                                fontSize: 12,
                                                fontWeight: 600,
                                                paddingLeft: 6,
                                            }}
                                        >
                                            On
                                        </div>
                                    }
                                    uncheckedIcon={
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                height: '100%',
                                                width: 48,
                                                color: 'white',
                                                fontSize: 12,
                                                fontWeight: 600,
                                                paddingLeft: 6,
                                            }}
                                        >
                                            Off
                                        </div>
                                    }
                                />
                            </div>
                            <p className="text-xs text-gray-400">You can turn your post on and off whenever you want.</p>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
