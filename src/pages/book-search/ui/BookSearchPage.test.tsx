import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import BookSearchPage from "./BookSearchPage";

const DEBOUNCE_MS = 350;

function createNaverBookResponse({
  display = 1,
  isbn = "9788932034975",
  start = 1,
  title = "채식주의자",
  total = 1,
} = {}) {
  return {
    display,
    items: [
      {
        author: "한강",
        image: "https://example.com/book.jpg",
        isbn,
        pubdate: "20071030",
        publisher: "창비",
        title,
      },
    ],
    start,
    total,
  };
}

function createJsonResponse(body: unknown, ok = true) {
  return {
    json: () => Promise.resolve(body),
    ok,
  } as Response;
}

describe("BookSearchPage", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("renders only the search input without extra description text or a submit button", () => {
    render(<BookSearchPage />);

    expect(screen.getByTestId("book-search-widget")).toHaveClass(
      "rounded-[22px]",
      "border-2",
      "p-0",
    );
    expect(screen.getByLabelText("도서 검색어")).toBeInTheDocument();
    expect(screen.getByText("search")).toBeInTheDocument();
    expect(screen.getByText("find")).toBeInTheDocument();
    expect(screen.queryByText("도서 검색")).not.toBeInTheDocument();
    expect(screen.queryByText(/Notion에 추가할 책/)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "검색" })).not.toBeInTheDocument();
    expect(screen.getByTestId("book-search-results")).toBeEmptyDOMElement();
  });

  it("automatically searches after the debounce delay", async () => {
    let resolveFetch: (response: Response) => void = () => {};
    fetchMock.mockReturnValue(
      new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      }),
    );

    render(<BookSearchPage />);

    fireEvent.change(screen.getByLabelText("도서 검색어"), {
      target: { value: "한강" },
    });

    act(() => {
      vi.advanceTimersByTime(DEBOUNCE_MS - 1);
    });

    expect(screen.queryByText("채식주의자")).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.getByRole("status")).toHaveTextContent('"한강" 검색 중입니다.');
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/naver/books?display=10&query=%ED%95%9C%EA%B0%95&sort=sim&start=1",
      { signal: expect.any(AbortSignal) },
    );

    await act(async () => {
      resolveFetch(createJsonResponse(createNaverBookResponse()));
      await Promise.resolve();
    });

    expect(screen.getByText("채식주의자")).toBeInTheDocument();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByTestId("book-search-results")).toHaveClass(
      "overflow-y-auto",
    );
  });

  it("does not search when the input contains only whitespace", () => {
    render(<BookSearchPage />);

    fireEvent.change(screen.getByLabelText("도서 검색어"), {
      target: { value: "   " },
    });

    act(() => {
      vi.advanceTimersByTime(DEBOUNCE_MS);
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("shows the empty state when the API returns no books", async () => {
    fetchMock.mockResolvedValue(createJsonResponse({ items: [] }));

    render(<BookSearchPage />);

    fireEvent.change(screen.getByLabelText("도서 검색어"), {
      target: { value: "없는책" },
    });

    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_MS);
      await Promise.resolve();
    });

    expect(
      screen.getByText('"없는책"와 일치하는 책을 찾지 못했습니다.'),
    ).toBeInTheDocument();
  });

  it("shows an error state when the API request fails", async () => {
    fetchMock.mockResolvedValue(createJsonResponse({}, false));

    render(<BookSearchPage />);

    fireEvent.change(screen.getByLabelText("도서 검색어"), {
      target: { value: "장애" },
    });

    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_MS);
      await Promise.resolve();
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "검색 서버에 연결하지 못했습니다.",
    );
  });

  it("loads the next page when the results panel reaches the bottom", async () => {
    fetchMock
      .mockResolvedValueOnce(
        createJsonResponse(
          createNaverBookResponse({
            display: 10,
            isbn: "9788932034975",
            start: 1,
            title: "채식주의자",
            total: 11,
          }),
        ),
      )
      .mockResolvedValueOnce(
        createJsonResponse(
          createNaverBookResponse({
            display: 10,
            isbn: "9788954682152",
            start: 11,
            title: "작별인사",
            total: 11,
          }),
        ),
      );

    render(<BookSearchPage />);

    fireEvent.change(screen.getByLabelText("도서 검색어"), {
      target: { value: "한강" },
    });

    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_MS);
      await Promise.resolve();
    });

    const resultsPanel = screen.getByTestId("book-search-results");

    Object.defineProperties(resultsPanel, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 300 },
      scrollTop: { configurable: true, value: 200 },
    });

    await act(async () => {
      fireEvent.scroll(resultsPanel);
      await Promise.resolve();
    });

    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/naver/books?display=10&query=%ED%95%9C%EA%B0%95&sort=sim&start=11",
      { signal: undefined },
    );
    expect(screen.getByText("채식주의자")).toBeInTheDocument();
    expect(screen.getByText("작별인사")).toBeInTheDocument();
  });
});
