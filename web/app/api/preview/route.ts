import { NextResponse } from "next/server";

/**
 * Optional preview endpoint.
 *
 * The real implementation would open a session with Zoo's geometry engine
 * (a WebSocket video stream) to render a model — that requires a server-side
 * ZOO_API_TOKEN and is intentionally deferred (see ADR 0003). Until then this
 * route reports whether a token is configured, so the UI shows the right state
 * without pretending the feature exists.
 */
export async function GET() {
  const configured = Boolean(process.env.ZOO_API_TOKEN);
  return NextResponse.json({
    configured,
    message: configured
      ? "Engine token present; render integration pending."
      : "ZOO_API_TOKEN not set; 3D preview disabled.",
  });
}
