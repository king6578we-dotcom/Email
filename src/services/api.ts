const BASE_URL = '/api/v1';

let inMemoryToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  inMemoryToken = token;
};

export const getAuthToken = () => inMemoryToken;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (inMemoryToken) {
    headers.set('Authorization', `Bearer ${inMemoryToken}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // sends cookies
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg) as any;
    error.status = response.status;
    error.details = data?.details;
    throw error;
  }

  return data.data !== undefined ? data.data : data;
}

export const api = {
  // Auth
  auth: {
    register: (body: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    logout: () => request<any>('/auth/logout', { method: 'POST' }),
    me: () => request<any>('/auth/me'),
    updateProfile: (body: any) => request<any>('/auth/profile', { method: 'PATCH', body: JSON.stringify(body) }),
    forgotPassword: (email: string) => request<any>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (body: any) => request<any>('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
  },

  // Emails
  emails: {
    list: (params: Record<string, any> = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
      });
      return request<any>(`/emails?${query.toString()}`);
    },
    get: (id: string) => request<any>(`/emails/${id}`),
    create: (body: any) => request<any>('/emails', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: any) => request<any>(`/emails/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) => request<any>(`/emails/${id}`, { method: 'DELETE' }),
    permanentDelete: (id: string) => request<any>(`/emails/${id}/permanent`, { method: 'DELETE' }),
    favorite: (id: string) => request<any>(`/emails/${id}/favorite`, { method: 'POST' }),
    archive: (id: string) => request<any>(`/emails/${id}/archive`, { method: 'POST' }),
    restore: (id: string) => request<any>(`/emails/${id}/restore`, { method: 'POST' }),
    versions: (id: string) => request<any>(`/emails/${id}/versions`),
  },

  // Templates
  templates: {
    list: (params: Record<string, any> = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
      });
      return request<any>(`/templates?${query.toString()}`);
    },
    get: (id: string) => request<any>(`/templates/${id}`),
    create: (body: any) => request<any>('/templates', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: any) => request<any>(`/templates/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) => request<any>(`/templates/${id}`, { method: 'DELETE' }),
  },

  // AI
  ai: {
    generate: (body: any) => request<any>('/ai/generate', { method: 'POST', body: JSON.stringify(body) }),
    rewrite: (body: any) => request<any>('/ai/rewrite', { method: 'POST', body: JSON.stringify(body) }),
    subjectLines: (body: any) => request<any>('/ai/subject-lines', { method: 'POST', body: JSON.stringify(body) }),
    summarize: (text: string) => request<any>('/ai/summarize', { method: 'POST', body: JSON.stringify({ text }) }),
    translate: (text: string, targetLanguage: string) =>
      request<any>('/ai/translate', { method: 'POST', body: JSON.stringify({ text, targetLanguage }) }),
  },

  // Delivery
  delivery: {
    send: (body: any) => request<any>('/email-delivery/send', { method: 'POST', body: JSON.stringify(body) }),
    getStatus: (id: string) => request<any>(`/email-delivery/${id}/status`),
  },

  // Analytics
  analytics: {
    get: () => request<any>('/analytics'),
  },
};
