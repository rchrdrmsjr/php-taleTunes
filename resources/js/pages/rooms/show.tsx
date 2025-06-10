import RoomAudiobookUploadModal from '@/components/room-audiobook-upload-modal';
import { AudiobookCard } from '@/components/ui/audiobook-card';
import { Button } from '@/components/ui/button';
import ViewPostModal from '@/components/view-post-modal';
import AppLayout from '@/layouts/app-layout';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, BadgeCheck, Calendar, Crown, Shield, Star, Upload, Users, Zap } from 'lucide-react';
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
    audiobooks: Array<{
        id: number;
        title: string;
        description: string;
        cover_image: string;
        user: {
            name: string;
        };
    }>;
}

interface Props {
    room: Room;
}

export default function ShowRoom({ room }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedAudiobookId, setSelectedAudiobookId] = useState<number | null>(null);

    const handleLeaveRoom = async () => {
        if (confirm('Are you sure you want to leave this room?')) {
            router.post(route('rooms.leave', room.id));
        }
    };

    const handleDeleteRoom = async () => {
        if (confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
            router.delete(route('rooms.destroy', room.id));
        }
    };

    const getFirstCoverImage = (coverImage: string): string => {
        try {
            const parsed = JSON.parse(coverImage);
            return Array.isArray(parsed) ? parsed[0] : coverImage;
        } catch {
            return coverImage;
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

    // Check if current user is owner
    const isOwner = auth.user && room.owner.id === auth.user.id;

    const handleAudiobookClick = (audiobookId: number) => {
        setSelectedAudiobookId(audiobookId);
        setIsViewModalOpen(true);
    };

    // Enhanced utility functions for corporate features
    const getRoomStats = () => ({
        totalBooks: room.audiobooks.length,
        totalMembers: room.members.length,
        recentActivity: room.audiobooks.length > 0 ? 'Active' : 'Quiet',
        establishedDays: Math.floor((Date.now() - new Date(room.members[0]?.pivot.joined_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24)),
    });

    const stats = getRoomStats();

    return (
        <AppLayout>
            <Head title={`${room.name} - Room Details`} />

            {/* Enhanced Background with Gradient Overlay */}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
                {/* Sophisticated Header with Breadcrumb */}
                <div className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="ghost"
                                onClick={() => router.visit(route('rooms.mine'))}
                                className="group flex items-center gap-2 rounded-xl px-4 py-2 text-slate-600 transition-all duration-200 hover:bg-slate-100/80 hover:text-slate-900"
                            >
                                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                                <span className="font-medium">Back to Rooms</span>
                            </Button>

                            {/* Status Indicator */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-800">
                                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
                                    Live Room
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-8">
                    {/* Executive Room Header */}
                    <div className="relative mb-12">
                        {/* Hero Section with Glass Morphism */}
                        <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 p-8 shadow-2xl md:p-12">
                            {/* Animated Background Pattern */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
                            <div className="bg-[url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'0.03\\'%3E%3Ccircle cx=\\'30\\' cy=\\'30\\' r=\\'4\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] absolute inset-0 opacity-30"></div>

                            <div className="relative z-10">
                                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="flex-1">
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white/90 backdrop-blur-sm">
                                                <BadgeCheck className="h-4 w-4" />
                                                {room.room_code}
                                            </div>
                                            {isOwner && (
                                                <div className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-500/20 px-3 py-2 text-sm font-medium text-amber-200 backdrop-blur-sm">
                                                    <Crown className="h-4 w-4" />
                                                    Owner
                                                </div>
                                            )}
                                        </div>

                                        <h1 className="mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                                            {room.name}
                                        </h1>

                                        {room.description && <p className="max-w-2xl text-lg leading-relaxed text-white/80">{room.description}</p>}

                                        {/* Enhanced Stats Row */}
                                        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                                            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                                                <div className="text-2xl font-bold text-white">{stats.totalBooks}</div>
                                                <div className="text-sm text-white/70">Audiobooks</div>
                                            </div>
                                            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                                                <div className="text-2xl font-bold text-white">{stats.totalMembers}</div>
                                                <div className="text-sm text-white/70">Members</div>
                                            </div>
                                            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                                                <div className="text-2xl font-bold text-white">{stats.establishedDays}</div>
                                                <div className="text-sm text-white/70">Days Active</div>
                                            </div>
                                            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                                                <div className="flex items-center gap-2">
                                                    <Zap className="h-5 w-5 text-emerald-400" />
                                                    <div className="text-sm font-medium text-emerald-300">{stats.recentActivity}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex-shrink-0">
                                        {isOwner ? (
                                            <Button
                                                variant="destructive"
                                                onClick={handleDeleteRoom}
                                                className="rounded-2xl border border-red-500/30 bg-red-600/90 px-8 py-3 text-base font-medium shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-red-700 hover:shadow-xl"
                                            >
                                                Delete Room
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                onClick={handleLeaveRoom}
                                                className="rounded-2xl border border-white/30 bg-white/10 px-8 py-3 text-base font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:shadow-xl"
                                            >
                                                Leave Room
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">
                        {/* Enhanced Audiobooks Section */}
                        <div className="xl:col-span-3">
                            <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-xl backdrop-blur-xl">
                                <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                                    <div>
                                        <h2 className="mb-2 text-2xl font-bold text-slate-900">Digital Library</h2>
                                        <p className="text-slate-600">Curated audiobook collection for this room</p>
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                                                {room.audiobooks.length} {room.audiobooks.length === 1 ? 'Book' : 'Books'}
                                            </span>
                                            {room.audiobooks.length > 0 && (
                                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                                                    <Star className="mr-1 inline h-3 w-3" />
                                                    Premium Collection
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {isOwner && room.audiobooks.length > 0 && (
                                        <Button
                                            onClick={() => setIsUploadModalOpen(true)}
                                            className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-3 text-base font-medium shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                                        >
                                            <Upload className="h-5 w-5 transition-transform group-hover:scale-110" />
                                            Add Audiobook
                                        </Button>
                                    )}
                                </div>

                                {room.audiobooks.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                        {room.audiobooks.map((audiobook, index) => (
                                            <div
                                                key={audiobook.id}
                                                onClick={() => handleAudiobookClick(audiobook.id)}
                                                className="group transform cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                <div className="rounded-2xl border border-slate-200/60 bg-white p-2 shadow-md transition-all duration-300 group-hover:shadow-xl">
                                                    <AudiobookCard
                                                        title={audiobook.title}
                                                        author={audiobook.user.name}
                                                        coverImage={`/storage/${getFirstCoverImage(audiobook.cover_image)}`}
                                                        description={audiobook.description}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white p-12 text-center">
                                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
                                            <Upload className="h-10 w-10 text-blue-600" />
                                        </div>
                                        <h3 className="mb-3 text-xl font-semibold text-slate-900">Ready to Build Your Library</h3>
                                        <p className="mx-auto mb-6 max-w-md leading-relaxed text-slate-600">
                                            {isOwner
                                                ? 'Transform this space into a rich audiobook experience for your team'
                                                : 'Waiting for the room owner to curate the first audiobook collection'}
                                        </p>
                                        {isOwner && (
                                            <Button
                                                onClick={() => setIsUploadModalOpen(true)}
                                                className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-3 text-base font-medium shadow-lg transition-all duration-200 hover:from-indigo-700 hover:to-blue-700 hover:shadow-xl"
                                            >
                                                Launch Your Library
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Premium Members Section */}
                        <div className="xl:col-span-1">
                            <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl backdrop-blur-xl">
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                                            <Shield className="h-5 w-5 text-blue-600" />
                                            Team Members
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-600">Active collaborators</p>
                                    </div>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800">
                                        {room.members.length}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {room.members.map((member, index) => {
                                        const isRoomOwner = member.id === room.owner.id;
                                        const joinedDate = new Date(member.pivot.joined_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        });

                                        return (
                                            <div
                                                key={member.id}
                                                className="group flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-gradient-to-r from-white to-slate-50/50 p-4 transition-all duration-200 hover:border-slate-300/60 hover:shadow-md"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <div className="relative">
                                                    <div
                                                        className={`flex h-12 w-12 items-center justify-center rounded-2xl font-semibold text-white shadow-md ${
                                                            isRoomOwner
                                                                ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                                                                : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                                        }`}
                                                    >
                                                        {getUserInitials(member.name)}
                                                    </div>
                                                    {isRoomOwner && (
                                                        <div className="absolute -top-1 -right-1 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-1 text-white shadow-lg">
                                                            <Crown className="h-3 w-3" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="mb-1 flex items-center gap-2">
                                                        <p className="truncate font-semibold text-slate-900">{member.name}</p>
                                                        {isRoomOwner && (
                                                            <span className="rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-2 py-0.5 text-xs font-medium text-amber-800 shadow-sm">
                                                                Owner
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>Joined {joinedDate}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Team Insights */}
                                <div className="mt-6 rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
                                        <Users className="h-4 w-4 text-blue-600" />
                                        Team Insights
                                    </h4>
                                    <div className="space-y-2 text-sm text-slate-600">
                                        <div className="flex justify-between">
                                            <span>Active since:</span>
                                            <span className="font-medium">{stats.establishedDays} days ago</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Library status:</span>
                                            <span className={`font-medium ${stats.totalBooks > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                {stats.totalBooks > 0 ? 'Growing' : 'Getting Started'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Modals */}
            <RoomAudiobookUploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} roomId={room.id} />

            <ViewPostModal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedAudiobookId(null);
                }}
                audiobookId={selectedAudiobookId}
            />
        </AppLayout>
    );
}
