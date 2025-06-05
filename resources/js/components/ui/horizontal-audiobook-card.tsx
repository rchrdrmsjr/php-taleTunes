import { type FC, useMemo } from 'react';

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
  //
  // 1️⃣ Compute an approximate "characters per line" so that 5 lines can hold the entire description.
  //    We divide total length by 5 (number of lines), then round up:
  //
  const charsPerLine = useMemo(() => {
    return Math.ceil(description.length / 5);
  }, [description.length]);

  //
  // 2️⃣ We'll add a small buffer (e.g. +2 ch) to avoid words bumping to an extra line too easily.
  //    Feel free to tweak this "+2" if your font uses more/less punctuation or very long words.
  //
  const textWidthCh = charsPerLine + 2; // e.g. "if 200 total chars, charsPerLine = 40, width = 42ch"

  return (
    <div
      className="
        flex
        h-48            
        w-fit      
        gap-4
        border border-gray-200
        bg-gray-300
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

      {/* ── Text Container ───────────────────────────────────────────── */}
      <div
        className="flex flex-col justify-between py-6 px-4 text-sm leading-[1.25rem]" 
        style={{
          width: `${textWidthCh}ch`,
        }}
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600">by {author}</p>
        </div>

        {/*
          ── Description Box ────────────────────────────────────
          Because we set the container's width = "(charsPerLine + 2)ch" and
          its height = "5 × line-height (1.25rem)" (so 5 lines exactly),
          the browser will wrap the description into ≤5 lines. Since we hide
          overflow, you never get a 6th line. 
          
          If your prose really needs more than 5 lines at that width, the text
          would ordinarily run off the bottom—but because we sized it with a
          big enough "ch" value (based on total characters ÷ 5), it should fit
          in five lines in most realistic text scenarios.
        */}
        <p className="mt-2 text-gray-700 line-clamp-5">
          {description}
        </p>
      </div>
    </div>
  );
};
