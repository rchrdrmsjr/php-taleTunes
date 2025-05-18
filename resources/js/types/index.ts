export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavItem {
    title: string;
    href: string;
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
    cover_image: File | null;
    audio_file: File | null;
    category: string;
    is_public: boolean;
    [key: string]: string | File | null | boolean;
}

export interface AudiobookFormErrors {
    title?: string;
    description?: string;
    cover_image?: string;
    audio_file?: string;
    category?: string;
    is_public?: string;
}
