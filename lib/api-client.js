const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getToken() {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((c) => c.trim().startsWith("token="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
      credentials: "include",
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error.error || `HTTP error! status: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email, password, name) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }

  async logout() {
    return this.request("/api/auth/logout");
  }

  async getCurrentUser() {
    return this.request("/api/auth/me");
  }

  // Resume endpoints
  async getResumes() {
    return this.request("/api/resumes");
  }

  async getResume(id) {
    return this.request(`/api/resumes/${id}`);
  }

  async createResume(data) {
    return this.request("/api/resumes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateResume(id, data) {
    return this.request(`/api/resumes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteResume(id) {
    return this.request(`/api/resumes/${id}`, {
      method: "DELETE",
    });
  }

  async togglePublic(id) {
    return this.request(`/api/resumes/${id}/toggle-public`, {
      method: "PATCH",
    });
  }

  async duplicateResume(id) {
    return this.request(`/api/resumes/${id}/duplicate`, {
      method: "POST",
    });
  }

  // Template endpoints
  async getTemplates() {
    return this.request("/api/templates");
  }

  async getTemplate(id) {
    return this.request(`/api/templates/${id}`);
  }

  async getTemplateMetadata(id) {
    return this.request(`/api/templates/${id}/metadata`);
  }

  // PDF endpoints
  async generatePDF(resumeData, template) {
    const response = await fetch(`${this.baseURL}/api/pdf/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resumeData, template }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }

    return response.blob();
  }
}

export const api = new ApiClient();
