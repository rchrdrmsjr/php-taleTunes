import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import * as React from 'react'; // Import React
import { useState } from 'react'; // Import useState for search toggle
// Use the DropdownMenu you provided
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, // Assuming you'll use this for dropdown items
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // Adjusted import
// NavigationMenu is used for the original mainNavItems, decide if Browse/Room use this or simple buttons for triggers
import { Input } from '@/components/ui/input'; // Import your Input component
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    BookAudio,
    BookOpen,
    ChevronDown,
    Folder,
    FolderHeart,
    FolderPlus,
    FolderSearch,
    Home,
    LayoutGrid,
    Menu,
    Search,
    Upload,
} from 'lucide-react'; // Added Upload, ChevronDown, Home, Users
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';
import CreateRoomModal from './create-room-modal';
import JoinRoomModal from './join-room-modal';
import { NotFoundModal } from './not-found-modal'; // Import NotFoundModal
import ViewPostModal from './view-post-modal'; // Import ViewPostModal

// --- Your Original Nav Items ---
const mainNavItemsOriginal: NavItem[] = [
    // Renamed to avoid conflict if you reuse parts
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];

const rightNavItemsOriginal: NavItem[] = [
    // Renamed
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];
// --- End Original Nav Items ---

// --- New Nav Items for Dropdowns & Mobile ---
const browseNavItems: NavItem[] = [
    { title: 'Home', href: route('dashboard'), icon: Home },
    { title: 'All audiobooks', href: route('audiobooks.all'), icon: BookAudio },
];

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isJoinRoomModalOpen, setIsJoinRoomModalOpen] = useState(false);
    const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
    const [isBrowseDropdownOpen, setIsBrowseDropdownOpen] = useState(false);
    const [isRoomsDropdownOpen, setIsRoomsDropdownOpen] = useState(false);
    const [selectedAudiobookIdForSearch, setSelectedAudiobookIdForSearch] = useState<number | null>(null); // New state
    const [isViewModalOpenFromSearch, setIsViewModalOpenFromSearch] = useState(false); // New state
    const [isNotFoundModalOpen, setIsNotFoundModalOpen] = useState(false); // New state for not found modal

    const roomNavItems: NavItem[] = [
        { title: 'My Rooms', href: '/rooms/mine', icon: FolderHeart },
        {
            title: 'Join Room',
            onClick: () => {
                setIsJoinRoomModalOpen(true);
                setIsRoomsDropdownOpen(false); // Close dropdown when modal opens
            },
            icon: FolderSearch,
        },
        {
            title: 'Create Room',
            onClick: () => {
                setIsCreateRoomModalOpen(true);
                setIsRoomsDropdownOpen(false); // Close dropdown when modal opens
            },
            icon: FolderPlus,
        },
    ];

    // const toggleSearch = () => {
    //     setIsSearchVisible(!isSearchVisible);
    //     if (isSearchVisible) {
    //         // If closing, clear search term
    //         setSearchTerm('');
    //     }
    // };

    const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            try {
                const response = await fetch(route('audiobooks.searchByCode', { code: searchTerm.trim() }));
                const data = await response.json();

                if (response.ok && data.audiobook && data.audiobook.id) {
                    setSelectedAudiobookIdForSearch(data.audiobook.id);
                    setIsViewModalOpenFromSearch(true);
                } else if (response.status === 404) {
                    setIsNotFoundModalOpen(true);
                } else if (data.errors && data.errors.code) {
                    alert(data.errors.code);
                } else {
                    alert('An error occurred during search.');
                }
            } catch (error) {
                console.error('Search error:', error);
                alert('An error occurred during search.');
            }
            setSearchTerm(''); // Clear search term after submission
        }
    };

    return (
        <>
            <Head>
                <link rel="icon" type="image/png" href="/images/Logo.png" />
            </Head>
            <div className="border-sidebar-border/80 border-b">
                <div className="mx-auto flex h-16 items-center gap-2 px-4 md:max-w-7xl md:gap-4">
                    {' '}
                    {/* Added gap */}
                    {/* Mobile Menu Trigger - Kept at the start for mobile */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-1 h-[34px] w-[34px]">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-sidebar flex h-full w-72 flex-col items-stretch justify-between">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetHeader className="border-sidebar-border/80 flex items-center justify-start border-b p-4 text-left">
                                    <AppLogoIcon className="mr-2 h-7 w-7 fill-current text-black dark:text-white" />
                                    <span className="text-lg font-semibold">Menu</span>
                                </SheetHeader>
                                <div className="flex-1 space-y-6 overflow-y-auto p-4">
                                    {/* Mobile Search */}
                                    <form onSubmit={handleSearchSubmit} className="relative">
                                        <Input
                                            type="search"
                                            placeholder="Search..."
                                            className="w-full pr-10"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <Button
                                            type="submit"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
                                        >
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </form>

                                    {/* Mobile Browse */}
                                    <div className="space-y-2">
                                        <h3 className="px-1 text-sm font-medium text-neutral-600 dark:text-neutral-400">Browse</h3>
                                        {browseNavItems.map((item) =>
                                            item.href ? (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    className="flex items-center space-x-3 rounded-md p-2 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                >
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ) : (
                                                <button
                                                    key={item.title}
                                                    onClick={item.onClick}
                                                    className="flex w-full items-center space-x-3 rounded-md p-2 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                >
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    <span>{item.title}</span>
                                                </button>
                                            ),
                                        )}
                                    </div>

                                    {/* Mobile Rooms */}
                                    <div className="space-y-2">
                                        <h3 className="px-1 text-sm font-medium text-neutral-600 dark:text-neutral-400">Rooms</h3>
                                        {roomNavItems.map((item) =>
                                            item.href ? (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    className="flex items-center space-x-3 rounded-md p-2 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                >
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ) : (
                                                <button
                                                    key={item.title}
                                                    onClick={item.onClick}
                                                    className="flex w-full items-center space-x-3 rounded-md p-2 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                >
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    <span>{item.title}</span>
                                                </button>
                                            ),
                                        )}
                                    </div>

                                    {/* Mobile Upload Button */}
                                    <Button asChild className="w-full justify-start">
                                        <Link href="/upload" className="flex items-center space-x-3 p-2 font-medium">
                                            <Upload className="h-5 w-5" />
                                            <span>Upload Content</span>
                                        </Link>
                                    </Button>

                                    {/* Original Main Nav Items (if needed) */}
                                    <div className="space-y-2">
                                        <h3 className="px-1 text-sm font-medium text-neutral-600 dark:text-neutral-400">Main</h3>
                                        {mainNavItemsOriginal.map((item) =>
                                            item.href ? (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    className="flex items-center space-x-3 rounded-md p-2 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                >
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ) : (
                                                <button
                                                    key={item.title}
                                                    onClick={item.onClick}
                                                    className="flex w-full items-center space-x-3 rounded-md p-2 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                >
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    <span>{item.title}</span>
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </div>
                                {/* Footer for external links in mobile */}
                                <div className="border-sidebar-border/80 space-y-2 border-t p-4">
                                    {rightNavItemsOriginal.map((item) => (
                                        <a
                                            key={item.title}
                                            href={item.href || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-3 rounded-md p-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                        >
                                            {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                            <span>{item.title}</span>
                                        </a>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                    {/* Logo */}
                    <Link href="/dashboard" prefetch className="flex flex-shrink-0 items-center space-x-2">
                        {' '}
                        {/* Added flex-shrink-0 */}
                        <AppLogo />
                    </Link>
                    {/* Desktop Navigation - New Structure */}
                    <div className="hidden h-full flex-grow items-center space-x-1 md:space-x-3 lg:flex">
                        {' '}
                        {/* Added flex-grow */}
                        {/* Browse Dropdown */}
                        <DropdownMenu open={isBrowseDropdownOpen} onOpenChange={setIsBrowseDropdownOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-9 px-3 text-sm font-bold">
                                    Browse <ChevronDown className="ml-1 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {browseNavItems.map((item) => (
                                    <DropdownMenuItem key={item.title} asChild>
                                        {item.href ? (
                                            <Link href={item.href} className="flex items-center space-x-2">
                                                {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                                <span>{item.title}</span>
                                            </Link>
                                        ) : (
                                            <button onClick={item.onClick} className="flex w-full items-center space-x-2 px-2 py-1.5 text-sm">
                                                {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                                <span>{item.title}</span>
                                            </button>
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {/* Room Dropdown */}
                        <DropdownMenu open={isRoomsDropdownOpen} onOpenChange={setIsRoomsDropdownOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-9 px-3 text-sm font-bold">
                                    Rooms <ChevronDown className="ml-1 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {roomNavItems.map((item) => (
                                    <DropdownMenuItem key={item.title} asChild>
                                        {item.href ? (
                                            <Link href={item.href} className="flex items-center space-x-2">
                                                {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                                <span>{item.title}</span>
                                            </Link>
                                        ) : (
                                            <button onClick={item.onClick} className="flex w-full items-center space-x-2 px-2 py-1.5 text-sm">
                                                {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                                <span>{item.title}</span>
                                            </button>
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {/* Search Icon and Input - moved beside Dashboard */}
                        <div className="hidden items-center lg:flex">
                            <form onSubmit={handleSearchSubmit} className="relative ml-2 flex items-center">
                                {/* Search Icon inside the input */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="absolute top-2 left-2 h-5 w-5 text-gray-500"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {/* Input with left padding to accommodate the icon */}
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="focus:ring-opacity-50 h-9 w-56 rounded-md border border-gray-300 pr-2 pl-8 transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-blue-500"
                                />
                            </form>
                        </div>
                    </div>
                    {/* Right Aligned Items - Upload, Profile */}
                    <div className="ml-auto flex items-center space-x-1 md:space-x-2">
                        <div className="lg:hidden">
                            {' '}
                            {/* Search icon for smaller screens, opens mobile search or a modal */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="group h-9 w-9 cursor-pointer"
                                onClick={() => {
                                    /* Potentially open a search modal or focus mobile search */ console.log('Mobile search clicked');
                                }}
                            >
                                <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                            </Button>
                        </div>

                        {/* Upload Button */}
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        asChild
                                        className="hidden rounded-full bg-blue-800 px-4 py-3 transition-colors hover:bg-blue-900 lg:inline-flex"
                                    >
                                        <Link href="/upload" className="flex items-center space-x-2">
                                            <Upload className="size-6 text-white opacity-80 hover:opacity-100" />
                                            <span className="font-medium text-white">Upload</span>
                                        </Link>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Upload</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* User Profile Dropdown - Kept from original */}
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="size-10 rounded-full p-1">
                                        <Avatar className="size-8 overflow-hidden rounded-full">
                                            {auth.user.avatar && <AvatarImage src={auth.user.avatar} alt={auth.user.name} />}
                                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button variant="outline" asChild>
                                <Link href={route('login')}>Log In</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            {/* Breadcrumbs - Kept from original */}
            {breadcrumbs.length > 0 && ( // Changed condition to allow single breadcrumb
                <div className="border-sidebar-border/70 flex w-full border-b">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}

            {/* Add modals */}
            <JoinRoomModal
                isOpen={isJoinRoomModalOpen}
                onClose={() => {
                    setIsJoinRoomModalOpen(false);
                }}
            />
            <CreateRoomModal
                isOpen={isCreateRoomModalOpen}
                onClose={() => {
                    setIsCreateRoomModalOpen(false);
                }}
            />
            {/* View Post Modal for Search Results */}
            {isViewModalOpenFromSearch && selectedAudiobookIdForSearch && (
                <ViewPostModal
                    isOpen={isViewModalOpenFromSearch}
                    onClose={() => {
                        setIsViewModalOpenFromSearch(false);
                        setSelectedAudiobookIdForSearch(null);
                    }}
                    audiobookId={selectedAudiobookIdForSearch}
                />
            )}

            <NotFoundModal
                isOpen={isNotFoundModalOpen}
                onClose={() => {
                    setIsNotFoundModalOpen(false);
                }}
            />
        </>
    );
}

// --- Upload Header ---
export function UploadHeader({
    title = 'Untitled Audio Book',
    onPublish,
    isPublishing = false,
}: {
    title?: string;
    onPublish?: () => void;
    isPublishing?: boolean;
}) {
    const handleCancel = () => {
        router.visit('/dashboard', { replace: true });
    };

    return (
        <div className="border-sidebar-border/80 border-b bg-white dark:bg-neutral-900">
            <div className="mx-auto flex h-16 items-center justify-between px-4 md:max-w-7xl">
                {/* Left */}
                <div className="flex flex-col justify-center">
                    <span className="text-xs font-medium text-blue-600">Add Audio Book Info</span>
                    <span className="text-lg font-semibold text-neutral-900 dark:text-white">{title}</span>
                </div>
                {/* Right */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" type="button" onClick={handleCancel} className="text-neutral-500" disabled={isPublishing}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={onPublish}
                        disabled={isPublishing}
                        className="!hover:bg-blue-700 !rounded-md !border-0 !bg-blue-800 !text-white !shadow-none"
                    >
                        {isPublishing ? 'Publishing...' : 'Publish'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
