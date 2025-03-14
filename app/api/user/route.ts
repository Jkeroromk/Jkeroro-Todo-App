import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const data = await req.json()
    const { name, email, image, phone } = data

    // Here you would typically update the user in your database
    // For now, we'll just return the updated data
    const updatedUser = {
      ...session.user,
      name,
      email,
      image,
      phone,
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("[USER_UPDATE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 