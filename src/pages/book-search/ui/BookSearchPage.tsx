import {
  startTransition,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type UIEvent,
} from "react";

import {
  BookCard,
  searchBooks,
  type RequestStatus,
  type SearchRequestState,
} from "../../../entities/book";
import { SearchPanel } from "../../../features/book-search";

const SEARCH_DEBOUNCE_MS = 350;
const SCROLL_BOTTOM_THRESHOLD_PX = 24;

interface DropdownMessageProps {
  query: string;
  status: Exclude<RequestStatus, "idle" | "success">;
  text?: string;
}

function DropdownMessage({ query, status, text }: DropdownMessageProps) {
  const messageByStatus: Record<DropdownMessageProps["status"], string> = {
    empty: `"${query}"와 일치하는 책을 찾지 못했습니다.`,
    error: text ?? "검색 중 오류가 발생했습니다.",
    loading: `"${query}" 검색 중입니다.`,
  };

  return (
    <div
      className="rounded-md border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600"
      role={status === "error" ? "alert" : "status"}
    >
      {messageByStatus[status]}
    </div>
  );
}

export default function BookSearchPage() {
  const [inputValue, setInputValue] = useState("");
  const [requestState, setRequestState] = useState<SearchRequestState>({
    errorMessage: "",
    items: [],
    isLoadingNextPage: false,
    nextStart: null,
    status: "idle",
    submittedQuery: "",
    total: 0,
  });
  const isLoadingNextPageRef = useRef(false);

  useEffect(() => {
    const trimmedQuery = inputValue.trim();

    if (!trimmedQuery) {
      startTransition(() => {
        setRequestState({
          errorMessage: "",
          items: [],
          isLoadingNextPage: false,
          nextStart: null,
          status: "idle",
          submittedQuery: "",
          total: 0,
        });
      });

      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      startTransition(() => {
        setRequestState({
          errorMessage: "",
          items: [],
          isLoadingNextPage: false,
          nextStart: null,
          status: "loading",
          submittedQuery: trimmedQuery,
          total: 0,
        });
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [inputValue]);

  useEffect(() => {
    if (!requestState.submittedQuery) {
      return undefined;
    }

    let isCancelled = false;
    const abortController = new AbortController();

    async function runSearch() {
      try {
        const result = await searchBooks(requestState.submittedQuery, {
          signal: abortController.signal,
          start: 1,
        });

        if (isCancelled) {
          return;
        }

        startTransition(() => {
          setRequestState((current) => ({
            ...current,
            errorMessage: "",
            items: result.items,
            nextStart: result.nextStart,
            status: result.items.length > 0 ? "success" : "empty",
            total: result.total,
          }));
        });
      } catch (error) {
        if (isCancelled || abortController.signal.aborted) {
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
      abortController.abort();
    };
  }, [requestState.submittedQuery]);

  async function loadNextPage() {
    if (
      requestState.status !== "success" ||
      requestState.nextStart === null ||
      isLoadingNextPageRef.current
    ) {
      return;
    }

    isLoadingNextPageRef.current = true;

    startTransition(() => {
      setRequestState((current) => ({
        ...current,
        errorMessage: "",
        isLoadingNextPage: true,
      }));
    });

    try {
      const result = await searchBooks(requestState.submittedQuery, {
        start: requestState.nextStart,
      });

      startTransition(() => {
        setRequestState((current) => {
          if (current.submittedQuery !== requestState.submittedQuery) {
            return current;
          }

          return {
            ...current,
            errorMessage: "",
            isLoadingNextPage: false,
            items: [...current.items, ...result.items],
            nextStart: result.nextStart,
            total: result.total,
          };
        });
      });
    } catch (error) {
      startTransition(() => {
        setRequestState((current) => {
          if (current.submittedQuery !== requestState.submittedQuery) {
            return current;
          }

          return {
            ...current,
            errorMessage:
              error instanceof Error
                ? error.message
                : "알 수 없는 오류가 발생했습니다.",
            isLoadingNextPage: false,
          };
        });
      });
    } finally {
      isLoadingNextPageRef.current = false;
    }
  }

  function handleResultsScroll(event: UIEvent<HTMLDivElement>) {
    const target = event.currentTarget;
    const remainingScroll =
      target.scrollHeight - target.scrollTop - target.clientHeight;

    if (remainingScroll <= SCROLL_BOTTOM_THRESHOLD_PX) {
      void loadNextPage();
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  function handleClear() {
    setInputValue("");
    isLoadingNextPageRef.current = false;
  }

  const isSubmitting = requestState.status === "loading";

  return (
    <main className="min-h-screen bg-white px-3 py-3 text-slate-950">
      <div className="mx-auto w-full max-w-[2048px]">
        <section
          className="flex w-full flex-col overflow-hidden rounded-[22px] border-2 border-[#9ca3af] bg-white p-0"
          data-testid="book-search-widget"
        >
          <SearchPanel
            inputValue={inputValue}
            isSubmitting={isSubmitting}
            onChange={handleChange}
            onClear={handleClear}
          />

          <div
            className="max-h-[420px] min-h-0 overflow-y-auto bg-white px-4 pb-4 empty:hidden"
            data-testid="book-search-results"
            onScroll={handleResultsScroll}
          >
            {requestState.status === "success" ? (
              <>
                <div className="space-y-1" role="listbox">
                  {requestState.items.map((book) => (
                    <BookCard book={book} key={book.id} />
                  ))}
                </div>

                {requestState.isLoadingNextPage ? (
                  <div
                    className="mt-2 rounded-md border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600"
                    role="status"
                  >
                    다음 결과를 불러오는 중입니다.
                  </div>
                ) : null}

                {requestState.errorMessage ? (
                  <div
                    className="mt-2 rounded-md border border-red-100 bg-red-50 px-3 py-3 text-sm text-red-700"
                    role="alert"
                  >
                    {requestState.errorMessage}
                  </div>
                ) : null}
              </>
            ) : null}

            {requestState.status === "loading" ? (
              <DropdownMessage
                query={requestState.submittedQuery}
                status={requestState.status}
              />
            ) : null}

            {requestState.status === "empty" ? (
              <DropdownMessage
                query={requestState.submittedQuery}
                status={requestState.status}
              />
            ) : null}

            {requestState.status === "error" ? (
              <DropdownMessage
                query={requestState.submittedQuery}
                status={requestState.status}
                text={requestState.errorMessage}
              />
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
