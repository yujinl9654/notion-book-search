import { mockBooks } from "./mockBooks";

import type { Book } from "../model/types";

const FAILURE_KEYWORD = "error";
const LATENCY_MS = 650;

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

function matchesQuery(book: Book, query: string): boolean {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return false;
  }

  return [book.title, book.author, book.publisher, book.isbn]
    .filter(Boolean)
    .some((value) => normalize(value).includes(normalizedQuery));
}

export async function searchBooks(query: string): Promise<Book[]> {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, LATENCY_MS);
  });

  if (normalize(query).includes(FAILURE_KEYWORD)) {
    throw new Error("검색 서버에 연결하지 못했습니다.");
  }

  return mockBooks.filter((book) => matchesQuery(book, query));
}
