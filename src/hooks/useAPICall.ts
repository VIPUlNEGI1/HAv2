/**
 * useAPICall - hook that returns APICall with optional auth token.
 * Use for all API requests. Never rejects; always check res.status.
 *
 * @example
 * const { APICall } = useAPICall();
 * const res = await APICall('post', { email }, ApiRoutes.auth.onboarding.sendOtp);
 * if (res.status === 200) { ... } else { console.log(res.data?.message); }
 *
 * With token (e.g. after login):
 * const res = await APICall('put', { name, phone_number }, ApiRoutes.auth.profile, {}, token);
 */

import { useCallback } from 'react';
import { APICall as baseAPICall } from '@/api/client';
import { useAuthStore } from '@/hooks/useAuthStore';
import type { MethodType } from '@/api/client';

export function useAPICall() {
  const token = useAuthStore((s) => s.token);

  const APICall = useCallback(
    async <T = unknown>(
      method: MethodType,
      body: Record<string, unknown> | FormData | null,
      url: string | null,
      headers: Record<string, string> = {},
      tokenOverride?: string | null,
    ) => {
      const t = tokenOverride !== undefined ? tokenOverride : token;
      return baseAPICall<T>(method, body, url, headers, t);
    },
    [token],
  );

  return { APICall };
}
