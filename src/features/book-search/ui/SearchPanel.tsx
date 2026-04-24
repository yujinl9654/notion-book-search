import type { ChangeEventHandler, FormEventHandler } from "react";

interface SearchPanelProps {
  inputValue: string;
  isSubmitting: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export default function SearchPanel({
  inputValue,
  isSubmitting,
  onChange,
  onSubmit,
}: SearchPanelProps) {
  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h1 className="text-base font-semibold text-slate-950">도서 검색</h1>
        <p className="text-sm leading-5 text-slate-500">
          Notion에 추가할 책을 제목, 저자, ISBN으로 찾아보세요.
        </p>
      </div>

      <form className="grid gap-2 sm:grid-cols-[1fr_auto]" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="book-search-input">
          도서 검색어
        </label>
        <input
          autoComplete="off"
          className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          id="book-search-input"
          name="query"
          onChange={onChange}
          placeholder="예: 불편한 편의점, 한강, 9788990982575"
          value={inputValue}
        />
        <button
          className="h-11 rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "검색 중..." : "검색"}
        </button>
      </form>
    </section>
  );
}
