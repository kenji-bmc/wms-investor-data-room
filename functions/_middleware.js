/**
 * HTTP Basic Auth for the WMS investor data room gateway.
 *
 * Runs on every request to the Cloudflare Pages project (Pages Functions
 * middleware). Credentials are read from environment variables so no secret
 * is committed to the repo — set them in the Pages dashboard:
 *
 *   Pages project → Settings → Environment variables (Production + Preview)
 *     BASIC_AUTH_USERNAME = <chosen username>
 *     BASIC_AUTH_PASSWORD = <chosen password>   ← add as an "Encrypt"ed secret
 *
 * Then redeploy. Until both vars are set the site stays locked (fails closed).
 */

const REALM = "WMS Investor Data Room";

/** Constant-time string comparison to avoid leaking length/contents via timing. */
function timingSafeEqual(a, b) {
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  // Compare against a fixed-length buffer so length itself isn't a fast-path.
  const len = Math.max(aBytes.length, bBytes.length);
  let mismatch = aBytes.length ^ bBytes.length;
  for (let i = 0; i < len; i++) {
    mismatch |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return mismatch === 0;
}

function unauthorized() {
  return new Response("401 Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function onRequest(context) {
  const { request, env, next } = context;

  const expectedUser = env.BASIC_AUTH_USERNAME;
  const expectedPass = env.BASIC_AUTH_PASSWORD;

  // Fail closed: if creds aren't configured, never serve the site.
  if (!expectedUser || !expectedPass) {
    return new Response("Authentication is not configured.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const header = request.headers.get("Authorization") || "";
  const [scheme, encoded] = header.split(" ");

  if (scheme !== "Basic" || !encoded) {
    return unauthorized();
  }

  let decoded;
  try {
    decoded = atob(encoded);
  } catch {
    return unauthorized();
  }

  // Only split on the first ":" — passwords may contain colons.
  const sep = decoded.indexOf(":");
  const user = sep === -1 ? decoded : decoded.slice(0, sep);
  const pass = sep === -1 ? "" : decoded.slice(sep + 1);

  // Evaluate both comparisons (no short-circuit) to keep timing uniform.
  const userOk = timingSafeEqual(user, expectedUser);
  const passOk = timingSafeEqual(pass, expectedPass);

  if (!(userOk && passOk)) {
    return unauthorized();
  }

  return next();
}
