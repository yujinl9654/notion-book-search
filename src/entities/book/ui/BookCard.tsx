import type { Book } from "../model/types";

const fallbackCoverLabel = "표지 없음";

interface BookCoverProps {
  thumbnail: string;
  title: string;
}

interface MetadataRowProps {
  label: string;
  value?: string;
}

interface BookCardProps {
  book: Book;
}

function BookCover({ thumbnail, title }: BookCoverProps) {
  if (!thumbnail) {
    return (
      <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded border border-dashed border-slate-200 bg-slate-50 text-center text-[0.6rem] font-medium leading-4 text-slate-400">
        {fallbackCoverLabel}
      </div>
    );
  }

  return (
    <img
      alt={`${title} 표지`}
      className="h-16 w-12 shrink-0 rounded object-cover"
      src={thumbnail}
    />
  );
}

function MetadataRow({ label, value }: MetadataRowProps) {
  if (!value) {
    return null;
  }

  return (
    <div className="flex min-w-0 items-center gap-1 text-xs text-slate-500">
      <span className="shrink-0 text-slate-400">{label}</span>
      <span className="truncate">{value}</span>
    </div>
  );
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <article className="grid grid-cols-[auto_1fr] gap-3 rounded-md border border-transparent p-2 transition hover:border-slate-200 hover:bg-slate-50">
      <BookCover thumbnail={book.thumbnail} title={book.title} />
      <div className="min-w-0 space-y-1">
        <h3 className="truncate text-sm font-semibold text-slate-950">
          {book.title}
        </h3>

        <div className="flex min-w-0 flex-wrap gap-x-3 gap-y-1">
          <MetadataRow label="저자" value={book.author} />
          <MetadataRow label="출판사" value={book.publisher} />
          <MetadataRow label="출간" value={book.publishedAt} />
        </div>

        <MetadataRow label="ISBN" value={book.isbn} />
      </div>
    </article>
  );
}
