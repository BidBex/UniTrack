import React from 'react';

interface HighlightedTextProps {
  text: string;
  query: string;
  className?: string;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  query,
  className = '',
}) => {
  if (!text) return null;
  const trimmed = query.trim();
  if (!trimmed) {
    return <span className={className}>{text}</span>;
  }

  // Escape special regex characters
  const escapedQuery = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === trimmed.toLowerCase();
        if (isMatch) {
          return (
            <mark
              key={index}
              className="rounded-xs bg-amber-300 px-0.5 font-bold text-amber-950 shadow-xs dark:bg-amber-400 dark:text-amber-950"
            >
              {part}
            </mark>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};
