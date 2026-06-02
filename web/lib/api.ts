import type { DiffReport } from "@/lib/types";

/**
 * Run a semantic diff by calling the kcl-diff service.
 *
 * The request goes to a same-origin path (`/api/diff`), which Next.js rewrites
 * to the actual service (see next.config.mjs). Same-origin means no CORS, and
 * the service URL stays configurable per environment via DIFF_API_URL.
 */
export async function runDiff(oldSrc: string, newSrc: string): Promise<DiffReport> {
  const res = await fetch("/api/diff", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ old: oldSrc, new: newSrc }),
  });

  if (!res.ok) {
    let message = `Diff failed (HTTP ${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      /* response wasn't JSON; keep the status message */
    }
    throw new Error(message);
  }

  return (await res.json()) as DiffReport;
}
