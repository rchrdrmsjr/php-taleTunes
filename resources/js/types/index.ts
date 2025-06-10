export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavItem {
    title: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ComponentType<{ className?: string }>;
}

export interface SharedData {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            avatar?: string;
        } | null;
    };
    [key: string]: any;
}

export interface AudiobookFormData {
    title: string;
    description: string;
    cover_image: File[] | null;
    audio_file: File | null;
    category: string;
    is_public: boolean;
    [key: string]: string | File | File[] | null | boolean;
}

export interface AudiobookFormErrors {
    title?: string;
    description?: string;
    cover_image?: string;
    audio_file?: string;
    category?: string;
    is_public?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface Room {
    id: number;
    name: string;
    description: string;
    is_private: boolean;
    created_at: string;
    updated_at: string;
    user_id: number;
    user: User;
}

export interface Audiobook {
    id: number;
    title: string;
    description: string | null;
    cover_image: string; // JSON string of image paths
    audio_file: string;
    category: 'Fiction' | 'Non-fiction' | 'Biography' | 'Children';
    is_public: boolean;
    created_at: string;
    updated_at: string;
    user_id: number;
}
