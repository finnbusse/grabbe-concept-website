import { del } from "@vercel/blob"
import { revalidatePath, revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserPermissions } from "@/lib/permissions"
import { isAllowedBlobUrl } from "@/lib/upload-security"
import { writeAuditLog } from "@/lib/audit-log"

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
    }
    const permissions = await getUserPermissions(user.id)
    const canDeleteAnyDocument = permissions.documents.delete === "all"
    if (!canDeleteAnyDocument) {
      return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 })
    }

    const { url, id } = await request.json()

    if (url) {
      if (!isAllowedBlobUrl(url)) {
        return NextResponse.json({ error: "Ungültige Blob-URL" }, { status: 400 })
      }
      await del(url)
    }

    if (id) {
      await supabase.from("documents").delete().eq("id", id)
    }

    await writeAuditLog({
      action: "documents.delete",
      actorUserId: user.id,
      targetType: "document",
      targetId: typeof id === "string" ? id : null,
      metadata: { deletedBlobUrl: typeof url === "string" ? url : null },
    })

    revalidateTag("documents", "max")
    revalidatePath("/downloads")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Löschen fehlgeschlagen" }, { status: 500 })
  }
}
