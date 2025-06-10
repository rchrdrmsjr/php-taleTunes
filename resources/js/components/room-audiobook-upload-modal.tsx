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
import { type AudiobookFormData, type AudiobookFormErrors } from '@/types';
import { useForm } from '@inertiajs/react';
import { CheckIcon, ChevronDownIcon, ImageIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast, Toaster } from 'sonner';

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

    const { data, setData, post, processing, errors, reset } = useForm<AudiobookFormData>({
        title: '',
        description: '',
        cover_image: null,
        audio_file: null,
        category: '',
        is_public: false, // Always false for room audiobooks
    });

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
            setData('audio_file', file);
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

        // Create FormData object to handle file uploads
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('is_public', 'false'); // Always false for room audiobooks
        formData.append('room_id', roomId.toString());

        if (data.cover_image) {
            Array.from(data.cover_image).forEach((file) => {
                formData.append('cover_image[]', file);
            });
        }
        if (data.audio_file) {
            formData.append('audio_file', data.audio_file);
        }

        // Validate required fields
        if (!data.title || !data.cover_image || !data.audio_file || !data.category) {
            toast.error('Please fill in all required fields');
            return;
        }

        let toastId: string | number | undefined;

        post(route('rooms.audiobooks.store', roomId), {
            ...formData,
            forceFormData: true,
            onProgress: (progress) => {
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
                    <DialogTitle className="ml-8 text-xl font-bold text-gray-600">Add Audiobook to Room</DialogTitle>
                </DialogHeader>

                <div className="px-6 py-6">
                    <Toaster position="top-right" />
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {/* Left: Cover Upload */}
                            <div className="md:col-span-1">
                                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6">
                                    <div
                                        className="flex h-40 w-full cursor-pointer flex-col items-center justify-center"
                                        onClick={() => coverInputRef.current?.click()}
                                    >
                                        {coverPreview.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-2">
                                                {coverPreview.map((preview, index) => (
                                                    <img
                                                        key={index}
                                                        src={preview}
                                                        alt={`Cover preview ${index + 1}`}
                                                        className="h-32 w-full rounded-lg object-cover"
                                                    />
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
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex justify-end space-x-3 border-t bg-gray-50/50 px-6 py-4">
                    <Button type="button" variant="outline" onClick={onClose} className="text-gray-600">
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
