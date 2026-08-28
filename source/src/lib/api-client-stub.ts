// Stub local pour @workspace/api-client-react (package interne au monorepo,
// non disponible en dehors du workspace Replit d'origine).
// Le site est déployé en statique sur GitHub Pages sans API backend :
// les requêtes échouent proprement (isError=true) et l'UI retombe sur
// ses valeurs par défaut, comme prévu dans App.tsx.
import { useMutation, useQuery } from '@tanstack/react-query';

let baseUrl: string | null = null;
export function setBaseUrl(url: string | null) {
  baseUrl = url;
}

type ImpactSummary = {
  hectaresRestored: number;
  schoolsEngaged: number;
  survivalRate: number;
  treesPlanted: number;
  donationUrl?: string;
  contactEmail?: string;
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!baseUrl) throw new Error('No API base URL configured');
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

export function getGetImpactSummaryQueryKey() {
  return ['impact-summary'] as const;
}
export function getHealthCheckQueryKey() {
  return ['health-check'] as const;
}

export function useGetImpactSummary(opts?: { query?: Record<string, unknown> }) {
  return useQuery<ImpactSummary>({
    queryKey: getGetImpactSummaryQueryKey(),
    queryFn: () => apiFetch<ImpactSummary>('/api/impact-summary'),
    retry: false,
    ...(opts?.query ?? {}),
  });
}

export function useHealthCheck(opts?: { query?: Record<string, unknown> }) {
  return useQuery<{ ok: boolean }>({
    queryKey: getHealthCheckQueryKey(),
    queryFn: () => apiFetch<{ ok: boolean }>('/api/health'),
    retry: false,
    ...(opts?.query ?? {}),
  });
}

function useSubmitMutation<TData>(path: string) {
  return useMutation({
    mutationFn: (payload: { data: TData }) =>
      apiFetch<{ message: string }>(path, {
        method: 'POST',
        body: JSON.stringify(payload.data),
      }),
  });
}

export function useSubmitContact() {
  return useSubmitMutation('/api/contact');
}
export function useSubmitVolunteer() {
  return useSubmitMutation('/api/volunteer');
}
export function useSubmitNewsletter() {
  return useSubmitMutation('/api/newsletter');
}
