import type { Book } from "../types/book";

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
      <div className="bg-white/6 flex h-28 w-24 items-center justify-center rounded-2xl border border-dashed border-white/20 text-[0.7rem] font-semibold tracking-[0.2em] text-sand-300/70">
        {fallbackCoverLabel}
      </div>
    );
  }

  return (
    <img
      alt={`${title} 표지`}
      className="h-28 w-24 rounded-2xl object-cover shadow-[0_12px_40px_rgba(13,16,23,0.25)]"
      src={thumbnail}
    />
  );
}

function MetadataRow({ label, value }: MetadataRowProps) {
  if (!value) {
    return null;
  }

  return (
    <div className="text-slate-200/88 flex flex-wrap items-center gap-2 text-sm">
      <span className="bg-white/8 rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-sand-300/90">
        {label}
      </span>
      <span>{value}</span>
    </div>
  );
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <article className="border-white/12 bg-white/8 grid gap-4 rounded-[28px] border p-4 shadow-[0_24px_80px_rgba(8,10,18,0.2)] backdrop-blur md:grid-cols-[auto_1fr] md:p-5">
      <BookCover thumbnail={book.thumbnail} title={book.title} />
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-coral-200/80">
            Book Result
          </p>
          <h3 className="text-xl font-semibold text-white">{book.title}</h3>
        </div>

        <div className="space-y-2.5">
          <MetadataRow label="Author" value={book.author} />
          <MetadataRow label="Publisher" value={book.publisher} />
          <MetadataRow label="Published" value={book.publishedAt} />
          <MetadataRow label="ISBN" value={book.isbn} />
        </div>
      </div>
    </article>
  );
}
