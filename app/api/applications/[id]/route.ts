import { type NextRequest, NextResponse } from "next/server"
import { getApplication, updateApplicationStatus } from "@/lib/mongodb"
import { withAuth } from "@/middleware/mongodb-auth"

export const GET = withAuth(async (req: NextRequest, user) => {
  try {
    const { params } = req
    const application = await getApplication(params.id)

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Check if user has permission to view this application
    if (
      (user.role === "candidate" && application.userId !== user._id.toString()) ||
      (user.role === "recruiter" && application.recruiterId !== user._id.toString())
    ) {
      return NextResponse.json({ error: "You do not have permission to view this application" }, { status: 403 })
    }

    return NextResponse.json({ application })
  } catch (error) {
    console.error("Error fetching application:", error)
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
  }
})

export const PATCH = withAuth(async (req: NextRequest, user) => {
  try {
    if (user.role !== "recruiter") {
      return NextResponse.json({ error: "Only recruiters can update application status" }, { status: 403 })
    }

    const { params } = req
    const { status } = await req.json()

    // Get the existing application
    const application = await getApplication(params.id)

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Update the application status
    const updatedApplication = await updateApplicationStatus(params.id, status)

    return NextResponse.json({ application: updatedApplication })
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ error: "Failed to update application status" }, { status: 500 })
  }
})

