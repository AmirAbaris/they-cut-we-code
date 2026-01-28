interface TagListProps {
  tags: string[];
  className?: string;
}

export function TagList({ tags, className = "" }: TagListProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
