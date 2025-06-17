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
    <div
      className="
        flex
        h-48            
        w-full      
        gap-4
        border border-gray-200
        bg-gray-300
        dark:bg-black
        shadow-sm
        transition-all hover:shadow-md
      "
    >
      {/* ── Image Container: fixed 48×48 ────────────────────────────── */}
      <div className="w-48 h-48 flex-shrink-0 overflow-hidden">
        <img
          src={coverImage}
          alt={`${title} cover`}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Text Container */}
      <div className="flex flex-col  py-6 px-4 text-sm leading-[1.25rem] flex-1 min-w-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{title}</h3>
          <p className="text-gray-600 dark:text-white">{author}</p>
        </div>

        <p className="mt-2 text-gray-700 dark:text-white line-clamp-5">
          {description}
        </p>
      </div>
    </div>
  );
};
