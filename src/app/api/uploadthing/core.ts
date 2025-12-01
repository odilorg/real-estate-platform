import { createUploadthing, type FileRouter } from "uploadthing/next"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const f = createUploadthing()

export const ourFileRouter = {
  propertyImages: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
  })
    .middleware(async () => {
      const session = await getSession()
      const userId = session?.user?.id

      if (!userId) {
        throw new Error("Unauthorized")
      }

      return { userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      console.log("File URL:", file.url)

      return { uploadedBy: metadata.userId, url: file.url }
    }),

  profileImage: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await getSession()
      const userId = session?.user?.id

      if (!userId) {
        throw new Error("Unauthorized")
      }

      return { userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Update user's profile image in database
      await prisma.user.update({
        where: { id: metadata.userId },
        data: { image: file.url },
      })

      console.log("Profile image updated for userId:", metadata.userId)
      return { uploadedBy: metadata.userId, url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
