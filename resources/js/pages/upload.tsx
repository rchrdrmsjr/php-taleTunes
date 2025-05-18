import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type AudiobookFormData, type AudiobookFormErrors } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
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

export default function Upload() {
    const [isPublic, setIsPublic] = useState(true);
    const [category, setCategory] = useState('');
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showContinueModal, setShowContinueModal] = useState(false);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm<AudiobookFormData>({
        title: '',
        description: '',
        cover_image: null,
        audio_file: null,
        category: '',
        is_public: true,
    });

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('cover_image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('audio_file', file);
        }
    };

    const clearAllFields = () => {
        reset();
        setCategory('');
        setCoverPreview(null);
        setIsPublic(true);
        if (coverInputRef.current) coverInputRef.current.value = '';
        if (audioInputRef.current) audioInputRef.current.value = '';
    };

    const handlePublish = () => {
        // Create FormData object to handle file uploads
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('is_public', data.is_public.toString());

        if (data.cover_image) {
            formData.append('cover_image', data.cover_image);
        }
        if (data.audio_file) {
            formData.append('audio_file', data.audio_file);
        }

        // Validate required fields
        if (!data.title || !data.cover_image || !data.audio_file || !data.category) {
            toast.error('Please fill in all required fields');
            return;
        }

        post(route('audiobooks.store'), {
            ...formData,
            forceFormData: true,
            onSuccess: () => {
                setShowSuccessModal(true);
                toast.success('Audiobook published successfully!');
            },
            onError: (errors: AudiobookFormErrors) => {
                console.error('Upload errors:', errors);
                Object.values(errors).forEach((error) => {
                    toast.error(error);
                });
            },
            onStart: () => {
                console.log('Starting upload...');
            },
            onFinish: () => {
                console.log('Upload finished');
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
    };
    const handleGoToDashboard = () => {
        clearAllFields();
        setShowContinueModal(false);
        router.visit('/dashboard');
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
                            className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white"
                            onClick={() => coverInputRef.current?.click()}
                        >
                            {coverPreview ? (
                                <img src={coverPreview} alt="Cover preview" className="h-full w-full rounded-lg object-cover" />
                            ) : (
                                <>
                                    <ImageIcon className="h-12 w-12" />
                                    <span className="mt-2">Select from computer</span>
                                </>
                            )}
                        </div>
                        <Input id="cover_image" type="file" accept="image/*" className="hidden" ref={coverInputRef} onChange={handleCoverChange} />
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

                            <div className="flex items-center space-x-4">
                                <Label htmlFor="audiobook_category" className="w-24 text-right font-bold">
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
                                                    setCategory('Fiction');
                                                    setData('category', 'Fiction');
                                                }}
                                            >
                                                <CheckIcon className="mr-2 h-4 w-4" />
                                                Fiction
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onSelect={() => {
                                                    setCategory('Non-fiction');
                                                    setData('category', 'Non-fiction');
                                                }}
                                            >
                                                <CheckIcon className="mr-2 h-4 w-4" />
                                                Non-fiction
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onSelect={() => {
                                                    setCategory('Biography');
                                                    setData('category', 'Biography');
                                                }}
                                            >
                                                <CheckIcon className="mr-2 h-4 w-4" />
                                                Biography
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onSelect={() => {
                                                    setCategory('Children');
                                                    setData('category', 'Children');
                                                }}
                                            >
                                                <CheckIcon className="mr-2 h-4 w-4" />
                                                Children
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
