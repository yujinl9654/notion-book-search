export default function SearchPanel({
  inputValue,
  isSubmitting,
  onChange,
  onSubmit,
}) {
  return (
    <section className="border-white/12 bg-[#11131d]/78 rounded-[32px] border p-5 shadow-[0_30px_100px_rgba(6,8,18,0.45)] backdrop-blur md:p-7">
      <div className="max-w-2xl space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-coral-200/90">
          Book Search Harness
        </p>
        <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
          책을 찾는 가장 작은 화면부터
          <span className="block text-sand-200">명확하게 시작합니다.</span>
        </h1>
        <p className="max-w-xl text-sm leading-7 text-slate-300 md:text-base">
          React와 Tailwind로 만든 첫 검색 화면입니다. 지금은 목 데이터로
          동작하며, 검색 상태를 명확하게 나누는 데 집중합니다.
        </p>
      </div>

      <form className="mt-8 grid gap-3 md:grid-cols-[1fr_auto]" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="book-search-input">
          도서 검색어
        </label>
        <input
          autoComplete="off"
          className="min-h-14 rounded-2xl border border-white/10 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-coral-300 focus:ring-4 focus:ring-coral-200/30"
          id="book-search-input"
          name="query"
          onChange={onChange}
          placeholder="제목, 저자, 출판사, ISBN으로 검색"
          value={inputValue}
        />
        <button
          className="min-h-14 rounded-2xl bg-coral-300 px-6 text-sm font-semibold text-slate-950 transition hover:bg-coral-200 focus:outline-none focus:ring-4 focus:ring-coral-100/60 disabled:cursor-not-allowed disabled:bg-coral-100/70"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "검색 중..." : "검색하기"}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300/90">
        <span className="bg-white/6 rounded-full border border-white/10 px-3 py-1.5">
          예시: 불편한 편의점
        </span>
        <span className="bg-white/6 rounded-full border border-white/10 px-3 py-1.5">
          예시: 한강
        </span>
        <span className="bg-white/6 rounded-full border border-white/10 px-3 py-1.5">
          예시: 9788990982575
        </span>
        <span className="bg-white/6 rounded-full border border-white/10 px-3 py-1.5">
          오류 확인: error 입력
        </span>
      </div>
    </section>
  );
}

