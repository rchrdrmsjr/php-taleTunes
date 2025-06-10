import AppLayout from '@/layouts/app-layout';
import { Room } from '@/types';
import React from 'react';

interface RoomLayoutProps {
    room: Room;
    children: React.ReactNode;
}

export default function RoomLayout({ room, children }: RoomLayoutProps) {
    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
                    {room.description && <p className="mt-2 text-gray-600">{room.description}</p>}
                </div>
                {children}
            </div>
        </AppLayout>
    );
}
