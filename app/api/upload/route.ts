import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
    return NextResponse.json({
        error: "Image uploads are temporarily disabled. Storage setup pending."
    }, { status: 503 })
}
