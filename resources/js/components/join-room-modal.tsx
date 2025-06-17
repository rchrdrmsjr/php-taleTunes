'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface JoinRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function JoinRoomModal({ isOpen, onClose }: JoinRoomModalProps) {
    const [roomCode, setRoomCode] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateRoomCode = (code: string) => {
        const regex = /^[a-zA-Z0-9]{6}$/;
        if (!code) {
            return 'Room code is required';
        }
        if (!regex.test(code)) {
            return 'Room code must be exactly 6 letters or numbers';
        }
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const validationError = validateRoomCode(roomCode);
        if (validationError) {
            setError(validationError);
            setIsSubmitting(false);
            return;
        }

        try {
            await router.post(
                route('rooms.join'),
                {
                    room_code: roomCode,
                },
                {
                    onSuccess: () => {
                        setRoomCode('');
                        onClose();
                    },
                    onError: (errors) => {
                        if (errors.room_code) {
                            setError(errors.room_code);
                        } else if (errors.error) {
                            setError(errors.error);
                        }
                    },
                    onFinish: () => {
                        setIsSubmitting(false);
                    },
                },
            );
        } catch (error) {
            console.error('Error joining room:', error);
            setError('An unexpected error occurred. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCode = e.target.value;
        setRoomCode(newCode);
        setError(validateRoomCode(newCode));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="p-0 sm:max-w-[500px]">
                <DialogHeader className="border-b px-6 py-4">
                    <DialogTitle className="ml-8 text-xl font-bold text-gray-600 dark:text-white">Join Room</DialogTitle>
                    <DialogDescription>Enter the room code to join an existing room.</DialogDescription>
                </DialogHeader>

                <div className="px-6 py-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="rounded-lg border border-gray-200 bg-gray-50/50 dark:bg-transparent p-6">
                            <div className="space-y-3">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Room Code</h3>
                                <p className="text-sm text-gray-600 dark:text-white">Ask your owner for the room code, then enter it here.</p>
                                <div className="pt-2">
                                    <Label htmlFor="roomCode" className="sr-only">
                                        Room Code
                                    </Label>
                                    <Input
                                        id="roomCode"
                                        value={roomCode}
                                        onChange={handleInputChange}
                                        placeholder="Enter 6-character room code"
                                        className={`border-gray-300 bg-white text-sm ${error ? 'border-red-500' : ''}`}
                                        required
                                        maxLength={6}
                                    />
                                    {error && (
                                        <div className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                            <p>{error}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-white">To join a room</h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-white">
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Use an authorized account</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Enter the 6-character room code provided by the room owner</span>
                                </li>
                            </ul>
                        </div>
                    </form>
                </div>

                <div className="flex justify-end space-x-3 border-t bg-gray-50/50 dark:bg-transparent px-6 py-4">
                    <Button type="button" variant="outline" onClick={onClose} className="text-gray-600 dark:text-white">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 dark:text-white"
                        disabled={!!error || !roomCode || isSubmitting}
                    >
                        {isSubmitting ? 'Joining...' : 'Join'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
