const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://wispain.vercel.app"

export interface ApiResponse<T = any> {
  message: T
  stat: boolean
  token?: string
  username?: string
}

export interface Message {
  _id: string
  message: string
  time: string
  imageURL?: string | null
  username: string
  isRead?: boolean
  __v?: number
}

export interface User {
  username: string
  token: string
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async createUser(username: string, password: string): Promise<ApiResponse<string>> {
    return this.request("/user/create", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  }

  async loginUser(username: string, password: string): Promise<ApiResponse<string>> {
    return this.request("/user/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  }

  async getUserMessages(token: string): Promise<ApiResponse<Message[]>> {
    return this.request("/get", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
  }

  async sendMessage(username: string, message: string, img?: string): Promise<ApiResponse<string>> {
    const time = new Date().toISOString()
    return this.request("/send", {
      method: "POST",
      body: JSON.stringify({
        username,
        message,
        time,
        ...(img && { img }),
      }),
    })
  }

  async setRecoveryEmail(username: string, recoveryEmail: string, token: string): Promise<ApiResponse<string>> {
    return this.request("/user/set-recovery-email", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, recoveryEmail }),
    })
  }

  async forgotPassword(username: string): Promise<ApiResponse<string>> {
    return this.request("/user/forgot-password", {
      method: "POST",
      body: JSON.stringify({ username }),
    })
  }

  async resetPassword(code: string, newPassword: string, username: string): Promise<ApiResponse<string>> {
    return this.request("/user/reset-password", {
      method: "POST",
      body: JSON.stringify({ code, newPassword, username }),
    })
  }
}

export const apiService = new ApiService()
