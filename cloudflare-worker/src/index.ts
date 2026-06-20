interface Env {
  RESEND_API_KEY: string;
  TO_EMAIL: string;
  FROM_EMAIL?: string;
  ALLOWED_ORIGIN?: string;
}

interface FormPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  model?: string;
  zipCode?: string;
  message?: string;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function corsHeaders(origin: string, allowedOrigin?: string) {
  const allowed = allowedOrigin ?? "*";
  return {
    ...CORS_HEADERS,
    "Access-Control-Allow-Origin": allowed === "*" ? "*" : (origin === allowed ? origin : ""),
  };
}

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") ?? "";
    const ch = corsHeaders(origin, env.ALLOWED_ORIGIN);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: ch });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed" }, 405, ch);
    }

    let payload: FormPayload;
    try {
      payload = await request.json();
    } catch {
      return json({ ok: false, error: "Invalid JSON body" }, 400, ch);
    }

    const { firstName, lastName, email, phone, model, zipCode, message } = payload;

    if (!firstName || !lastName || !email || !phone || !model) {
      return json({ ok: false, error: "Missing required fields" }, 422, ch);
    }

    const html = `
      <h2 style="font-family:sans-serif;color:#1a1a1a">New ClearPath Auto Request</h2>
      <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse;width:100%;max-width:600px">
        <tr><td style="padding:8px 0;color:#666;width:160px">Name</td><td style="padding:8px 0;font-weight:600">${firstName} ${lastName}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${phone}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Vehicle</td><td style="padding:8px 0;font-weight:600">${model}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Delivery ZIP</td><td style="padding:8px 0">${zipCode ?? "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#666;vertical-align:top">Message</td><td style="padding:8px 0">${message || "—"}</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
      <p style="font-family:sans-serif;font-size:13px;color:#999">Sent via ClearPath Auto request form</p>
    `;

    const fromEmail = env.FROM_EMAIL ?? `noreply@${new URL(request.url).hostname}`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `ClearPath Auto <${fromEmail}>`,
        to: [env.TO_EMAIL],
        reply_to: email,
        subject: `New Vehicle Request: ${model} — ${firstName} ${lastName}`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error("Resend error:", resendRes.status, errText);
      return json({ ok: false, error: "Email delivery failed" }, 502, ch);
    }

    return json({ ok: true }, 200, ch);
  },
};
