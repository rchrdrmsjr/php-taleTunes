import { AppHeader, UploadHeader } from '@/components/app-header';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface AppLayoutProps {
    children: React.ReactNode;
    onPublish?: () => void;
    isPublishing?: boolean;
    title?: string;
}

export default function AppLayout({ children, onPublish, isPublishing, title }: AppLayoutProps) {
    const page = usePage<SharedData>();
    const isUploadPage = page.url === '/upload';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
            {isUploadPage ? (
                <UploadHeader title={title || 'Untitled Audio Book'} onPublish={onPublish} isPublishing={isPublishing} />
            ) : (
                <AppHeader breadcrumbs={page.props.breadcrumbs} />
            )}
            <main className="py-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
            </main>
        </div>
    );
}
