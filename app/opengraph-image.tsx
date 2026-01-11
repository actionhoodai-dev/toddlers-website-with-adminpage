import { ImageResponse } from "next/og"

export const runtime = "nodejs"
export const alt = "Toddlers - Centre for Learning and Rehabilitation"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 128,
        background: "linear-gradient(135deg, #3fa896 0%, #5eb3d6 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>Toddlers</div>
        <div style={{ fontSize: 32, fontWeight: 400 }}>Centre for Learning and Rehabilitation</div>
      </div>
    </div>,
    {
      ...size,
    },
  )
}
