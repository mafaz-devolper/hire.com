"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Briefcase, Building2, Clock, MapPin, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function JobsPage() {
  const searchParams = useSearchParams()
  const initialSearchTerm = searchParams.get("search") || ""
  const initialLocationFilter = searchParams.get("location") || ""

  const [allJobs, setAllJobs] = useState([])
  const [jobs, setJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [locationFilter, setLocationFilter] = useState(initialLocationFilter)
  const [sortBy, setSortBy] = useState("relevance")
  const [jobTypeFilter, setJobTypeFilter] = useState("all")
  const [experienceFilters, setExperienceFilters] = useState<string[]>([])
  const [salaryFilters, setSalaryFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load jobs from localStorage
  useEffect(() => {
    const loadJobs = () => {
      setIsLoading(true)
      try {
        const postedJobs = JSON.parse(localStorage.getItem("postedJobs") || "[]")
        const defaultJobs = [
          {
            id: 1,
            title: "Senior Frontend Developer",
            company: "TechCorp",
            location: "San Francisco, CA",
            type: "Full-time",
            salary: "$120,000 - $150,000",
            salaryRange: [120000, 150000],
            posted: "2 days ago",
            description: "We are looking for an experienced Frontend Developer to join our team...",
            tags: ["React", "TypeScript", "Next.js"],
            experience: "Senior Level",
            status: "Active",
          },
          {
            id: 2,
            title: "Backend Engineer",
            company: "DataSystems",
            location: "Remote",
            type: "Full-time",
            salary: "$110,000 - $140,000",
            salaryRange: [110000, 140000],
            posted: "1 week ago",
            description: "Join our backend team to build scalable APIs and services...",
            tags: ["Node.js", "Python", "AWS"],
            experience: "Mid Level",
            status: "Active",
          },
          {
            id: 3,
            title: "UX/UI Designer",
            company: "CreativeStudio",
            location: "New York, NY",
            type: "Contract",
            salary: "$90,000 - $120,000",
            salaryRange: [90000, 120000],
            posted: "3 days ago",
            description: "Design beautiful and intuitive user interfaces for our products...",
            tags: ["Figma", "Adobe XD", "UI/UX"],
            experience: "Mid Level",
            status: "Active",
          },
          {
            id: 4,
            title: "DevOps Engineer",
            company: "CloudTech",
            location: "Remote",
            type: "Full-time",
            salary: "$130,000 - $160,000",
            salaryRange: [130000, 160000],
            posted: "Just now",
            description: "Manage our cloud infrastructure and CI/CD pipelines...",
            tags: ["Docker", "Kubernetes", "AWS"],
            experience: "Senior Level",
            status: "Active",
          },
          {
            id: 5,
            title: "Product Manager",
            company: "InnovateCo",
            location: "Austin, TX",
            type: "Full-time",
            salary: "$115,000 - $145,000",
            salaryRange: [115000, 145000],
            posted: "5 days ago",
            description: "Lead product development and work with cross-functional teams...",
            tags: ["Product Management", "Agile", "Scrum"],
            experience: "Senior Level",
            status: "Active",
          },
          {
            id: 6,
            title: "Junior Web Developer",
            company: "StartupHub",
            location: "Chicago, IL",
            type: "Full-time",
            salary: "$70,000 - $90,000",
            salaryRange: [70000, 90000],
            posted: "1 day ago",
            description: "Join our team to build modern web applications...",
            tags: ["JavaScript", "HTML", "CSS"],
            experience: "Entry Level",
            status: "Active",
          },
          {
            id: 7,
            title: "Data Scientist",
            company: "AnalyticsPro",
            location: "Remote",
            type: "Contract",
            salary: "$100,000 - $130,000",
            salaryRange: [100000, 130000],
            posted: "4 days ago",
            description: "Analyze complex data sets and build predictive models...",
            tags: ["Python", "Machine Learning", "SQL"],
            experience: "Mid Level",
            status: "Active",
          },
        ]

        const combinedJobs = [
          ...defaultJobs,
          ...postedJobs.filter((job: any) => job.status === "Active"),
        ]
        const uniqueJobs = Array.from(
          new Map(combinedJobs.map((job: any) => [job.id, job])).values(),
        )

        setAllJobs(uniqueJobs)
        setJobs(uniqueJobs)
      } catch (error) {
        console.error("Error loading jobs:", error)
        setAllJobs([])
        setJobs([])
      } finally {
        setIsLoading(false)
      }
    }

    loadJobs()
  }, [])

  // Apply filters and search
  useEffect(() => {
    let filteredJobs = [...allJobs]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filteredJobs = filteredJobs.filter(
        (job: any) =>
          job.title.toLowerCase().includes(term) ||
          job.company.toLowerCase().includes(term) ||
          job.tags.some((tag: string) => tag.toLowerCase().includes(term)),
      )
    }

    if (locationFilter) {
      const location = locationFilter.toLowerCase()
      filteredJobs = filteredJobs.filter((job: any) =>
        job.location.toLowerCase().includes(location),
      )
    }

    if (jobTypeFilter !== "all") {
      filteredJobs = filteredJobs.filter(
        (job: any) =>
          job.type.toLowerCase() === jobTypeFilter.toLowerCase(),
      )
    }

    if (experienceFilters.length > 0) {
      filteredJobs = filteredJobs.filter((job: any) =>
        experienceFilters.includes(job.experience),
      )
    }

    if (salaryFilters.length > 0) {
      filteredJobs = filteredJobs.filter((job: any) => {
        const [min, max] = job.salaryRange
        return salaryFilters.some((range) => {
          if (range === "range1") return max <= 50000
          if (range === "range2") return min >= 50000 && max <= 100000
          if (range === "range3") return min >= 100000 && max <= 150000
          if (range === "range4") return min >= 150000
          return false
        })
      })
    }

    if (sortBy === "recent") {
      filteredJobs = [...filteredJobs].sort((a: any, b: any) => {
        if (a.posted.includes("Just now")) return -1
        if (b.posted.includes("Just now")) return 1
        if (a.posted.includes("day") && b.posted.includes("week")) return -1
        if (a.posted.includes("week") && b.posted.includes("day")) return 1
        return 0
      })
    } else if (sortBy === "salary-high") {
      filteredJobs = [...filteredJobs].sort(
        (a: any, b: any) => b.salaryRange[1] - a.salaryRange[1],
      )
    } else if (sortBy === "salary-low") {
      filteredJobs = [...filteredJobs].sort(
        (a: any, b: any) => a.salaryRange[0] - b.salaryRange[0],
      )
    }

    setJobs(filteredJobs)
  }, [
    searchTerm,
    locationFilter,
    sortBy,
    jobTypeFilter,
    experienceFilters,
    salaryFilters,
    allJobs,
  ])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const toggleExperienceFilter = (value: string) => {
    setExperienceFilters((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    )
  }

  const toggleSalaryFilter = (value: string) => {
    setSalaryFilters((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    )
  }

  const clearFilters = () => {
    setSearchTerm("")
    setLocationFilter("")
    setSortBy("relevance")
    setJobTypeFilter("all")
    setExperienceFilters([])
    setSalaryFilters([])
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-8">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight">Browse Jobs</h1>
          <p className="text-muted-foreground mt-2">
            Find the perfect job opportunity that matches your skills and experience
          </p>
        </div>
        {/* Search and Filter */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-3">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Job title, keywords, or company"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Location or Remote"
                  className="pl-10"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
              <Button type="submit" className="whitespace-nowrap">
                Search Jobs
              </Button>
            </form>
          </div>
          <div className="flex flex-col gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="salary-high">Highest Salary</SelectItem>
                <SelectItem value="salary-low">Lowest Salary</SelectItem>
              </SelectContent>
            </Select>
            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {/* Sidebar Filters */}
          <aside className="hidden md:block space-y-6 border-r pr-4">
            <div>
              <h3 className="font-medium mb-2">Experience Level</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="entry"
                    checked={experienceFilters.includes("Entry Level")}
                    onCheckedChange={() => toggleExperienceFilter("Entry Level")}
                  />
                  <Label htmlFor="entry">Entry Level</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mid"
                    checked={experienceFilters.includes("Mid Level")}
                    onCheckedChange={() => toggleExperienceFilter("Mid Level")}
                  />
                  <Label htmlFor="mid">Mid Level</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="senior"
                    checked={experienceFilters.includes("Senior Level")}
                    onCheckedChange={() => toggleExperienceFilter("Senior Level")}
                  />
                  <Label htmlFor="senior">Senior Level</Label>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium mb-2">Salary Range</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="range1"
                    checked={salaryFilters.includes("range1")}
                    onCheckedChange={() => toggleSalaryFilter("range1")}
                  />
                  <Label htmlFor="range1">$0 - $50,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="range2"
                    checked={salaryFilters.includes("range2")}
                    onCheckedChange={() => toggleSalaryFilter("range2")}
                  />
                  <Label htmlFor="range2">$50,000 - $100,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="range3"
                    checked={salaryFilters.includes("range3")}
                    onCheckedChange={() => toggleSalaryFilter("range3")}
                  />
                  <Label htmlFor="range3">$100,000 - $150,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="range4"
                    checked={salaryFilters.includes("range4")}
                    onCheckedChange={() => toggleSalaryFilter("range4")}
                  />
                  <Label htmlFor="range4">$150,000+</Label>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium mb-2">Job Type</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="full-time-filter"
                    checked={jobTypeFilter === "full-time"}
                    onCheckedChange={() =>
                      setJobTypeFilter(jobTypeFilter === "full-time" ? "all" : "full-time")
                    }
                  />
                  <Label htmlFor="full-time-filter">Full-time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="part-time-filter"
                    checked={jobTypeFilter === "part-time"}
                    onCheckedChange={() =>
                      setJobTypeFilter(jobTypeFilter === "part-time" ? "all" : "part-time")
                    }
                  />
                  <Label htmlFor="part-time-filter">Part-time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="contract-filter"
                    checked={jobTypeFilter === "contract"}
                    onCheckedChange={() =>
                      setJobTypeFilter(jobTypeFilter === "contract" ? "all" : "contract")
                    }
                  />
                  <Label htmlFor="contract-filter">Contract</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remote-filter"
                    checked={locationFilter.toLowerCase().includes("remote")}
                    onCheckedChange={(checked) =>
                      setLocationFilter(checked ? "Remote" : "")
                    }
                  />
                  <Label htmlFor="remote-filter">Remote</Label>
                </div>
              </div>
            </div>
            <Separator />
            <Button variant="outline" className="w-full" onClick={clearFilters}>
              Clear Filters
            </Button>
          </aside>
          {/* Job Listings */}
          <div className="md:col-span-3 space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Showing {jobs.length} jobs</p>
              <Button
                variant="outline"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
            </div>
            {/* Mobile Filters */}
            {showFilters && (
              <div className="md:hidden space-y-6 p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium mb-2">Experience Level</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="entry-mobile"
                        checked={experienceFilters.includes("Entry Level")}
                        onCheckedChange={() => toggleExperienceFilter("Entry Level")}
                      />
                      <Label htmlFor="entry-mobile">Entry Level</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mid-mobile"
                        checked={experienceFilters.includes("Mid Level")}
                        onCheckedChange={() => toggleExperienceFilter("Mid Level")}
                      />
                      <Label htmlFor="mid-mobile">Mid Level</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="senior-mobile"
                        checked={experienceFilters.includes("Senior Level")}
                        onCheckedChange={() => toggleExperienceFilter("Senior Level")}
                      />
                      <Label htmlFor="senior-mobile">Senior Level</Label>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium mb-2">Salary Range</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="range1-mobile"
                        checked={salaryFilters.includes("range1")}
                        onCheckedChange={() => toggleSalaryFilter("range1")}
                      />
                      <Label htmlFor="range1-mobile">$0 - $50,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="range2-mobile"
                        checked={salaryFilters.includes("range2")}
                        onCheckedChange={() => toggleSalaryFilter("range2")}
                      />
                      <Label htmlFor="range2-mobile">$50,000 - $100,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="range3-mobile"
                        checked={salaryFilters.includes("range3")}
                        onCheckedChange={() => toggleSalaryFilter("range3")}
                      />
                      <Label htmlFor="range3-mobile">$100,000 - $150,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="range4-mobile"
                        checked={salaryFilters.includes("range4")}
                        onCheckedChange={() => toggleSalaryFilter("range4")}
                      />
                      <Label htmlFor="range4-mobile">$150,000+</Label>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
            {jobs.length > 0 ? (
              <div className="space-y-6">
                {jobs.map((job: any) => (
                  <Card key={job.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">
                            <Link
                              href={`/jobs/${job.id}`}
                              className="hover:text-primary transition-colors"
                            >
                              {job.title}
                            </Link>
                          </CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Building2 className="h-4 w-4 mr-1" />
                            {job.company}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{job.salary}</div>
                          <div className="text-sm text-muted-foreground flex items-center justify-end mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {job.posted}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {job.type}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </Badge>
                        {job.tags &&
                          job.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {job.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" asChild>
                        <Link href={`/jobs/${job.id}`}>View Details</Link>
                      </Button>
                      <Link href={`/jobs/${job.id}?apply=true`}>
                        <Button>Apply Now</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Search className="h-12 w-12 text-muted-foreground" />
                  <h3 className="text-xl font-medium">No jobs found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button onClick={clearFilters}>Clear All Filters</Button>
                </div>
              </Card>
            )}
            {jobs.length > 0 && (
              <div className="flex justify-center">
                <Button variant="outline">Load More Jobs</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
