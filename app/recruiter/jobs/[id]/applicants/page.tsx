"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Download, Loader2, Mail, Search, Users } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Applicant {
  id: number
  jobId: number
  jobTitle: string
  company: string
  fullName: string
  email: string
  phone: string
  appliedDate: string // used to sort and display the application date
  status: string
  resumeUrl?: string
  coverLetter?: string
}

interface Job {
  id: number
  title: string
  location: string
  type: string
  postedDate: string
  status: string
}

export default function JobApplicantsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const jobId = Number.parseInt(params.id)

  const [isLoading, setIsLoading] = useState(true)
  const [job, setJob] = useState<Job | null>(null)
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  // Add a function to view candidate profiles
  const viewCandidateProfile = (applicantId: number) => {
    // In a real app, this would link to the candidate's profile
    // For now, we'll store the candidate ID in localStorage and navigate to a view page
    localStorage.setItem("viewingCandidateId", applicantId.toString())
    router.push(`/recruiter/candidates/${applicantId}`)
  }

  // Load job and applicants data
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true)
      try {
        // Load job data
        const jobs = JSON.parse(localStorage.getItem("postedJobs") || "[]")
        const jobData = jobs.find((j: any) => j.id === jobId)

        if (!jobData) {
          toast({
            title: "Job not found",
            description: "The job you're looking for doesn't exist.",
            variant: "destructive",
          })
          router.push("/recruiter/dashboard")
          return
        }

        setJob(jobData)

        // Load applications
        const applications = JSON.parse(localStorage.getItem("applications") || "[]")
        const jobApplicants = applications.filter((app: any) => app.jobId === jobId)

        setApplicants(jobApplicants)
        setFilteredApplicants(jobApplicants)

        // Update job applicant count in localStorage
        const updatedJobs = jobs.map((j: any) => {
          if (j.id === jobId) {
            return { ...j, applicants: jobApplicants.length }
          }
          return j
        })

        localStorage.setItem("postedJobs", JSON.stringify(updatedJobs))
      } catch (err) {
        console.error("Error loading data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [jobId, router])

  // Filter and sort applicants
  useEffect(() => {
    if (!applicants.length) return

    let filtered = [...applicants]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((applicant) => applicant.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (applicant) => applicant.fullName.toLowerCase().includes(term) || applicant.email.toLowerCase().includes(term),
      )
    }

    // Apply sorting
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime())
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.fullName.localeCompare(b.fullName))
    }

    setFilteredApplicants(filtered)
  }, [applicants, statusFilter, searchTerm, sortBy])

  const updateApplicationStatus = (applicantId: number, newStatus: string) => {
    // Update applicants state
    const updatedApplicants = applicants.map((applicant) =>
      applicant.id === applicantId ? { ...applicant, status: newStatus } : applicant,
    )
    setApplicants(updatedApplicants)

    // Update applications in localStorage
    const applications = JSON.parse(localStorage.getItem("applications") || "[]")
    const updatedApplications = applications.map((app: any) =>
      app.id === applicantId ? { ...app, status: newStatus } : app,
    )
    localStorage.setItem("applications", JSON.stringify(updatedApplications))

    toast({
      title: "Status updated",
      description: `Application status has been updated to ${newStatus}.`,
    })
  }

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading applicants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/recruiter/dashboard" className="hover:text-primary">
              Dashboard
            </Link>
            <span>/</span>
            <Link href={`/jobs/${jobId}`} className="hover:text-primary">
              {job?.title}
            </Link>
            <span>/</span>
            <span>Applicants</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Applicants for {job?.title}</h1>
          <p className="text-muted-foreground">Review and manage candidates who have applied for this position</p>
        </div>

        {/* Job Summary Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Job Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                <p>{job?.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Job Type</h3>
                <p>{job?.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <Badge variant={job?.status === "Active" ? "default" : "secondary"}>{job?.status}</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={`/jobs/${jobId}`}>View Job Posting</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/recruiter/jobs/${jobId}/edit`}>Edit Job</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Applicants Section */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-semibold">
              {filteredApplicants.length} {filteredApplicants.length === 1 ? "Applicant" : "Applicants"}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Search applicants"
                  className="pl-10 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Reviewed">Reviewed</SelectItem>
                  <SelectItem value="Interview">Interview</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredApplicants.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplicants.map((applicant) => (
                    <TableRow key={applicant.id}>
                      <TableCell className="font-medium">
                        <Button
                          variant="link"
                          className="p-0 h-auto font-medium text-left hover:text-primary"
                          onClick={() => viewCandidateProfile(applicant.id)}
                        >
                          {applicant.fullName}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <a href={`mailto:${applicant.email}`} className="flex items-center gap-1 hover:text-primary">
                          <Mail className="h-3 w-3" />
                          {applicant.email}
                        </a>
                      </TableCell>
                      <TableCell>{new Date(applicant.appliedDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            applicant.status === "Pending"
                              ? "outline"
                              : applicant.status === "Reviewed"
                                ? "secondary"
                                : applicant.status === "Interview"
                                  ? "default"
                                  : applicant.status === "Accepted"
                                    ? "default"
                                    : "destructive"
                          }
                        >
                          {applicant.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Select
                            value={applicant.status}
                            onValueChange={(value) => updateApplicationStatus(applicant.id, value)}
                          >
                            <SelectTrigger className="w-32">
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
                          {applicant.resumeUrl && (
                            <Button variant="outline" size="icon" asChild>
                              <a href={applicant.resumeUrl} download target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download Resume</span>
                              </a>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Applicants Found</h3>
                <p className="text-muted-foreground text-center mb-6">
                  {applicants.length > 0
                    ? "No applicants match your current filters. Try adjusting your search criteria."
                    : "This job doesn't have any applicants yet."}
                </p>
                {applicants.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Applicant Details Section */}
        {filteredApplicants.length > 0 && (
          <div className="space-y-6">
            <Separator />
            <h2 className="text-xl font-semibold">Applicant Details</h2>
            <p className="text-muted-foreground">
              Click on an applicant in the table above to view their detailed information, including resume and cover
              letter.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

