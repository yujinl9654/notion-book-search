import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import BookSearchPage from "./BookSearchPage";

const DEBOUNCE_MS = 350;
const SEARCH_LATENCY_MS = 650;

describe("BookSearchPage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("renders only the search input without extra description text or a submit button", () => {
    render(<BookSearchPage />);

    expect(screen.getByTestId("book-search-widget")).toHaveClass(
      "h-[480px]",
      "w-[480px]",
      "p-0",
    );
    expect(screen.getByLabelText("도서 검색어")).toBeInTheDocument();
    expect(screen.queryByText("도서 검색")).not.toBeInTheDocument();
    expect(screen.queryByText(/Notion에 추가할 책/)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "검색" })).not.toBeInTheDocument();
    expect(screen.getByTestId("book-search-results")).toBeEmptyDOMElement();
  });

  it("automatically searches after the debounce delay", async () => {
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

    await act(async () => {
      vi.advanceTimersByTime(SEARCH_LATENCY_MS);
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
      vi.advanceTimersByTime(DEBOUNCE_MS + SEARCH_LATENCY_MS);
    });

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
