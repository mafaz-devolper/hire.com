"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Building2, Clock, FileText, Heart, MapPin, Plus, Search, Trash2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"

interface SavedJob {
  id: number
  title: string
  company: string
  location: string
  salary: string
  postedDate: string
  type: string
}

interface Application {
  id: number
  jobId: number
  jobTitle: string
  company: string
  appliedDate: string
  status: string
  location?: string
}

export default function CandidateDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "applications"

  const [activeTab, setActiveTab] = useState(defaultTab)
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [profileCompletion, setProfileCompletion] = useState(65)

  useEffect(() => {
    const savedJobsData = JSON.parse(localStorage.getItem("savedJobs") || "[]")
    setSavedJobs(savedJobsData)

    const applicationsData = JSON.parse(localStorage.getItem("applications") || "[]")
    setApplications(applicationsData)

    const interval = setInterval(() => {
      const updatedApplications = JSON.parse(localStorage.getItem("applications") || "[]")
      if (JSON.stringify(updatedApplications) !== JSON.stringify(applications)) {
        setApplications(updatedApplications)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    router.replace(`/candidate/dashboard?tab=${activeTab}`)
  }, [activeTab, router])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleRemoveSavedJob = (jobId: number) => {
    const updatedSavedJobs = savedJobs.filter((job) => job.id !== jobId)
    setSavedJobs(updatedSavedJobs)
    localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs))
    toast({
      title: "Job removed",
      description: "The job has been removed from your saved jobs.",
    })
  }

  const recommendedJobs = [
    {
      id: 6,
      title: "React Developer",
      company: "AppWorks",
      location: "Boston, MA",
      salary: "$90,000 - $120,000",
      postedDate: "5 days ago",
    },
    {
      id: 7,
      title: "Frontend Engineer",
      company: "TechInnovate",
      location: "Remote",
      salary: "$95,000 - $125,000",
      postedDate: "2 days ago",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight">Candidate Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your job applications, saved jobs, and profile
          </p>
        </div>

        {/* Profile Completion Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              A complete profile increases your chances of getting hired
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Profile Completion</span>
                <span className="text-sm font-medium">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <Link href="/candidate/profile">
                    <FileText className="h-4 w-4" /> Update Resume
                  </Link>
                </Button>
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <Link href="/candidate/profile">
                    <Plus className="h-4 w-4" /> Add Skills
                  </Link>
                </Button>
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <Link href="/candidate/profile">
                    <Plus className="h-4 w-4" /> Add Experience
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="pt-6">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">Your Applications</h2>
                <Button variant="outline" asChild>
                  <Link href="/jobs">Browse More Jobs</Link>
                </Button>
              </div>

              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <Card key={application.id}>
                      <CardHeader className="pb-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              <Link
                                href={`/jobs/${application.jobId}`}
                                className="hover:text-primary transition-colors"
                              >
                                {application.jobTitle}
                              </Link>
                            </CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Building2 className="h-4 w-4 mr-1" />
                              {application.company}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={
                              application.status === "Pending"
                                ? "outline"
                                : application.status === "Interview"
                                ? "default"
                                : application.status === "Accepted"
                                ? "default"
                                : "destructive"
                            }
                            className="mt-2 sm:mt-0"
                          >
                            {application.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-4 text-sm">
                          {application.location && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {application.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            Applied {new Date(application.appliedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col sm:flex-row sm:justify-start gap-2">
                        <Button variant="outline" asChild>
                          <Link href={`/jobs/${application.jobId}`}>View Job</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Applications Yet</h3>
                    <p className="text-muted-foreground text-center mb-6">
                      You haven&apos;t applied to any jobs yet. Start exploring opportunities!
                    </p>
                    <Button asChild>
                      <Link href="/jobs">Browse Jobs</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Saved Jobs Tab */}
          <TabsContent value="saved" className="pt-6">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">Saved Jobs</h2>
                <Button variant="outline" asChild>
                  <Link href="/jobs">Browse More Jobs</Link>
                </Button>
              </div>

              {savedJobs.length > 0 ? (
                <div className="space-y-4">
                  {savedJobs.map((job) => (
                    <Card key={job.id}>
                      <CardHeader className="pb-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              <Link href={`/jobs/${job.id}`} className="hover:text-primary transition-colors">
                                {job.title}
                              </Link>
                            </CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Building2 className="h-4 w-4 mr-1" />
                              {job.company}
                            </CardDescription>
                          </div>
                          <div className="text-right mt-2 sm:mt-0">
                            <div className="font-medium">{job.salary}</div>
                            <div className="text-sm text-muted-foreground flex items-center justify-end mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {job.postedDate}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveSavedJob(job.id)}
                            title="Remove from saved jobs"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                          <Button variant="outline" asChild>
                            <Link href={`/jobs/${job.id}`}>View Details</Link>
                          </Button>
                        </div>
                        <Button asChild>
                          <Link href={`/jobs/${job.id}?apply=true`}>Apply Now</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Saved Jobs</h3>
                    <p className="text-muted-foreground text-center mb-6">
                      You haven&apos;t saved any jobs yet. Save jobs to apply to them later!
                    </p>
                    <Button asChild>
                      <Link href="/jobs">Browse Jobs</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Recommended Jobs Tab */}
          <TabsContent value="recommended" className="pt-6">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">Recommended for You</h2>
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    placeholder="Search recommendations"
                    className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>

              {recommendedJobs.length > 0 ? (
                <div className="space-y-4">
                  {recommendedJobs.map((job) => (
                    <Card key={job.id}>
                      <CardHeader className="pb-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              <Link href={`/jobs/${job.id}`} className="hover:text-primary transition-colors">
                                {job.title}
                              </Link>
                            </CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Building2 className="h-4 w-4 mr-1" />
                              {job.company}
                            </CardDescription>
                          </div>
                          <div className="text-right mt-2 sm:mt-0">
                            <div className="font-medium">{job.salary}</div>
                            <div className="text-sm text-muted-foreground flex items-center justify-end mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {job.postedDate}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
                        <Button variant="outline" asChild>
                          <Link href={`/jobs/${job.id}`}>View Details</Link>
                        </Button>
                        <Button asChild>
                          <Link href={`/jobs/${job.id}?apply=true`}>Apply Now</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Recommendations Yet</h3>
                    <p className="text-muted-foreground text-center mb-6">
                      Complete your profile to get personalized job recommendations!
                    </p>
                    <Button asChild>
                      <Link href="/candidate/profile">Update Profile</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
