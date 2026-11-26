/**
 * Mpumalanga Nkomazi SEZ - Bespoke API Client
 * Seamlessly interfaces with our self-hosted Node.js + Express backend.
 * Automatically attaches JWT session tokens to requests.
 */

const API_BASE = '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('nsez_auth_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('nsez_auth_token', token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('nsez_auth_token');
};

const getHeaders = (isMultipart = false): HeadersInit => {
  const headers: Record<string, string> = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const apiClient = {
  // Check backend server health
  async checkHealth(): Promise<{ online: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        const data = await res.json();
        return { online: true, message: data.entity || 'Connected' };
      }
      return { online: false, message: 'Backend returned non-200 status' };
    } catch {
      return { online: false, message: 'Backend server offline (running in frontend mock mode)' };
    }
  },

  // Auth
  async login(email: string, password: string, role?: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(error.error || 'Authentication error');
    }
    const data = await res.json();
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  // Tenders
  async getTenders(status?: string) {
    const url = status ? `${API_BASE}/tenders?status=${status}` : `${API_BASE}/tenders`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch tenders');
    return res.json();
  },

  async createTender(data: any) {
    const res = await fetch(`${API_BASE}/tenders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create tender');
    return res.json();
  },

  async updateTender(id: string, data: any) {
    const res = await fetch(`${API_BASE}/tenders/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update tender');
    return res.json();
  },

  async deleteTender(id: string, reason?: string) {
    const res = await fetch(`${API_BASE}/tenders/${id}/delete`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reason })
    });
    if (!res.ok) throw new Error('Failed to process deletion');
    return res.json();
  },

  // Investment Listings
  async getListings(status?: string) {
    const url = status ? `${API_BASE}/listings?status=${status}` : `${API_BASE}/listings`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch listings');
    return res.json();
  },

  async createListing(data: any) {
    const res = await fetch(`${API_BASE}/listings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create listing');
    return res.json();
  },

  async updateListing(id: string, data: any) {
    const res = await fetch(`${API_BASE}/listings/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update listing');
    return res.json();
  },

  async deleteListing(id: string, reason?: string) {
    const res = await fetch(`${API_BASE}/listings/${id}/delete`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reason })
    });
    if (!res.ok) throw new Error('Failed to process listing deletion');
    return res.json();
  },

  // Approvals (Super Admin)
  async getApprovals(status?: string) {
    const url = status ? `${API_BASE}/approvals?status=${status}` : `${API_BASE}/approvals`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch approvals');
    return res.json();
  },

  async approveRequest(id: string) {
    const res = await fetch(`${API_BASE}/approvals/${id}/approve`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to approve request');
    return res.json();
  },

  async rejectRequest(id: string) {
    const res = await fetch(`${API_BASE}/approvals/${id}/reject`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to reject request');
    return res.json();
  },

  // File Upload (Bespoke Disk Storage via multer)
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    });
    if (!res.ok) throw new Error('File upload failed');
    return res.json(); // { url: '/uploads/...', filename, size }
  },

  // Site Settings
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(data: any) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  // Inquiries
  async submitInquiry(data: any) {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit inquiry');
    return res.json();
  },

  async getInquiries() {
    const res = await fetch(`${API_BASE}/inquiries`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch inquiries');
    return res.json();
  },

  async updateInquiryStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/inquiries/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update inquiry status');
    return res.json();
  }
};
