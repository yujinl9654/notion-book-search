import type { ChangeEventHandler } from "react";

interface SearchPanelProps {
  inputValue: string;
  isSubmitting: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClear: () => void;
}

export default function SearchPanel({
  inputValue,
  isSubmitting,
  onChange,
  onClear,
}: SearchPanelProps) {
  return (
    <section className="shrink-0 font-mono">
      <div className="flex h-11 items-center border-b border-[#9ca3af] px-6">
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-3 w-3 rounded-full bg-[#ff6b74]"
          />
          <span
            aria-hidden="true"
            className="h-3 w-3 rounded-full bg-[#f6c95b]"
          />
          <span
            aria-hidden="true"
            className="h-3 w-3 rounded-full bg-[#68d989]"
          />
          <span className="ml-1 text-base font-medium tracking-normal text-[#69707d]">
            search
          </span>
        </div>

        <div className="ml-auto hidden items-center gap-3 text-sm text-[#c2c6ce] md:flex">
          <span>&quot;&quot;로 감쌌거나 버튼을 클릭하세요 -&gt;</span>
          <span>[정확히 일치]</span>
          <button
            className="text-[#596171] transition hover:text-[#111827] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9ca3af]"
            onClick={onClear}
            type="button"
          >
            [clear]
          </button>
        </div>
      </div>

      <div className="flex h-14 items-center gap-3 px-7">
        <span
          aria-hidden="true"
          className="text-base font-semibold text-[#00cf45]"
        >
          $
        </span>
        <span className="text-base font-semibold text-[#69707d]">find</span>
        <svg
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-[#8c939f]"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
          />
        </svg>

        <label className="sr-only" htmlFor="book-search-input">
          도서 검색어
        </label>
        <input
          aria-busy={isSubmitting}
          autoComplete="off"
          className="h-full min-w-0 flex-1 border-0 bg-transparent text-base font-semibold tracking-normal text-[#111827] outline-none placeholder:text-[#9ca3af]"
          id="book-search-input"
          name="query"
          onChange={onChange}
<<<<<<< feat-naver-book-search-infinite-scroll
          placeholder="github"
=======
          placeholder="도서 제목, 저자, ISBN을 입력해 주세요"
>>>>>>> develop
          value={inputValue}
        />
      </div>
    </section>
  );
}
