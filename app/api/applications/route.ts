import { type NextRequest, NextResponse } from "next/server"
import { createApplication, getApplications, hasUserAppliedToJob } from "@/lib/mongodb"
import { withAuth } from "@/middleware/mongodb-auth"

export const GET = withAuth(async (req: NextRequest, user) => {
  try {
    // For candidates, get their applications
    // For recruiters, get applications for their jobs
    const applications = await getApplications(user.role === "candidate" ? user._id.toString() : undefined)

    return NextResponse.json({ applications })
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
})

export const POST = withAuth(async (req: NextRequest, user) => {
  try {
    if (user.role !== "candidate") {
      return NextResponse.json({ error: "Only candidates can submit applications" }, { status: 403 })
    }

    const applicationData = await req.json()

    // Check if user has already applied
    const hasApplied = await hasUserAppliedToJob(user._id.toString(), applicationData.jobId)

    if (hasApplied) {
      return NextResponse.json({ error: "You have already applied to this job" }, { status: 409 })
    }

    // Add user data to application
    applicationData.userId = user._id.toString()
    applicationData.email = applicationData.email || user.email
    applicationData.fullName = applicationData.fullName || user.name

    const application = await createApplication(applicationData)

    return NextResponse.json({ application }, { status: 201 })
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
})

