# MailCraft — AI Email Writing Assistant

MailCraft is an AI-powered email writing assistant. Describe what you need — purpose,
recipient, tone, and key points — and get a polished, professional email in seconds.

## Features

- **AI email generation** — produces a complete email with a clear subject line, proper
  greeting, well-structured body, and professional closing.
- **Tone control** — choose from Formal, Semi-formal, Friendly, Persuasive, or Urgent.
- **Key points input** — provide the bullet points that matter; the AI weaves them into a
  natural-sounding message.
- **Copy to clipboard** — grab the finished email with one click.
- **Polished UI** — clean, responsive layout built with Tailwind CSS and shadcn/ui.

## How it works

1. Enter the email **purpose** (e.g. job application, meeting request, follow-up).
2. Specify the **recipient** (e.g. hiring manager, client, team).
3. Pick a **tone**.
4. List the **key points** to include.
5. Optionally add a **sender name** for the closing.
6. Click **Generate email** — the email appears in the right-hand panel, ready to copy.

The output always follows this format:

```text
Subject:
[Email subject]

Email Body:
[Full email content]
```

## Tech stack

- **Framework:** [TanStack Start](https://tanstack.com/start/latest) (React 19, SSR)
- **Build tool:** Vite 7
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **AI:** Lovable AI Gateway (chat completions)
- **Backend:** Lovable Cloud (Supabase)
- **Deployment target:** Cloudflare Workers (Edge)

## Project structure

```text
src/
├─ lib/
│  └─ email.functions.ts   # createServerFn that calls the AI Gateway
├─ routes/
│  └─ index.tsx            # Main UI: form + generated-email panel
├─ components/ui/          # shadcn/ui primitives (Button, Card, Input, …)
├─ integrations/supabase/  # Auto-generated Supabase client
└─ styles.css             # Theme tokens & Tailwind config
```

## Getting started

```bash
# Install dependencies
bun install

# Start the dev server
bun run dev

# Build for production
bun run build

# Preview the production build
bun run preview
```

## Environment variables

The app reads the following at runtime. Secrets are managed through Lovable — never
commit them.

| Variable         | Where it's used         | Purpose                         |
| ---------------- | ----------------------- | ------------------------------- |
| `LOVABLE_API_KEY`| `src/lib/email.functions.ts` | Authenticates AI Gateway calls |

## Notes

- AI outputs are generated and may contain errors — review before sending.
- The model is tuned for clear, natural, professional prose; it avoids markdown and
  commentary in the output.

---

Powered by Lovable AI.
