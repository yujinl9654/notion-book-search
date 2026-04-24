import {
  startTransition,
  useDeferredValue,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  BookCard,
  searchBooks,
  type Book,
  type RequestStatus,
  type SearchRequestState,
} from "../../../entities/book";
import { SearchPanel } from "../../../features/book-search";

const statusTheme: Record<RequestStatus, string> = {
  empty: "border-white/10 bg-white/5 text-slate-200",
  error: "border-rose-300/30 bg-rose-200/10 text-rose-50",
  idle: "border-white/10 bg-white/5 text-slate-200",
  loading: "border-sand-300/20 bg-sand-200/10 text-sand-50",
  success: "border-emerald-300/20 bg-emerald-200/10 text-emerald-50",
};

const featuredBooks: Book[] = [
  {
    author: "Ryan Holiday",
    id: "sample-1",
    isbn: "9780525538581",
    publishedAt: "2019",
    publisher: "Portfolio",
    thumbnail:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
    title: "Stillness Is the Key",
  },
  {
    author: "이슬아",
    id: "sample-2",
    isbn: "9788998441012",
    publishedAt: "2018",
    publisher: "헤엄",
    thumbnail:
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80",
    title: "일간 이슬아 수필집",
  },
  {
    author: "James Clear",
    id: "sample-3",
    isbn: "9780735211292",
    publishedAt: "2018",
    publisher: "Avery",
    thumbnail: "",
    title: "Atomic Habits",
  },
];

interface StatusBannerProps {
  message: string;
  status: RequestStatus;
}

interface SectionHeaderProps {
  count: number;
  query: string;
  status: RequestStatus;
}

interface EmptyStateProps {
  query: string;
  status: "empty" | "error";
}

function StatusBanner({ message, status }: StatusBannerProps) {
  return (
    <div
      className={`rounded-3xl border px-4 py-4 text-sm leading-7 shadow-[0_18px_60px_rgba(8,10,18,0.18)] backdrop-blur ${statusTheme[status]}`}
    >
      {message}
    </div>
  );
}

function SectionHeader({ count, query, status }: SectionHeaderProps) {
  const titleByStatus: Record<RequestStatus, string> = {
    empty: "다른 키워드로 다시 시도해보세요.",
    error: "검색을 다시 시도할 수 있습니다.",
    idle: "추천 도서 샘플",
    loading: "검색 결과를 불러오는 중",
    success: `${count}권의 결과를 찾았습니다.`,
  };

  return (
    <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-coral-200/85">
          Result State
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
          {titleByStatus[status]}
        </h2>
      </div>
      <p className="text-sm leading-6 text-slate-300">
        {query
          ? `"${query}" 기준으로 현재 상태를 보여주고 있습니다.`
          : "첫 구현은 목 데이터 기반으로 동작합니다."}
      </p>
    </header>
  );
}

function EmptyState({ query, status }: EmptyStateProps) {
  if (status === "error") {
    return (
      <div className="bg-rose-200/8 rounded-[28px] border border-rose-200/20 p-6 text-sm leading-7 text-rose-50">
        <p className="text-base font-semibold">검색 중 오류가 발생했습니다.</p>
        <p className="mt-2 text-rose-50/85">
          개발용 목 검색기는 `error`가 포함된 검색어에서 실패 상태를
          시뮬레이션합니다. 같은 검색어로 다시 시도하거나 다른 키워드로
          확인해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/6 rounded-[28px] border border-white/10 p-6 text-sm leading-7 text-slate-200">
      <p className="text-base font-semibold">
        `{query}`와 일치하는 책을 찾지 못했습니다.
      </p>
      <p className="mt-2 text-slate-300">
        제목 일부, 저자명, ISBN으로 다시 검색해보세요.
      </p>
    </div>
  );
}

export default function BookSearchPage() {
  const [inputValue, setInputValue] = useState("");
  const [requestState, setRequestState] = useState<SearchRequestState>({
    errorMessage: "",
    items: [],
    status: "idle",
    submittedQuery: "",
  });

  const deferredSubmittedQuery = useDeferredValue(requestState.submittedQuery);

  useEffect(() => {
    if (!requestState.submittedQuery) {
      return undefined;
    }

    let isCancelled = false;

    async function runSearch() {
      try {
        const items = await searchBooks(requestState.submittedQuery);

        if (isCancelled) {
          return;
        }

        startTransition(() => {
          setRequestState((current) => ({
            ...current,
            errorMessage: "",
            items,
            status: items.length > 0 ? "success" : "empty",
          }));
        });
      } catch (error) {
        if (isCancelled) {
          return;
        }

        startTransition(() => {
          setRequestState((current) => ({
            ...current,
            errorMessage:
              error instanceof Error
                ? error.message
                : "알 수 없는 오류가 발생했습니다.",
            items: [],
            status: "error",
          }));
        });
      }
    }

    void runSearch();

    return () => {
      isCancelled = true;
    };
  }, [requestState.submittedQuery]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = inputValue.trim();

    if (!trimmedQuery) {
      startTransition(() => {
        setRequestState((current) => ({
          ...current,
          errorMessage: "",
          items: [],
          status: "idle",
          submittedQuery: "",
        }));
      });

      return;
    }

    startTransition(() => {
      setRequestState({
        errorMessage: "",
        items: [],
        status: "loading",
        submittedQuery: trimmedQuery,
      });
    });
  }

  const isSubmitting = requestState.status === "loading";
  const visibleBooks =
    requestState.status === "idle" ? [] : requestState.items;
  const statusMessage =
    requestState.status === "idle"
      ? "검색어를 입력하면 결과, 빈 결과, 오류 상태를 모두 같은 화면에서 확인할 수 있습니다."
      : requestState.status === "loading"
        ? `"${requestState.submittedQuery}" 검색을 진행하고 있습니다.`
        : requestState.status === "success"
          ? `"${requestState.submittedQuery}" 검색이 완료되었습니다.`
          : requestState.status === "empty"
            ? `"${requestState.submittedQuery}" 검색 결과가 없습니다.`
            : requestState.errorMessage;

  return (
    <main className="min-h-screen bg-ink text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
        <SearchPanel
          inputValue={inputValue}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        <StatusBanner message={statusMessage} status={requestState.status} />

        <section className="space-y-6 rounded-[32px] border border-white/10 bg-[#0f1118]/85 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.24)] backdrop-blur md:p-7">
          <SectionHeader
            count={visibleBooks.length}
            query={deferredSubmittedQuery}
            status={requestState.status}
          />

          {(requestState.status === "empty" ||
            requestState.status === "error") && (
            <EmptyState
              query={requestState.submittedQuery}
              status={requestState.status}
            />
          )}

          {requestState.status === "success" && (
            <div className="grid gap-4 [content-visibility:auto]">
              {visibleBooks.map((book) => (
                <BookCard book={book} key={book.id} />
              ))}
            </div>
          )}

          {requestState.status === "idle" && (
            <div className="grid gap-4 [content-visibility:auto] md:grid-cols-2 xl:grid-cols-3">
              {featuredBooks.map((book) => (
                <BookCard book={book} key={book.id} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
