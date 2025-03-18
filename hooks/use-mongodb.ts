"use client"

import { useState } from "react"

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: any
  headers?: Record<string, string>
}

export function useMongoDB() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  \
  const fetchAPI = async <T>(endpoint: string, options: FetchOptions = {})
  : Promise<T | null> =>
  setIsLoading(true)
  setError(null)

  try {
    const { method = "GET", body, headers = {} } = options

    const requestOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    }

    if (body) {
      requestOptions.body = JSON.stringify(body)
    }

    const response = await fetch(`/api/${endpoint}`, requestOptions)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "An error occurred")
    }

    return data as T
  } catch (err: any) {
    setError(err.message || "An error occurred")
    return null
  } finally {
    setIsLoading(false)
  }

  // Auth functions
  const login = async (email: string, password: string, role: string) => {
    const data = await fetchAPI<{ user: any }>("auth/login", {
      method: "POST",
      body: { email, password, role },
    })

    if (data?.user) {
      // Store user data in localStorage for client-side auth
      localStorage.setItem("authUser", JSON.stringify(data.user))
      return data.user
    }

    return null
  }

  const signup = async (userData: any) => {
    return fetchAPI<{ user: any }>("auth/signup", {
      method: "POST",
      body: userData,
    })
  }

  const logout = () => {
    localStorage.removeItem("authUser")
  }

  // Job functions
  const getJobs = async () => {
    const data = await fetchAPI<{ jobs: any[] }>("jobs")
    return data?.jobs || []
  }

  const getJob = async (id: string) => {
    const data = await fetchAPI<{ job: any }>(`jobs/${id}`)
    return data?.job || null
  }

  const createJob = async (jobData: any) => {
    const data = await fetchAPI<{ job: any }>("jobs", {
      method: "POST",
      body: jobData,
    })
    return data?.job || null
  }

  const updateJob = async (id: string, jobData: any) => {
    const data = await fetchAPI<{ job: any }>(`jobs/${id}`, {
      method: "PUT",
      body: jobData,
    })
    return data?.job || null
  }

  const deleteJob = async (id: string) => {
    return fetchAPI<{ success: boolean }>(`jobs/${id}`, {
      method: "DELETE",
    })
  }

  // Application functions
  const getApplications = async () => {
    const data = await fetchAPI<{ applications: any[] }>("applications")
    return data?.applications || []
  }

  const createApplication = async (applicationData: any) => {
    const data = await fetchAPI<{ application: any }>("applications", {
      method: "POST",
      body: applicationData,
    })
    return data?.application || null
  }

  const updateApplicationStatus = async (id: string, status: string) => {
    const data = await fetchAPI<{ application: any }>(`applications/${id}`, {
      method: "PATCH",
      body: { status },
    })
    return data?.application || null
  }

  return {
    isLoading,
    error,
    // Auth
    login,
    signup,
    logout,
    // Jobs
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    // Applications
    getApplications,
    createApplication,
    updateApplicationStatus,
  }
}

