import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { searchBooks } from "./searchBooks";

function createJsonResponse(body: unknown, ok = true) {
  return {
    json: () => Promise.resolve(body),
    ok,
  } as Response;
}

describe("searchBooks", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("maps Naver book search results to the shared Book model", async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse({
        items: [
          {
            author: "한강",
            image: "https://example.com/cover.jpg",
            isbn: "9788932034975",
            pubdate: "20071030",
            publisher: "창비",
            title: "<b>채식주의자</b>",
          },
        ],
      }),
    );

    await expect(searchBooks(" 한강 ")).resolves.toEqual(
      expect.objectContaining({
        items: [
          {
            author: "한강",
            id: "9788932034975",
            isbn: "9788932034975",
            publishedAt: "2007.10.30",
            publisher: "창비",
            thumbnail: "https://example.com/cover.jpg",
            title: "채식주의자",
          },
        ],
        nextStart: null,
        start: 1,
      }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/naver/books?display=10&query=%ED%95%9C%EA%B0%95&sort=sim&start=1",
      { signal: undefined },
    );
  });

  it("requests the requested search page and exposes the next start position", async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse({
        display: 10,
        items: [
          {
            author: "김영하",
            isbn: "9788954682152",
            publisher: "복복서가",
            title: "작별인사",
          },
        ],
        start: 11,
        total: 25,
      }),
    );

    await expect(searchBooks("소설", { start: 11 })).resolves.toEqual(
      expect.objectContaining({
        nextStart: 21,
        start: 11,
        total: 25,
      }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/naver/books?display=10&query=%EC%86%8C%EC%84%A4&sort=sim&start=11",
      { signal: undefined },
    );
  });

  it("returns no results without calling the API when the query is blank", async () => {
    await expect(searchBooks("   ")).resolves.toEqual({
      display: 10,
      items: [],
      nextStart: null,
      start: 1,
      total: 0,
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
