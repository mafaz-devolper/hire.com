"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"

export default function SignupPage() {
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
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const company = formData.get("company") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role, company }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      toast({
        title: "Account created successfully",
        description: "Your account has been created. You can now log in.",
      })

      router.push(`/auth/login?role=${role}`)
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Create an Account</CardTitle>
          <CardDescription>
            Enter your details to create your account and get started
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="flex justify-center gap-4 border-b">
            <TabsTrigger value="candidate" className="flex-1">
              Candidate
            </TabsTrigger>
            <TabsTrigger value="recruiter" className="flex-1">
              Recruiter
            </TabsTrigger>
          </TabsList>
          <TabsContent value="candidate" className="px-4 py-6">
            <form onSubmit={(e) => handleSubmit(e, "candidate")} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="candidate-name">Full Name</Label>
                <Input id="candidate-name" name="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="candidate-email">Email</Label>
                <Input id="candidate-email" name="email" type="email" placeholder="name@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="candidate-password">Password</Label>
                <Input id="candidate-password" name="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="candidate-confirm-password">Confirm Password</Label>
                <Input id="candidate-confirm-password" name="confirmPassword" type="password" required />
              </div>
              <div className="flex items-center">
                <Checkbox id="candidate-terms" required />
                <Label htmlFor="candidate-terms" className="ml-2 text-sm font-medium">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              <CardFooter className="pt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign Up as Candidate"}
                </Button>
                <p className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login?role=candidate" className="text-primary hover:underline">
                    Login
                  </Link>
                </p>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="recruiter" className="px-4 py-6">
            <form onSubmit={(e) => handleSubmit(e, "recruiter")} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="recruiter-name">Full Name</Label>
                <Input id="recruiter-name" name="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recruiter-company">Company Name</Label>
                <Input id="recruiter-company" name="company" placeholder="Acme Inc." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recruiter-email">Email</Label>
                <Input id="recruiter-email" name="email" type="email" placeholder="name@company.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recruiter-password">Password</Label>
                <Input id="recruiter-password" name="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recruiter-confirm-password">Confirm Password</Label>
                <Input id="recruiter-confirm-password" name="confirmPassword" type="password" required />
              </div>
              <div className="flex items-center">
                <Checkbox id="recruiter-terms" required />
                <Label htmlFor="recruiter-terms" className="ml-2 text-sm font-medium">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              <CardFooter className="pt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign Up as Recruiter"}
                </Button>
                <p className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login?role=recruiter" className="text-primary hover:underline">
                    Login
                  </Link>
                </p>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
