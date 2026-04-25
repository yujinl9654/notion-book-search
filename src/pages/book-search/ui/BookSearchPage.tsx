import {
  startTransition,
  useEffect,
  useState,
  type ChangeEvent,
} from "react";

import {
  BookCard,
  searchBooks,
  type RequestStatus,
  type SearchRequestState,
} from "../../../entities/book";
import { SearchPanel } from "../../../features/book-search";

const SEARCH_DEBOUNCE_MS = 350;

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
    status: "idle",
    submittedQuery: "",
  });

  useEffect(() => {
    const trimmedQuery = inputValue.trim();

    if (!trimmedQuery) {
      startTransition(() => {
        setRequestState({
          errorMessage: "",
          items: [],
          status: "idle",
          submittedQuery: "",
        });
      });

      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      startTransition(() => {
        setRequestState({
          errorMessage: "",
          items: [],
          status: "loading",
          submittedQuery: trimmedQuery,
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

  const isSubmitting = requestState.status === "loading";

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <div className="mx-auto w-full max-w-xl px-3 py-3">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <SearchPanel
            inputValue={inputValue}
            isSubmitting={isSubmitting}
            onChange={handleChange}
          />

          {requestState.status !== "idle" ? (
            <div className="mt-3 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
              {requestState.status === "success" ? (
                <div
                  className="max-h-80 space-y-1 overflow-y-auto"
                  role="listbox"
                >
                  {requestState.items.map((book) => (
                    <BookCard book={book} key={book.id} />
                  ))}
                </div>
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
          ) : null}
        </section>
      </div>
    </main>
  );
}
