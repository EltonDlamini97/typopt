import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  purpose: z.string().min(1).max(500),
  recipient: z.string().min(1).max(200),
  tone: z.enum(["formal", "semi-formal", "friendly", "persuasive", "urgent"]),
  keyPoints: z.string().min(1).max(3000),
  senderName: z.string().max(200).optional().default(""),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI not configured");

    const system = `You are a professional email writing assistant. Generate clear, well-structured, context-appropriate emails.

Rules:
- Output MUST start with "Subject:" on the first line, then a blank line, then "Email Body:" on its own line, then the email content.
- Include greeting, well-structured body paragraphs, and professional closing.
- Match the requested tone precisely.
- Concise but informative. Perfect grammar. Natural, not robotic. No unnecessary repetition.
- No markdown, no commentary, no preamble — only the email itself in the specified format.`;

    const user = `Email purpose: ${data.purpose}
Recipient: ${data.recipient}
Tone: ${data.tone}
Key points to include:
${data.keyPoints}
Sender name: ${data.senderName || "(not provided — use a neutral closing without a name placeholder unless natural)"}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (res.status === 429) throw new Error("Rate limit reached. Please try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Lovable Cloud settings.");
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI request failed: ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content?.trim() ?? "";
    if (!content) throw new Error("Empty AI response");
    return { email: content };
  });
