import { AppContent } from '@/components/app-content';
import { AppHeader, UploadHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const page = usePage();
    const isUploadPage = page.url === '/upload';
    return (
        <AppShell variant="header">
            {isUploadPage ? <UploadHeader /> : <AppHeader />}
            <AppContent>{children}</AppContent>
        </AppShell>
    );
}
