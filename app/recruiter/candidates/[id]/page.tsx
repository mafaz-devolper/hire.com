"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, FileText, Building2, Calendar } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function CandidateProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const candidateId = Number.parseInt(params.id)

  const [candidate, setCandidate] = useState<any>(null)
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCandidateData = () => {
      try {
        const applications = JSON.parse(localStorage.getItem("applications") || "[]")
        const candidateApplication = applications.find((app: any) => app.id === candidateId)

        if (!candidateApplication) {
          toast({
            title: "Candidate not found",
            description: "Could not find the candidate information.",
            variant: "destructive",
          })
          router.push("/recruiter/dashboard")
          return
        }

        setApplication(candidateApplication)

        const candidateData = {
          id: candidateApplication.id,
          name: candidateApplication.fullName,
          email: candidateApplication.email,
          phone: candidateApplication.phone || "Not provided",
          resumeUrl: candidateApplication.resumeUrl,
          position: candidateApplication.jobTitle,
          company: candidateApplication.company,
          coverLetter: candidateApplication.coverLetter,
          appliedDate: candidateApplication.appliedDate,
          status: candidateApplication.status,
        }

        setCandidate(candidateData)
      } catch (err) {
        console.error("Error loading candidate data:", err)
        toast({
          title: "Error",
          description: "Failed to load candidate information.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadCandidateData()
  }, [candidateId, router])

  const updateApplicationStatus = (newStatus: string) => {
    try {
      const applications = JSON.parse(localStorage.getItem("applications") || "[]")
      const updatedApplications = applications.map((app: any) =>
        app.id === candidateId ? { ...app, status: newStatus } : app,
      )
      localStorage.setItem("applications", JSON.stringify(updatedApplications))

      setCandidate((prev: any) => ({ ...prev, status: newStatus }))
      setApplication((prev: any) => ({ ...prev, status: newStatus }))

      toast({
        title: "Status updated",
        description: `Application status has been updated to ${newStatus}.`,
      })
    } catch (err) {
      toast({
        title: "Update failed",
        description: "Failed to update application status.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-primary"></div>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="py-8 px-4 max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Candidate Not Found</h2>
            <p className="text-muted-foreground mb-6">This candidate profile could not be found.</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{candidate.name}</h1>
            <p className="text-muted-foreground">Candidate Profile</p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>

        {/* Candidate Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Candidate Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${candidate.email}`} className="hover:text-primary">
                      {candidate.email}
                    </a>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{candidate.phone}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Applied For</p>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <p>
                      {candidate.position} at {candidate.company}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Applied On</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p>{new Date(candidate.appliedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {candidate.resumeUrl && (
                <>
                  <Separator />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="font-medium">Resume</h3>
                    <Button variant="outline" asChild className="mt-2 sm:mt-0">
                      <a
                        href={candidate.resumeUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Download Resume
                      </a>
                    </Button>
                  </div>
                </>
              )}

              {candidate.coverLetter && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Cover Letter</h3>
                    <div className="p-4 bg-muted rounded-md">
                      <p className="whitespace-pre-line">{candidate.coverLetter}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center">
                <Badge
                  className="text-lg px-4 py-2 mb-4"
                  variant={
                    candidate.status === "Pending"
                      ? "outline"
                      : candidate.status === "Reviewed"
                      ? "secondary"
                      : candidate.status === "Interview"
                      ? "default"
                      : candidate.status === "Accepted"
                      ? "default"
                      : "destructive"
                  }
                >
                  {candidate.status}
                </Badge>

                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Update the candidate's application status below
                </p>

                <Select value={candidate.status} onValueChange={(value) => updateApplicationStatus(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Reviewed">Reviewed</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Accepted">Accepted</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Application Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <div>
                      <p className="font-medium">Application Submitted</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(candidate.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {candidate.status !== "Pending" && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <p className="font-medium">Status Changed to {candidate.status}</p>
                        <p className="text-sm text-muted-foreground">Today</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            Back to Applicants
          </Button>
          <div className="flex gap-2 justify-end">
            <Button
              variant={candidate.status === "Accepted" ? "default" : "outline"}
              onClick={() => updateApplicationStatus("Accepted")}
              disabled={candidate.status === "Accepted"}
            >
              Accept Candidate
            </Button>
            <Button
              variant={candidate.status === "Rejected" ? "destructive" : "outline"}
              onClick={() => updateApplicationStatus("Rejected")}
              disabled={candidate.status === "Rejected"}
            >
              Reject Candidate
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
