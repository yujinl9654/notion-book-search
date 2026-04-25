import type { ChangeEventHandler } from "react";

interface SearchPanelProps {
  inputValue: string;
  isSubmitting: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export default function SearchPanel({
  inputValue,
  isSubmitting,
  onChange,
}: SearchPanelProps) {
  return (
    <section>
      <label className="sr-only" htmlFor="book-search-input">
        도서 검색어
      </label>
      <input
        aria-busy={isSubmitting}
        autoComplete="off"
        className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        id="book-search-input"
        name="query"
        onChange={onChange}
        placeholder="도서명, 저자, ISBN 검색"
        value={inputValue}
      />
    </section>
  );
}
