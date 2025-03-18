"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("role") || "candidate"

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, role: string) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      localStorage.setItem("authUser", JSON.stringify(data.user))

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.name}! You are now logged in as a ${role}.`,
      })

      if (role === "candidate") {
        router.push("/candidate/dashboard")
      } else {
        router.push("/recruiter/dashboard")
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-2xl text-center font-bold">Login</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid grid-cols-2 border-b">
            <TabsTrigger value="candidate" className="py-2">
              Candidate
            </TabsTrigger>
            <TabsTrigger value="recruiter" className="py-2">
              Recruiter
            </TabsTrigger>
          </TabsList>
          <TabsContent value="candidate" className="px-6 py-4">
            <form onSubmit={(e) => handleSubmit(e, "candidate")}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="candidate-email">Email</Label>
                  <Input
                    id="candidate-email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="candidate-password">Password</Label>
                    <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input id="candidate-password" name="password" type="password" required />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login as Candidate"}
                </Button>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/signup?role=candidate" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="recruiter" className="px-6 py-4">
            <form onSubmit={(e) => handleSubmit(e, "recruiter")}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="recruiter-email">Email</Label>
                  <Input
                    id="recruiter-email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="recruiter-password">Password</Label>
                    <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input id="recruiter-password" name="password" type="password" required />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login as Recruiter"}
                </Button>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/signup?role=recruiter" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
