import { type NextRequest, NextResponse } from "next/server"
import { getJob, updateJob, deleteJob } from "@/lib/mongodb"
import { withAuth } from "@/middleware/mongodb-auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const job = await getJob(params.id)

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ job })
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
  }
}

export const PUT = withAuth(async (req: NextRequest, user) => {
  try {
    const { params } = req
    const jobData = await req.json()

    // Get the existing job
    const existingJob = await getJob(params.id)

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Check if the user is the job poster
    if (existingJob.postedBy !== user._id.toString()) {
      return NextResponse.json({ error: "You can only update your own job postings" }, { status: 403 })
    }

    const updatedJob = await updateJob(params.id, jobData)

    return NextResponse.json({ job: updatedJob })
  } catch (error) {
    console.error("Error updating job:", error)
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
})

export const DELETE = withAuth(async (req: NextRequest, user) => {
  try {
    const { params } = req

    // Get the existing job
    const existingJob = await getJob(params.id)

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Check if the user is the job poster
    if (existingJob.postedBy !== user._id.toString()) {
      return NextResponse.json({ error: "You can only delete your own job postings" }, { status: 403 })
    }

    await deleteJob(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
  }
})

