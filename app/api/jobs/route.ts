import { type NextRequest, NextResponse } from "next/server"
import { getJobs, createJob } from "@/lib/mongodb"
import { withAuth } from "@/middleware/mongodb-auth"

export async function GET() {
  try {
    const jobs = await getJobs()
    return NextResponse.json({ jobs })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export const POST = withAuth(async (req: NextRequest, user) => {
  try {
    if (user.role !== "recruiter") {
      return NextResponse.json({ error: "Only recruiters can post jobs" }, { status: 403 })
    }

    const jobData = await req.json()

    // Add additional job data
    jobData.postedBy = user._id.toString()
    jobData.company = jobData.company || user.company
    jobData.status = "Active"

    const job = await createJob(jobData)

    return NextResponse.json({ job }, { status: 201 })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
})

