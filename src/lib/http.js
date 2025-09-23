// src/lib/http.js

function isAbsoluteUrl(url) {
  return /^https?:\/\//i.test(url);
}

export function createClient({
  baseUrl = "",
  getToken = null,
  defaultHeaders = {},
  unwrapResult = false,
  timeout = 10000,
  retries = 1,              // NYTT: antal retrys vid timeout/nätfel
  retryDelayMs = 800,       // NYTT: backoff-delay
} = {}) {

  async function coreFetch(path, {
    method = "GET",
    headers = {},
    body,
    signal = null,
    query = null,
    credentials,
    mode = "cors",
  } = {}) {

    // Bygg URL — använd inte base om path redan är absolut
    const url = isAbsoluteUrl(path)
      ? new URL(path)
      : new URL(`${baseUrl || ""}${path}`, window.location.origin);

    // Query params
    if (query && typeof query === "object") {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    // Headers
    const finalHeaders = {
      Accept: "application/json",
      ...defaultHeaders,
      ...headers,
    };
    if (body !== undefined && finalHeaders["Content-Type"] == null) {
      finalHeaders["Content-Type"] = "application/json";
    }

    // Auth
    if (typeof getToken === "function") {
      const t = getToken();
      if (t) finalHeaders.Authorization = `Bearer ${t}`;
    }

    // Kör med retry-policy
    let attempt = 0, lastErr;
    while (attempt <= retries) {
      // Timeout
      const ac = new AbortController();
      const to = setTimeout(
        () => ac.abort(new DOMException("timeout", "AbortError")),
        timeout
      );
      const finalSignal = mergeSignals(signal, ac.signal);

      try {
        // Debug: visa exakt URL på första försöket
        if (attempt === 0 && import.meta.env.DEV) {
          console.debug(`[HTTP] ${method} ${url.toString()}`);
        }

        const res = await fetch(url.toString(), {
          method,
          headers: finalHeaders,
          body: body !== undefined ? JSON.stringify(body) : undefined,
          signal: finalSignal,
          credentials,
          mode,
        });

        clearTimeout(to);

        const text = await res.text();
        let data = null;
        try { data = text ? JSON.parse(text) : null; } catch { data = text || null; }

        if (!res.ok) {
          const msg =
            (data && (data.message || data.error || data.title)) ||
            text ||
            `HTTP ${res.status}`;
          const err = new Error(msg);
          err.status = res.status;
          err.data = data;
          throw err;
        }

        if (unwrapResult && data && typeof data === "object" && "result" in data) {
          return data.result;
        }
        return data;

      } catch (e) {
        clearTimeout(to);
        lastErr = e;

        // Endast retry på timeout/”nätfel”
        const isTimeout = e?.name === "AbortError" || /timeout/i.test(e?.message || "");
        const isNetwork = e instanceof TypeError && !("status" in e); // CORS/nätstrul ger ofta TypeError
        if ((isTimeout || isNetwork) && attempt < retries) {
          attempt++;
          await sleep(retryDelayMs * attempt);
          continue;
        }
        throw e;
      }
    }
    throw lastErr; // ska aldrig nås
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function mergeSignals(a, b) {
    if (!a) return b;
    if (!b) return a;
    const ac = new AbortController();
    const onAbort = () => ac.abort();
    a.addEventListener?.("abort", onAbort);
    b.addEventListener?.("abort", onAbort);
    if (a.aborted || b.aborted) ac.abort();
    return ac.signal;
  }

  return {
    fetch: coreFetch,
    get:  (path, options = {}) => coreFetch(path, { ...options, method: "GET"  }),
    post: (path, body, options = {}) => coreFetch(path, { ...options, method: "POST", body }),
    put:  (path, body, options = {}) => coreFetch(path, { ...options, method: "PUT",  body }),
    del:  (path, options = {}) => coreFetch(path, { ...options, method: "DELETE" }),
  };
}

export default createClient;
