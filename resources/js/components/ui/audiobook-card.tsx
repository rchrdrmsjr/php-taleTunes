import * as React from 'react';
import { cn } from '@/lib/utils';


interface AudiobookCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    author: string;
    coverImage: string;
    description?: string;
}

export function AudiobookCard({
    title,
    author,
    coverImage,
    description,
    className,
    ...props
}: AudiobookCardProps) {
    return (
        <div
            className={cn(
                'group relative overflow-hiddentransition-all hover:shadow-lg',
                className
            )}
            {...props}
        >
            <div className="aspect-[4/4] w-full overflow-hidden">
                <img
                    src={coverImage}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{author}</p>
                {/* {description && (
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">{description}</p>
                )} */}
            </div>
        </div>
    );
} 