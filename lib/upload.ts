import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export async function uploadImage(file: File, userId: string): Promise<string> {
  try {
    // 创建文件引用
    const fileExtension = file.name.split(".").pop()
    const fileName = `${userId}_${Date.now()}.${fileExtension}`
    const storageRef = ref(storage, `avatars/${fileName}`)

    // 上传文件
    const snapshot = await uploadBytes(storageRef, file)

    // 获取下载链接
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
} 