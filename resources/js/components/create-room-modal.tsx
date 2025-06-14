'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface CreateRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
    const [roomName, setRoomName] = useState('');
    const [description, setDescription] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [roomNameError, setRoomNameError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const maxChars = 500;

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        if (text.length <= maxChars) {
            setDescription(text);
            setCharCount(text.length);
        }
    };

    const validateRoomName = (name: string) => {
        if (!name.trim()) {
            return 'Room name is required';
        }
        return '';
    };

    const handleRoomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setRoomName(newName);
        setRoomNameError(validateRoomName(newName));
    };

    const handleRoomNameBlur = () => {
        setRoomNameError(validateRoomName(roomName));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const nameError = validateRoomName(roomName);
        setRoomNameError(nameError);

        if (nameError) {
            setIsSubmitting(false);
            return;
        }

        try {
            await router.post(
                route('rooms.store'),
                {
                    name: roomName,
                    description: description,
                },
                {
                    onSuccess: () => {
                        setRoomName('');
                        setDescription('');
                        setCharCount(0);
                        onClose();
                    },
                    onError: (errors) => {
                        if (errors.name) {
                            setRoomNameError(errors.name);
                        }
                    },
                    onFinish: () => {
                        setIsSubmitting(false);
                    },
                },
            );
        } catch (error) {
            console.error('Error creating room:', error);
            setIsSubmitting(false);
        }
    };

    const isCreateButtonDisabled = !!roomNameError || !roomName.trim() || isSubmitting;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="p-0 sm:max-w-[500px]">
                <DialogHeader className="border-b px-6 py-4">
                    <DialogTitle className="ml-8 text-xl font-bold text-gray-600">Create Room</DialogTitle>
                    <DialogDescription>Fill in the details to create your new room.</DialogDescription>
                </DialogHeader>

                <div className="px-6 py-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-6">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">Room Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="roomName" className="sr-only">
                                        Room Name
                                    </Label>
                                    <Input
                                        id="roomName"
                                        value={roomName}
                                        onChange={handleRoomNameChange}
                                        onBlur={handleRoomNameBlur}
                                        placeholder="Room Name"
                                        className={`border-gray-300 bg-white ${roomNameError ? 'border-red-500' : ''}`}
                                        required
                                    />
                                    {roomNameError && <p className="mt-1 text-sm text-red-500">{roomNameError}</p>}
                                </div>
                                <div className="relative">
                                    <Label htmlFor="description" className="sr-only">
                                        Room Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={handleDescriptionChange}
                                        placeholder="Room Description"
                                        className="min-h-[120px] resize-none border-gray-300 bg-white"
                                        maxLength={maxChars}
                                    />
                                    <div className="absolute right-2 bottom-2 text-xs text-gray-400">
                                        {charCount}/{maxChars}
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
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        disabled={isCreateButtonDisabled}
                    >
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
