import AppLayout from '@/layouts/app-layout';
import { type User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Globe, Lock, Settings } from 'lucide-react';

interface Props {
    user: User;
}

const mockPhotos: number[] = Array.from({ length: 6 }, (_, i) => i);

export default function Show({ user }: Props) {
    return (
        <AppLayout>
            <Head title={`${user.name} (@${user.username})`} />
            <div className="w-full px-6 pt-12 sm:px-10">
                {/* Profile Header */}
                <div className="flex justify-center pb-2">
                    <div className="flex flex-col items-center gap-2">
                        {/* Avatar */}
                        <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-800 shadow-inner">
                            <p className="text-2xl  dark:text-white">{user.name.charAt(0).toUpperCase()}</p>
                        </div>

                        {/* Name + Settings in one row */}
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                            <Link href={route('appearance')} className="rounded-full p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800">
                                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </Link>
                        </div>

                        {/* Username */}
                        <p className="text-gray-500 dark:text-gray-300">@{user.username}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-8 flex justify-center gap-10 text-center">
                    {[
                        { label: 'Favourites', value: 0 },
                        { label: 'Work', value: 0 },
                        { label: 'Room', value: 0 },
                    ].map((stat) => (
                        <div key={stat.label}>
                            <div className="text-xl font-semibold text-gray-800 dark:text-white">{stat.value}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-300">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="mt-10 mb-6 flex justify-center gap-10 border-b pb-2">
                    <button className="flex items-center gap-2 border-b-2 border-black pb-1 font-medium text-black dark:border-white dark:text-white">
                        <Globe className="h-5 w-5" /> Post
                    </button>
                    <button className="flex items-center gap-2 pb-1 font-medium text-gray-500 hover:border-b-2 hover:border-gray-400 hover:text-black dark:text-gray-300 dark:hover:border-gray-300 dark:hover:text-white">
                        <Lock className="h-5 w-5" /> Private
                    </button>
                </div>

                {/* Photo Grid */}
                <div className="grid grid-cols-2 gap-2 pb-20 sm:grid-cols-3 md:grid-cols-4">
                    {mockPhotos.map((i) => (
                        <div
                            key={i}
                            className="aspect-square bg-gradient-to-tr from-indigo-500 to-blue-700 shadow-md transition-transform hover:scale-105"
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
