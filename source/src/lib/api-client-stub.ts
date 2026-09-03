// Stub local pour @workspace/api-client-react (package interne au monorepo,
// non disponible en dehors du workspace Replit d'origine).
// Le site est déployé en statique sur GitHub Pages sans backend applicatif :
// - useGetImpactSummary / useHealthCheck échouent proprement (isError=true) et
//   l'UI retombe sur ses valeurs par défaut, comme prévu dans App.tsx.
// - Les 3 formulaires (contact, bénévole, newsletter) sont envoyés directement
//   à Formspree (formspree.io), qui relaie vers ongreenlegacy.intitiative@gmail.com
//   sans backend à héberger.
import { useMutation, useQuery } from '@tanstack/react-query';

let baseUrl: string | null = null;
export function setBaseUrl(url: string | null) {
  baseUrl = url;
}

// ID de formulaire Formspree (partie après /f/ dans l'URL du formulaire).
const FORMSPREE_FORM_ID = 'xkjnojag';
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

const FORM_LABELS: Record<string, string> = {
  contact: 'Formulaire de contact',
  volunteer: 'Candidature bénévole',
  newsletter: 'Inscription newsletter',
};

async function submitToFormspree<TData extends Record<string, unknown>>(
  formType: keyof typeof FORM_LABELS,
  data: TData,
): Promise<{ message: string }> {
  const res = await fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      ...data,
      formType,
      _subject: `Green Legacy Initiative — ${FORM_LABELS[formType]}`,
    }),
  });
  if (!res.ok) throw new Error(`Formspree error: ${res.status}`);
  return { message: 'Merci, votre message a bien été envoyé.' };
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

function useSubmitMutation<TData extends Record<string, unknown>>(
  formType: keyof typeof FORM_LABELS,
) {
  return useMutation({
    mutationFn: (payload: { data: TData }) => submitToFormspree(formType, payload.data),
  });
}

export function useSubmitContact() {
  return useSubmitMutation('contact');
}
export function useSubmitVolunteer() {
  return useSubmitMutation('volunteer');
}
export function useSubmitNewsletter() {
  return useSubmitMutation('newsletter');
}
