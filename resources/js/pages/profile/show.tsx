import ViewPostModal from '@/components/view-post-modal';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Globe, Lock, Settings } from 'lucide-react';
import { useState } from 'react';
// Assuming you have route helper available globally or imported

// Helper function to get first cover image
const getFirstCoverImage = (coverImage: string | string[]): string => {
    if (Array.isArray(coverImage)) {
        return coverImage[0] || '';
    }
    try {
        const parsed = JSON.parse(coverImage);
        return Array.isArray(parsed) ? parsed[0] || '' : coverImage;
    } catch {
        return coverImage;
    }
};

// Consider defining a type for audiobook data for better type safety
interface AudiobookData {
    id: number;
    title: string;
    description: string;
    cover_image: string | string[] | null; // Updated to handle array of images
    // Add other properties as needed, like user if it's nested
    user?: {
        // Optional user relationship if needed for author name elsewhere
        name: string;
    };
    is_public: boolean;
}

// Consider defining a type for user data
interface UserData {
    id: number;
    name: string;
    username: string;
    // Add other user properties
}

interface Props {
    user: UserData; // Use UserData type
    audiobooks: AudiobookData[]; // Use AudiobookData type
}

export default function Show({ user, audiobooks }: Props) {
    // If props are not passed directly, fallback to usePage
    const page = usePage();
    const authUser = (page.props as any)?.auth?.user;
    // Use the passed audiobooks prop if available, otherwise fallback
    const books = audiobooks ?? (page.props as any).audiobooks ?? [];

    // Tab state: 'public' or 'private'
    const [activeTab, setActiveTab] = useState<'public' | 'private'>('public');
    const [selectedAudiobookId, setSelectedAudiobookId] = useState<number | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // Filter books based on tab
    const filteredBooks = books.filter((book: AudiobookData) => (activeTab === 'public' ? book.is_public : !book.is_public));

    const isOwner = authUser && authUser.id === user.id;

    const handleAudiobookClick = (audiobookId: number) => {
        setSelectedAudiobookId(audiobookId);
        setIsViewModalOpen(true);
    };

    return (
        <AppLayout>
            <Head title={`${user.name} (@${user.username})`} />
            <div className="w-full px-6 pt-12 sm:px-10">
                {/* Profile Header */}
                <div className="flex justify-center pb-2">
                    <div className="flex flex-col items-center gap-2">
                        {/* Avatar */}
                        <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-200 shadow-inner dark:bg-neutral-800">
                            <p className="text-2xl dark:text-white">{user.name.charAt(0).toUpperCase()}</p>
                        </div>

                        {/* Name + Settings in one row */}
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                            {/* Check if this is the authenticated user's profile before showing settings */}
                            {/* Assuming auth() helper or similar is available in your Inertia context */}
                            {/* Example (adjust based on your actual auth check): */}
                            {/* {page.props.auth?.user?.id === user.id && ( */}
                            <Link href={route('appearance')} className="rounded-full p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800">
                                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </Link>
                            {/* )} */}
                        </div>

                        {/* Username */}
                        <p className="text-gray-500 dark:text-gray-300">@{user.username}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-8 flex justify-center gap-10 text-center">
                    {[
                        // You might need to fetch these values if they are not in the `user` prop
                        { label: 'Favourites', value: 0 }, // Placeholder
                        { label: 'Work', value: books.length },
                        { label: 'Room', value: 0 }, // Placeholder
                    ].map((stat) => (
                        <div key={stat.label}>
                            <div className="text-xl font-semibold text-gray-800 dark:text-white">{stat.value}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-300">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="mt-10 mb-6 flex justify-center gap-10 border-b pb-2">
                    <button
                        className={`flex items-center gap-2 pb-1 font-medium ${
                            activeTab === 'public'
                                ? 'border-b-2 border-black text-black dark:border-white dark:text-white'
                                : 'text-gray-500 hover:border-b-2 hover:border-gray-400 hover:text-black dark:text-gray-300 dark:hover:border-gray-300 dark:hover:text-white'
                        }`}
                        onClick={() => setActiveTab('public')}
                    >
                        <Globe className="h-5 w-5" /> Public
                    </button>
                    {isOwner && (
                        <button
                            className={`flex items-center gap-2 pb-1 font-medium ${
                                activeTab === 'private'
                                    ? 'border-b-2 border-black text-black dark:border-white dark:text-white'
                                    : 'text-gray-500 hover:border-b-2 hover:border-gray-400 hover:text-black dark:text-gray-300 dark:hover:border-gray-300 dark:hover:text-white'
                            }`}
                            onClick={() => setActiveTab('private')}
                        >
                            <Lock className="h-5 w-5" /> Private
                        </button>
                    )}
                </div>

                {/* Audiobook Grid */}
                <div className="grid grid-cols-2 gap-2 pb-20 sm:grid-cols-3 md:grid-cols-4">
                    {filteredBooks.length > 0 ? (
                        filteredBooks.map((book: AudiobookData) => (
                            <div
                                key={book.id}
                                className="group relative cursor-pointer overflow-hidden"
                                onClick={() => handleAudiobookClick(book.id)}
                            >
                                <div className="aspect-[4/4] w-full">
                                    <img
                                        src={book.cover_image ? `/storage/${getFirstCoverImage(book.cover_image)}` : '/images/default-cover.png'}
                                        alt={`${book.title} cover`}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex justify-center text-gray-500">
                            No {activeTab === 'public' ? 'public' : 'private'} audiobooks published yet.
                        </div>
                    )}
                </div>

                {/* View Post Modal */}
                <ViewPostModal
                    isOpen={isViewModalOpen}
                    onClose={() => {
                        setIsViewModalOpen(false);
                        setSelectedAudiobookId(null);
                    }}
                    audiobookId={selectedAudiobookId}
                />
            </div>
        </AppLayout>
    );
}
