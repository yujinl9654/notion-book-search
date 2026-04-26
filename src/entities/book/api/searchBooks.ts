import type { Book } from "../model/types";

const BOOK_SEARCH_ENDPOINT = "/api/naver/books";
const DEFAULT_DISPLAY_COUNT = 10;
const FIRST_RESULT_START = 1;
const MAX_START = 1000;

interface SearchBooksOptions {
  display?: number;
  signal?: AbortSignal;
  start?: number;
}

export interface SearchBooksResult {
  display: number;
  items: Book[];
  nextStart: number | null;
  start: number;
  total: number;
}

interface NaverBookItem {
  author?: string;
  description?: string;
  image?: string;
  isbn?: string;
  link?: string;
  pubdate?: string;
  publisher?: string;
  title?: string;
}

interface NaverBookSearchResponse {
  display?: number;
  items?: NaverBookItem[];
  lastBuildDate?: string;
  start?: number;
  total?: number;
}

function normalize(text: string): string {
  return text.trim();
}

function decodeHtmlFragment(value: string): string {
  if (!value) {
    return "";
  }

  const element = document.createElement("span");
  element.innerHTML = value;

  return element.textContent ?? "";
}

function formatPubdate(pubdate = ""): string {
  if (!/^\d{8}$/.test(pubdate)) {
    return pubdate;
  }

  return `${pubdate.slice(0, 4)}.${pubdate.slice(4, 6)}.${pubdate.slice(6, 8)}`;
}

function toBook(item: NaverBookItem): Book {
  const isbn = decodeHtmlFragment(item.isbn ?? "");
  const title = decodeHtmlFragment(item.title ?? "");

  return {
    author: decodeHtmlFragment(item.author ?? ""),
    id: isbn || item.link || title,
    isbn,
    publishedAt: formatPubdate(item.pubdate),
    publisher: decodeHtmlFragment(item.publisher ?? ""),
    thumbnail: item.image ?? "",
    title,
  };
}

export async function searchBooks(
  query: string,
  options: SearchBooksOptions = {},
): Promise<SearchBooksResult> {
  const normalizedQuery = normalize(query);
  const display = options.display ?? DEFAULT_DISPLAY_COUNT;
  const start = options.start ?? FIRST_RESULT_START;

  if (!normalizedQuery) {
    return {
      display,
      items: [],
      nextStart: null,
      start,
      total: 0,
    };
  }

  const params = new URLSearchParams({
    display: String(display),
    query: normalizedQuery,
    sort: "sim",
    start: String(start),
  });

  const response = await fetch(`${BOOK_SEARCH_ENDPOINT}?${params.toString()}`, {
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error("검색 서버에 연결하지 못했습니다.");
  }

  const data = (await response.json()) as NaverBookSearchResponse;
  const items = (data.items ?? []).map(toBook).filter((book) => book.id);
  const responseDisplay = data.display ?? display;
  const responseStart = data.start ?? start;
  const total = data.total ?? items.length;
  const nextStart = responseStart + responseDisplay;
  const cappedTotal = Math.min(total, MAX_START);

  return {
    display: responseDisplay,
    items,
    nextStart: items.length > 0 && nextStart <= cappedTotal ? nextStart : null,
    start: responseStart,
    total,
  };
}
