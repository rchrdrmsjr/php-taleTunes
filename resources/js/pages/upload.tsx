import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { Toggle } from '@/components/ui/toggle';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { CheckIcon, ChevronDownIcon, ImageIcon } from 'lucide-react';
import { useState } from 'react';

export default function Upload() {
    const [isPublic, setIsPublic] = useState(true);
    const [category, setCategory] = useState('');

    return (
        <AppLayout>
            <Head title="Upload Audiobook" />

            <div className="flex flex-col gap-8 p-4 md:flex-row">
                {/* Left: Cover Upload */}
                <div className="w-full md:w-1/3">
                    <Card className="flex flex-col items-center justify-center bg-blue-800 p-6 text-white">
                        <div className="flex h-40 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-white">
                            <ImageIcon className="h-12 w-12" />
                            <span className="mt-2">Select from computer</span>
                        </div>
                        <Input id="cover" type="file" accept="image/*" className="hidden" />
                        <Label htmlFor="cover" className="mt-4 w-full">
                            <Button asChild variant="outline" className="w-full border-white text-white hover:bg-white hover:text-blue-600">
                                Browse...
                            </Button>
                        </Label>
                    </Card>
                </div>

                {/* Right: Form */}
                <div className="w-full md:w-2/3">
                    <Card className="p-6">
                        {/* Tab Header */}
                        <div className="mb-6 border-b-2 border-blue-800 pb-2">
                            <h2 className="text-lg font-semibold">Audio Book Details</h2>
                        </div>

                        <form className="space-y-5">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" placeholder="Enter audiobook title" />
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    maxLength={2000}
                                    placeholder="Enter a description..."
                                    className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                />
                                <div className="mt-1 text-right text-xs text-gray-500">0/2000</div>
                            </div>

                            <div>
                                <Label htmlFor="audio">Audio Book File (MP3)</Label>
                                <Input id="audio" type="file" accept="audio/mp3" />
                            </div>

                            <div>
                                <Label htmlFor="category">Category</Label>
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
                                            <DropdownMenuItem onSelect={() => setCategory('Fiction')}>
                                                <CheckIcon className="mr-2 h-4 w-4" />
                                                Fiction
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => setCategory('Non-fiction')}>
                                                <CheckIcon className="mr-2 h-4 w-4" />
                                                Non-fiction
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => setCategory('Biography')}>
                                                <CheckIcon className="mr-2 h-4 w-4" />
                                                Biography
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => setCategory('Children')}>
                                                <CheckIcon className="mr-2 h-4 w-4" />
                                                Children
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Public Toggle */}
                            <div className="mb-4 flex items-center gap-4">
                                {' '}
                                {/* Added some bottom margin */}
                                {/* Public Label */}
                                <span className="text-lg leading-tight font-semibold text-gray-900">Public</span>{' '}
                                {/* Added leading-tight for vertical alignment */}
                                {/* Switch Container (acts as the Track) */}
                                {/* Apply state-based background color and size here */}
                                <div
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${isPublic ? 'bg-blue-600' : 'bg-gray-200'} `}
                                    // Mirror the state to this div to easily control track styles based on state
                                    data-state={isPublic ? 'on' : 'off'}
                                >
                                    {/* The Toggle component acts as the Thumb */}
                                    {/* We style its appearance and control its position based on state */}
                                    {/* The 'size="lg"' prop on Toggle might need to be adjusted or removed */}
                                    <Toggle
                                        pressed={isPublic}
                                        onPressedChange={setIsPublic}
                                        // Apply classes to make Toggle look and move like the thumb
                                        // We use 'data-[state]' on the *Toggle* component itself (which your component likely provides)
                                        className={`/* Position the thumb based on its own data-state attribute */ /* Move 20px to the right */ pointer-events-auto inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out data-[state="off"]:translate-x-0 data-[state="on"]:translate-x-5`}
                                        // Visually hide the text content 'ON'/'OFF' that was inside
                                    >
                                        {/* Accessible label for screen readers */}
                                        <span className="sr-only">{isPublic ? 'On' : 'Off'}</span>
                                        {/* Remove any visible text content like {isPublic ? 'ON' : 'OFF'} from inside the Toggle */}
                                    </Toggle>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400">You can turn your post on and off whenever you want.</p>

                        
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
