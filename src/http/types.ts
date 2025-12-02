export type HttpServiceOptions = {
  apiUrl: string;
}

export type RequestOptions<P> = {
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  path: string;
  params?: Record<string, unknown>;
  headers?: Record<string, unknown>;
  data?: P;
  timeout?: number;
}
