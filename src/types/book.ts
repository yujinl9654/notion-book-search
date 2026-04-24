export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publishedAt: string;
  isbn: string;
  thumbnail: string;
}

export type RequestStatus =
  | "idle"
  | "loading"
  | "success"
  | "empty"
  | "error";

export interface SearchRequestState {
  errorMessage: string;
  items: Book[];
  status: RequestStatus;
  submittedQuery: string;
}
