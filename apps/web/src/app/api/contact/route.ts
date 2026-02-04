import { NextResponse } from "next/server";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

const requiredEnv = (value: string | undefined) =>
  value && value.trim().length > 0 ? value.trim() : null;

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();

  const apiKey = requiredEnv(process.env.BREVO_API_KEY);
  const senderEmail = requiredEnv(process.env.BREVO_SENDER_EMAIL) || email;
  const senderName = requiredEnv(process.env.BREVO_SENDER_NAME) || name || "Website Contact";
  const recipientEmail =
    requiredEnv(process.env.BREVO_RECIPIENT_EMAIL) || "tedesetmarketcafe@gmail.com";

  const baseUrl = new URL("/contact", request.url);

  if (!apiKey || !senderEmail || !recipientEmail || !name || !email || !message) {
    baseUrl.searchParams.set("status", "error");
    return NextResponse.redirect(baseUrl, { status: 303 });
  }

  const payload = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: recipientEmail, name: "Tedeset Market & Cafe" }],
    replyTo: { email, name },
    subject: subject || `New message from ${name}`,
    textContent: [
      `Name: ${name}`,
      `Email: ${email}`,
      subject ? `Subject: ${subject}` : null,
      "",
      message
    ]
      .filter(Boolean)
      .join("\n")
  };

  try {
    const response = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      baseUrl.searchParams.set("status", "error");
      return NextResponse.redirect(baseUrl, { status: 303 });
    }

    baseUrl.searchParams.set("status", "success");
    return NextResponse.redirect(baseUrl, { status: 303 });
  } catch (error) {
    console.error("Brevo contact error", error);
    baseUrl.searchParams.set("status", "error");
    return NextResponse.redirect(baseUrl, { status: 303 });
  }
}
