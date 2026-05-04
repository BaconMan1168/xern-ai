import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Xern AI — Turn Customer Feedback into Product Specs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0d1117 0%, #111827 60%, #1a1f2e 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background orb */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-60px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,130,220,0.1) 0%, transparent 65%)",
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            position: "absolute",
            top: "64px",
            left: "80px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "4px",
                background: "#0d1117",
              }}
            />
          </div>
          <span style={{ color: "#f5f5f5", fontSize: "22px", fontWeight: 600 }}>Xern AI</span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              fontSize: "68px",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "#f5f5f5",
            }}
          >
            From Raw Feedback
          </div>
          <div
            style={{
              fontSize: "68px",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "#fbbf24",
            }}
          >
            to Actionable Specs
          </div>
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: "22px",
            color: "#9ca3af",
            lineHeight: 1.5,
            maxWidth: "680px",
          }}
        >
          AI-powered synthesis of customer feedback into structured product specifications.
        </div>
      </div>
    ),
    { ...size }
  );
}
