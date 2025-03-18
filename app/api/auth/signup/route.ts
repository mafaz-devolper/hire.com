import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail, createUser } from "@/lib/mongodb"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, company } = await req.json()

    // Check if user with this email already exists
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists. Please use a different email address." },
        { status: 409 },
      )
    }

    // Create new user
    const newUser = {
      name,
      email,
      password, // In a real app, you would hash this password
      role,
      company: role === "recruiter" ? company : null,
      createdAt: new Date().toISOString(),
    }

    const user = await createUser(newUser)

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "An error occurred during signup." }, { status: 500 })
  }
}

