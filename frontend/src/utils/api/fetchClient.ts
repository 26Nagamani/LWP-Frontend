import { APP_CONFIG } from "../../config/app.config";

const BASE_URL = APP_CONFIG.apiBaseUrl;

type ResponseType = "json" | "xml";

interface RequestOptions extends RequestInit {
  responseType?: ResponseType;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { responseType = "json", ...fetchOptions } = options;
  const isFormData = fetchOptions.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...fetchOptions.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    console.error("Backend Error:", body);
    const error = Object.assign(
      new Error(body?.message ?? `Request failed: ${res.status}`),
      { status: res.status }
    );
    throw error;
  }

  if (res.status === 204) return undefined as T;

  // return raw text for xml, json parse for everything else
  if (responseType === "xml") return res.text() as Promise<T>;
  return res.json() as Promise<T>;
}

const fetchClient = {
  get: <T>(path: string, responseType: ResponseType = "json") =>
    request<T>(path, { method: "GET", responseType }),
  post: <T>(path: string, body: unknown, responseType: ResponseType = "json") =>
    request<T>(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      responseType,
    }),

  put: <T>(path: string, body: unknown, responseType: ResponseType = "json") =>
    request<T>(path, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
      responseType,
    }),

  patch: <T>(path: string, body: unknown, responseType: ResponseType = "json") =>
    request<T>(path, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
      responseType,
    }),

  delete: (path: string) =>
    request<void>(path, { method: "DELETE" }),
};

export default fetchClient;