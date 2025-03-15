import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/firebase"
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.error("No user session found")
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const data = await request.json()
    const { name, email, image, phone } = data

    console.log("Updating user:", {
      userId: session.user.id,
      name,
      email,
      image,
      phone
    })

    // 检查用户文档是否存在
    const userRef = doc(db, "users", session.user.id)
    const userDoc = await getDoc(userRef)

    const userData = {
      name,
      email,
      image,
      phone,
      updatedAt: new Date().toISOString(),
    }

    if (!userDoc.exists()) {
      // 如果文档不存在，创建新文档
      await setDoc(userRef, {
        ...userData,
        createdAt: new Date().toISOString(),
      })
      console.log("Created new user document")
    } else {
      // 如果文档存在，更新文档
      await updateDoc(userRef, userData)
      console.log("Updated existing user document")
    }

    const response = {
      id: session.user.id,
      name,
      email,
      image,
      phone,
    }

    console.log("User updated successfully:", response)
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