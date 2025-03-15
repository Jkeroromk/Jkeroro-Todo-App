import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      console.error("No user session found")
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const data = await request.json()
    const { name, email, image, phone } = data

    const response = {
      id: session.user.id,
      name,
      email,
      image,
      phone,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error updating user:", error)
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal Server Error", 
        details: error instanceof Error ? error.message : "Unknown error" 
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
} 