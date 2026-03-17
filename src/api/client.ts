import Config from 'react-native-config';

const DEFAULT_API_BASE = 'https://hospital-app-kwvg.onrender.com';
const BASE_URL = (Config.API_BASE_URL || DEFAULT_API_BASE).replace(/\/$/, '');

// If you see "Network request failed": check console for [API] BASE_URL. Open that URL in Safari on the device.
// For a local backend: set API_BASE_URL=http://YOUR_MAC_IP:PORT in .env (e.g. http://192.168.1.5:3000), then rebuild (npx react-native run-ios).

if (typeof __DEV__ !== 'undefined' && __DEV__ && console?.log) {
  console.log('[API] BASE_URL:', BASE_URL);
}

const REQUEST_TIMEOUT_MS = 90000; // 90s for Render free-tier cold start
const RETRY_DELAY_MS = 5000;       // wait before each retry after timeout
const MAX_TIMEOUT_RETRIES = 2;     // 2 retries = 3 attempts total

const LOG_API = typeof __DEV__ !== 'undefined' ? __DEV__ : true;

const SENSITIVE_KEYS = ['password', 'otp', 'token', 'authorization', 'secret'];

function sanitize(obj: unknown): unknown {
  if (obj == null) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = k.toLowerCase();
    const isSensitive = SENSITIVE_KEYS.some((s) => key.includes(s));
    out[k] = isSensitive ? (typeof v === 'string' ? '[REDACTED]' : '[REDACTED]') : sanitize(v);
  }
  return out;
}

function apiLog(
  type: 'req' | 'res' | 'err',
  method: string,
  path: string,
  status?: number,
  payload?: unknown,
) {
  if (!LOG_API || !console?.log) return;
  const shortPath = path.replace(BASE_URL, '').slice(0, 60);
  if (type === 'req') {
    console.log(`[API] ${method} ${shortPath}`, payload != null ? sanitize(payload) : '');
    return;
  }
  if (type === 'res') {
    const ok = status != null && status >= 200 && status < 300;
    if (ok) {
      console.log(`[API] ${method} ${shortPath} → ${status}`);
      // Log response body for profile so you can verify backend data
      if (shortPath.includes('/api/profile') && payload != null && typeof payload === 'object') {
        const p = payload as { success?: boolean; data?: { user?: Record<string, unknown> } };
        const data = p.data;
        const user = data?.user;
        console.log('[API] GET /api/profile response:', {
          success: p.success,
          hasData: !!data,
          hasUser: !!user,
          userKeys: user ? Object.keys(user) : [],
          userPreview: user ? { id: user.id ?? user._id, name: user.name, email: user.email } : null,
        });
      }
    } else {
      console.warn(`[API] ${method} ${shortPath} → ${status}`, payload != null ? payload : '');
    }
    return;
  }
  if (type === 'err') {
    console.error(`[API] ${method} ${shortPath} FAILED`, payload);
  }
}

export type MethodType = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface ApiResponse<T = unknown> {
  status: number;
  data?: T;
}

function buildUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
}

function isTimeoutResponse(data: unknown): boolean {
  const msg = (data as { message?: string })?.message ?? '';
  return typeof msg === 'string' && (msg.includes('timed out') || msg.includes('starting'));
}

function isNetworkFailedResponse(data: unknown): boolean {
  const msg = (data as { message?: string })?.message ?? '';
  return typeof msg === 'string' && msg.includes('Network request failed');
}

/**
 * Single attempt: no retry. Used internally by APICall.
 */
function apicallOnce<T>(
  method: MethodType,
  body: Record<string, unknown> | FormData | null,
  url: string,
  headers: Record<string, string>,
  token: string | null | undefined,
): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    const fullUrl = buildUrl(url);
    const config: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
      },
    };

    if (token) {
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    let requestUrl = fullUrl;
    if (method === 'get' && body && !(body instanceof FormData)) {
      const params = new URLSearchParams();
      Object.entries(body).forEach(([k, v]) => {
        if (v !== undefined && v !== null) params.append(k, String(v));
      });
      const query = params.toString();
      requestUrl = query ? `${fullUrl}?${query}` : fullUrl;
    }

    if (body && method !== 'get') {
      config.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    const methodStr = (config.method as string) || 'GET';
    const bodyForLog =
      body && !(body instanceof FormData)
        ? (body as Record<string, unknown>)
        : body instanceof FormData
          ? { _: '[FormData]' }
          : undefined;
    apiLog('req', methodStr, fullUrl, undefined, bodyForLog);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    fetch(requestUrl, {
      method: config.method,
      headers: config.headers,
      body: config.body,
      signal: controller.signal,
    })
      .then(async (response) => {
        clearTimeout(timeoutId);
        const status = response.status;
        let data: T | undefined;
        const text = await response.text();
        try {
          data = text ? (JSON.parse(text) as T) : undefined;
        } catch {
          data = { message: text || 'Unknown error' } as T;
        }
        apiLog('res', methodStr, fullUrl, status, data);
        resolve({ status, data });
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        const isTimeout = error?.name === 'AbortError';
        const message = isTimeout
          ? 'Request timed out. If using Render free tier, the server may be starting—please try again in a moment.'
          : error?.message || 'Network error';
        apiLog('err', methodStr, fullUrl, undefined, {
          name: error?.name,
          message: error?.message,
          code: (error as { code?: string })?.code,
          userMessage: message,
        });
        if (LOG_API && console?.warn) {
          if (isTimeout) {
            console.warn('[API] Timeout. Test in Safari:', requestUrl);
          } else if (message.includes('Network request failed')) {
            console.warn('[API] Network request failed. Full URL:', requestUrl);
            console.warn('[API] → Open this URL in Safari on your device/simulator. If it fails, the device cannot reach the server (backend down, wrong API_BASE_URL, or no internet).');
          }
        }
        resolve({
          status: 500,
          data: { message } as T,
        });
      });
  });
}

/**
 * APICall - always resolves. On timeout (e.g. Render cold start), retries once after a short delay.
 * - GET with body → sent as query params (?key=value)
 * - FormData → pass as body; set Content-Type to multipart/form-data (or omit for browser to set boundary)
 * - Custom headers merged with defaults; Authorization added when token provided
 */
export async function APICall<T = unknown>(
  method: MethodType,
  body: Record<string, unknown> | FormData | null,
  url: string | null,
  headers: Record<string, string> = {},
  token?: string | null,
): Promise<ApiResponse<T>> {
  if (!url) {
    return { status: 500, data: { message: 'No URL provided' } as T };
  }

  let res = await apicallOnce<T>(method, body, url, headers, token);

  const retryable = (r: ApiResponse<T>) =>
    r.status === 500 && (isTimeoutResponse(r.data) || isNetworkFailedResponse(r.data));
  const maxRetries = MAX_TIMEOUT_RETRIES + 1;
  for (let attempt = 1; attempt <= maxRetries && retryable(res); attempt++) {
    if (LOG_API && console?.log) {
      console.log(`[API] retry ${attempt}/${maxRetries} in ${RETRY_DELAY_MS / 1000}s: ${url.slice(0, 60)}`);
    }
    await new Promise<void>((r) => setTimeout(() => r(), RETRY_DELAY_MS));
    res = await apicallOnce<T>(method, body, url, headers, token);
  }

  return res;
}
