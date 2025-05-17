import { type FC } from 'react';

interface HorizontalAudiobookCardProps {
    title: string;
    author: string;
    coverImage: string;
    description: string; 
}

export const HorizontalAudiobookCard: FC<HorizontalAudiobookCardProps> = ({
    title,
    author,
    coverImage,
    description,
}) => {
    return (
        <div className="flex gap-4 border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
            {/* Image Container - Removed w-48, added flex-1 */}
            {/* Keep h-48 to constrain the card height */}
            <div className="h-48 flex-shrink-0 overflow-hidden flex-1">
                <img
                    src={coverImage}
                    alt={`${title} cover`}
                    // object-cover is usually desired here to fill the image slot
                    className="h-full w-full object-cover"
                />
            </div>
            {/* Text Container - Added flex-1 */}
            <div className="flex flex-col flex-1">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600">by {author}</p>
                </div>
                {/* line-clamp-2 helps control description height */}
                <p className="mt-2 text-sm text-gray-700">{description}</p>
            </div>
        </div>
    );
};