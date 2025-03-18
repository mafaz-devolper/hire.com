"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Download, Loader2, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export default function ResumeTemplatesPage() {
  const router = useRouter()
  const resumeRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("template1")
  const [isGenerating, setIsGenerating] = useState(false)
  const [resumeData, setResumeData] = useState({
    fullName: "John Doe",
    title: "Senior Frontend Developer",
    email: "john.doe@example.com",
    phone: "(123) 456-7890",
    location: "San Francisco, CA",
    summary:
      "Experienced frontend developer with 5+ years of experience building responsive web applications using React, TypeScript, and Next.js.",
    skills: ["React", "TypeScript", "Next.js", "JavaScript", "HTML", "CSS", "Redux", "Git"],
    experience: [
      {
        id: 1,
        company: "TechCorp",
        position: "Senior Frontend Developer",
        startDate: "Jan 2021",
        endDate: "Present",
        description:
          "Led the development of the company's main product using React and TypeScript. Improved performance by 40% and implemented CI/CD pipelines.",
      },
      {
        id: 2,
        company: "WebSolutions",
        position: "Frontend Developer",
        startDate: "Mar 2018",
        endDate: "Dec 2020",
        description:
          "Developed responsive web applications using React and Redux. Collaborated with designers to implement UI/UX improvements.",
      },
    ],
    education: [
      {
        id: 1,
        institution: "University of Technology",
        degree: "Bachelor of Science",
        field: "Computer Science",
        year: "2018",
      },
    ],
  })

  // Load user profile data if available
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile)
      setResumeData((prev) => ({
        ...prev,
        fullName:
          profileData.firstName && profileData.lastName
            ? `${profileData.firstName} ${profileData.lastName}`
            : prev.fullName,
        email: profileData.email || prev.email,
        phone: profileData.phone || prev.phone,
        location: profileData.location || prev.location,
        title: profileData.headline || prev.title,
        summary: profileData.summary || prev.summary,
      }))
    }

    // Load skills if available
    const savedSkills = localStorage.getItem("userSkills")
    if (savedSkills) {
      const skills = JSON.parse(savedSkills)
      setResumeData((prev) => ({
        ...prev,
        skills: skills.length > 0 ? skills : prev.skills,
      }))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setResumeData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...resumeData.skills]
    updatedSkills[index] = value
    setResumeData((prev) => ({
      ...prev,
      skills: updatedSkills,
    }))
  }

  const addSkill = () => {
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }))
  }

  const removeSkill = (index: number) => {
    const updatedSkills = [...resumeData.skills]
    updatedSkills.splice(index, 1)
    setResumeData((prev) => ({
      ...prev,
      skills: updatedSkills,
    }))
  }

  const handleExperienceChange = (id: number, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }))
  }

  const removeExperience = (id: number) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }))
  }

  const handleEducationChange = (id: number, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }))
  }

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          institution: "",
          degree: "",
          field: "",
          year: "",
        },
      ],
    }))
  }

  const removeEducation = (id: number) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }

  const downloadAsPDF = async () => {
    if (!resumeRef.current) return

    setIsGenerating(true)

    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`${resumeData.fullName.replace(/\s+/g, "_")}_resume.pdf`)

      toast({
        title: "Resume downloaded",
        description: "Your resume has been downloaded as a PDF file.",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Download failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight">Resume Templates</h1>
          <p className="text-muted-foreground mt-2">
            Create and download professional resumes in minutes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Section */}
          <div className="w-full">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Resume Editor</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Customize your resume content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" value={resumeData.fullName} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input id="title" name="title" value={resumeData.title} onChange={handleInputChange} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={resumeData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" value={resumeData.phone} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={resumeData.location} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      name="summary"
                      value={resumeData.summary}
                      onChange={handleInputChange}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                <Separator />

                {/* Skills */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Skills</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                      Add Skill
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {resumeData.skills.map((skill, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={skill}
                          onChange={(e) => handleSkillChange(index, e.target.value)}
                          placeholder="e.g. React"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSkill(index)}
                          disabled={resumeData.skills.length <= 1}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />

                {/* Work Experience */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Work Experience</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                      Add Experience
                    </Button>
                  </div>
                  <div className="space-y-6">
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="space-y-4 border p-4 rounded-md">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Work Experience</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeExperience(exp.id)}
                            disabled={resumeData.experience.length <= 1}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(exp.id, "company", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Position</Label>
                          <Input
                            value={exp.position}
                            onChange={(e) => handleExperienceChange(exp.id, "position", e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                              value={exp.startDate}
                              onChange={(e) => handleExperienceChange(exp.id, "startDate", e.target.value)}
                              placeholder="e.g. Jan 2020"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                              value={exp.endDate}
                              onChange={(e) => handleExperienceChange(exp.id, "endDate", e.target.value)}
                              placeholder="e.g. Present"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={exp.description}
                            onChange={(e) => handleExperienceChange(exp.id, "description", e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />

                {/* Education */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Education</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addEducation}>
                      Add Education
                    </Button>
                  </div>
                  <div className="space-y-6">
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="space-y-4 border p-4 rounded-md">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Education</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeEducation(edu.id)}
                            disabled={resumeData.education.length <= 1}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label>Institution</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => handleEducationChange(edu.id, "institution", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Degree</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(edu.id, "degree", e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Field of Study</Label>
                            <Input
                              value={edu.field}
                              onChange={(e) => handleEducationChange(edu.id, "field", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Year</Label>
                            <Input
                              value={edu.year}
                              onChange={(e) => handleEducationChange(edu.id, "year", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="w-full">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-center justify-between pb-2">
                <div className="mb-4 sm:mb-0">
                  <CardTitle className="text-lg">Resume Preview</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Choose a template to preview your resume
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={downloadAsPDF} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="px-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 border-b">
                    <TabsTrigger value="template1" className="py-2">Modern</TabsTrigger>
                    <TabsTrigger value="template2" className="py-2">Classic</TabsTrigger>
                    <TabsTrigger value="template3" className="py-2">Minimal</TabsTrigger>
                  </TabsList>

                  {/* Template 1: Modern */}
                  <TabsContent value="template1" className="pt-6">
                    <div className="border rounded-md p-6 bg-white" ref={resumeRef}>
                      <div className="space-y-6">
                        <div className="border-b pb-6">
                          <h1 className="text-3xl font-bold text-primary">{resumeData.fullName}</h1>
                          <p className="text-lg text-muted-foreground">{resumeData.title}</p>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm">
                            <span>{resumeData.email}</span>
                            <span>{resumeData.phone}</span>
                            <span>{resumeData.location}</span>
                          </div>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold mb-2">Summary</h2>
                          <p>{resumeData.summary}</p>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold mb-2">Skills</h2>
                          <div className="flex flex-wrap gap-2">
                            {resumeData.skills.map((skill, index) => (
                              <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold mb-4">Experience</h2>
                          <div className="space-y-4">
                            {resumeData.experience.map((exp) => (
                              <div key={exp.id} className="border-l-2 border-primary pl-4">
                                <h3 className="font-bold">{exp.position}</h3>
                                <p className="text-primary font-medium">{exp.company}</p>
                                <p className="text-sm text-muted-foreground">
                                  {exp.startDate} - {exp.endDate}
                                </p>
                                <p className="mt-2">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold mb-4">Education</h2>
                          <div className="space-y-4">
                            {resumeData.education.map((edu) => (
                              <div key={edu.id}>
                                <h3 className="font-bold">{edu.institution}</h3>
                                <p>
                                  {edu.degree} in {edu.field}
                                </p>
                                <p className="text-sm text-muted-foreground">{edu.year}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Template 2: Classic */}
                  <TabsContent value="template2" className="pt-6">
                    <div className="border rounded-md p-6 bg-white" ref={activeTab === "template2" ? resumeRef : null}>
                      <div className="text-center mb-6 pb-6 border-b">
                        <h1 className="text-3xl font-bold uppercase">{resumeData.fullName}</h1>
                        <p className="text-lg mt-1">{resumeData.title}</p>
                        <div className="flex justify-center gap-4 mt-2 text-sm">
                          <span>{resumeData.email}</span>
                          <span>|</span>
                          <span>{resumeData.phone}</span>
                          <span>|</span>
                          <span>{resumeData.location}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-6">
                          <div>
                            <h2 className="text-lg font-bold uppercase border-b pb-1 mb-2">Skills</h2>
                            <ul className="list-disc list-inside space-y-1">
                              {resumeData.skills.map((skill, index) => (
                                <li key={index}>{skill}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h2 className="text-lg font-bold uppercase border-b pb-1 mb-2">Education</h2>
                            <div className="space-y-4">
                              {resumeData.education.map((edu) => (
                                <div key={edu.id}>
                                  <h3 className="font-bold">{edu.institution}</h3>
                                  <p className="text-sm">
                                    {edu.degree} in {edu.field}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{edu.year}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                          <div>
                            <h2 className="text-lg font-bold uppercase border-b pb-1 mb-2">Professional Summary</h2>
                            <p>{resumeData.summary}</p>
                          </div>
                          <div>
                            <h2 className="text-lg font-bold uppercase border-b pb-1 mb-2">Work Experience</h2>
                            <div className="space-y-6">
                              {resumeData.experience.map((exp) => (
                                <div key={exp.id}>
                                  <div className="flex justify-between">
                                    <h3 className="font-bold">{exp.position}</h3>
                                    <p className="text-sm">
                                      {exp.startDate} - {exp.endDate}
                                    </p>
                                  </div>
                                  <p className="italic">{exp.company}</p>
                                  <p className="mt-2">{exp.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Template 3: Minimal */}
                  <TabsContent value="template3" className="pt-6">
                    <div className="border rounded-md p-6 bg-white" ref={activeTab === "template3" ? resumeRef : null}>
                      <div className="space-y-6">
                        <div>
                          <h1 className="text-2xl font-bold">{resumeData.fullName}</h1>
                          <p className="text-primary">{resumeData.title}</p>
                          <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                            <span>{resumeData.email}</span>
                            <span>•</span>
                            <span>{resumeData.phone}</span>
                            <span>•</span>
                            <span>{resumeData.location}</span>
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-sm">{resumeData.summary}</p>
                        </div>
                        <Separator />
                        <div>
                          <h2 className="text-sm font-bold uppercase tracking-wider mb-4">Experience</h2>
                          <div className="space-y-6">
                            {resumeData.experience.map((exp) => (
                              <div key={exp.id}>
                                <div className="flex justify-between items-baseline">
                                  <h3 className="font-medium">{exp.position}</h3>
                                  <p className="text-xs">
                                    {exp.startDate} - {exp.endDate}
                                  </p>
                                </div>
                                <p className="text-sm text-primary">{exp.company}</p>
                                <p className="text-sm mt-2">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <h2 className="text-sm font-bold uppercase tracking-wider mb-4">Education</h2>
                            <div className="space-y-4">
                              {resumeData.education.map((edu) => (
                                <div key={edu.id}>
                                  <h3 className="font-medium">{edu.institution}</h3>
                                  <p className="text-sm">
                                    {edu.degree} in {edu.field}, {edu.year}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h2 className="text-sm font-bold uppercase tracking-wider mb-4">Skills</h2>
                            <div className="flex flex-wrap gap-1">
                              {resumeData.skills.map((skill, index) => (
                                <span key={index} className="text-xs border px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={downloadAsPDF} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Resume as PDF
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
