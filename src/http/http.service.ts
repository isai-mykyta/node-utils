import axios from "axios";

import { HttpServiceOptions, RequestOptions } from "./types";

export class HttpService {
  private readonly apiUrl: string;

  constructor (options: HttpServiceOptions) {
    this.apiUrl = options.apiUrl;
  }

  private async request<P, R>(options: RequestOptions<P>): Promise<R> {
    const config: Record<string, unknown> = {
      url: options.path,
      method: options.method,
      baseURL: this.apiUrl,
      data: options.data,
      timeout: options.timeout
    };

    if (options.headers) {
      config.headers = {
        ...options.headers,
        "Content-Type": "application/json",
      };
    }

    if (options.params) {
      config.params = options.params;
    }

    const response = await axios.request(config);
    return response.data;
  }

  public async post<P, R>(options: Omit<RequestOptions<P>, "method">): Promise<R> {
    return this.request({ ...options, method: "POST" });
  }

  public async patch<P, R>(options: Omit<RequestOptions<P>, "method">): Promise<R> {
    return this.request({ ...options, method: "PATCH" });
  }

  public async delete<P, R>(options: Omit<RequestOptions<P>, "method">): Promise<R> {
    return this.request({ ...options, method: "DELETE" });
  }

  public async put<P, R>(options: Omit<RequestOptions<P>, "method">): Promise<R> {
    return this.request({ ...options, method: "PUT" });
  }

  public async get<P, R>(options: Omit<RequestOptions<P>, "method">): Promise<R> {
    return this.request({ ...options, method: "GET" });
  }
}
