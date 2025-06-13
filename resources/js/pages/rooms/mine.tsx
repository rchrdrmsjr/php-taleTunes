import CreateRoomModal from '@/components/create-room-modal';
import JoinRoomModal from '@/components/join-room-modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Crown, FolderPlus, FolderSearch, Users } from 'lucide-react';
import { useState } from 'react';

interface Room {
    id: number;
    name: string;
    description: string;
    room_code: string;
    owner: {
        id: number;
        name: string;
    };
    members: Array<{
        id: number;
        name: string;
        pivot: {
            role: string;
            joined_at: string;
        };
    }>;
}

interface Props {
    ownedRooms: Room[];
    joinedRooms: Room[];
}

export default function MyRooms({ ownedRooms = [], joinedRooms = [] }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
    const [isJoinRoomModalOpen, setIsJoinRoomModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const handleLeaveRoom = async (roomId: number) => {
        if (confirm('Are you sure you want to leave this room?')) {
            router.post(route('rooms.leave', roomId));
        }
    };

    const handleDeleteRoom = async (roomId: number) => {
        if (confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
            router.delete(route('rooms.destroy', roomId));
        }
    };

    // Get user initials for avatar
    const getUserInitials = (name: string) => {
        return name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const RoomCard = ({ room, isOwner }: { room: Room; isOwner: boolean }) => (
        <div className="flex h-48 w-full items-center gap-6 rounded-xl border border-gray-200 p-6 shadow-sm transition-all hover:shadow-md">
            {/* Room Avatar */}
            <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white text-2xl font-semibold text-blue-600">
                    {getUserInitials(room.name)}
                </div>
                {isOwner && (
                    <div className="absolute -top-2 -right-2 rounded-full bg-amber-100 p-1 text-amber-800">
                        <Crown className="h-4 w-4" />
                    </div>
                )}
            </div>

            {/* Room Info */}
            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">Code: {room.room_code}</span>
                        <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                            <Users className="h-3 w-3" />
                            {room.members.length} members
                        </span>
                    </div>
                    {/* {room.description && <p className="mt-2 line-clamp-2 text-sm text-gray-600">{room.description}</p>} */}
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Owner: <span className="font-medium">{room.owner.name}</span>
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.visit(route('rooms.show', room.id))}>
                            View Details
                        </Button>
                        {isOwner ? (
                            <Button size="sm" onClick={() => handleDeleteRoom(room.id)}>
                                Delete
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" onClick={() => handleLeaveRoom(room.id)}>
                                Leave
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AppLayout>
            <Head title="My Rooms" />
            <div className="container mx-auto px-4">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold"></h1>
                    {/* <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => setIsJoinRoomModalOpen(true)} className="flex items-center space-x-2">
                            <FolderSearch className="h-4 w-4" />
                            <span>Join Room</span>
                        </Button>
                        <Button
                            onClick={() => setIsCreateRoomModalOpen(true)}
                            className="flex items-center space-x-2 bg-blue-800 text-white hover:bg-blue-700"
                        >
                            <FolderPlus className="h-4 w-4" />
                            <span>Create Room</span>
                        </Button>
                    </div> */}
                </div>

                {/* Owned Rooms */}
                {ownedRooms.length > 0 && (
                    <div className="mb-8">
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">My Created Rooms</h2>
                        <div className="grid gap-4">
                            {ownedRooms.map((room) => (
                                <RoomCard key={room.id} room={room} isOwner={true} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Joined Rooms */}
                {joinedRooms.length > 0 && (
                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">Joined Rooms</h2>
                        <div className="grid gap-4">
                            {joinedRooms.map((room) => (
                                <RoomCard key={room.id} room={room} isOwner={false} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {ownedRooms.length === 0 && joinedRooms.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-lg font-semibold">No rooms found.</p>
                        <p className="mt-2 text-sm">It looks like you haven't joined or created any rooms yet.</p>
                        <p className="mt-1 text-sm">Ask your room owner for an invite code or create a new room to get started!</p>

                        {/* Original Tagalog (optional, keep commented or remove based on needs) */}
                        {/* <p className="mt-4 text-xs text-gray-400">
            Wala ka pang rooms. Magtanong ka kay Moriel para ma-invite ka.
        </p> */}
                    </div>
                )}
            </div>

            {/* Modals */}
            <CreateRoomModal isOpen={isCreateRoomModalOpen} onClose={() => setIsCreateRoomModalOpen(false)} />
            <JoinRoomModal isOpen={isJoinRoomModalOpen} onClose={() => setIsJoinRoomModalOpen(false)} />
        </AppLayout>
    );
}
