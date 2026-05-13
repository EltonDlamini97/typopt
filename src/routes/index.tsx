import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { generateEmail } from "@/lib/email.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import { Copy, Mail, Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "MailCraft — AI Email Writing Assistant" },
      {
        name: "description",
        content:
          "Generate clear, well-structured, professional emails for any purpose with AI. Choose tone, recipient, and key points — get a polished email instantly.",
      },
    ],
  }),
});

type Tone = "formal" | "semi-formal" | "friendly" | "persuasive" | "urgent";

function Index() {
  const generate = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [keyPoints, setKeyPoints] = useState("");
  const [senderName, setSenderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!purpose.trim() || !recipient.trim() || !keyPoints.trim()) {
      toast.error("Please fill in purpose, recipient, and key points.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await generate({
        data: { purpose, recipient, tone, keyPoints, senderName },
      });
      setResult(res.email);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate email");
    } finally {
      setLoading(false);
    }
  }

  function copyAll() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast.success("Email copied to clipboard");
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-soft)" }}>
      <Toaster richColors position="top-center" />
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <header className="mb-10 text-center">
          <div
            className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-primary-foreground"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "var(--shadow-elegant)",
            }}
          >
            <Mail className="h-7 w-7" />
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            MailCraft
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
            Your AI email writing assistant. Describe what you need — get a polished,
            professional email in seconds.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6 md:p-8">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="purpose">Email purpose</Label>
                <Input
                  id="purpose"
                  placeholder="e.g. Job application, meeting request, follow-up…"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient</Label>
                  <Input
                    id="recipient"
                    placeholder="e.g. Hiring manager"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                    <SelectTrigger id="tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="semi-formal">Semi-formal</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keyPoints">Key points to include</Label>
                <Textarea
                  id="keyPoints"
                  placeholder={"• Applying for Senior Designer role\n• 6 years of SaaS experience\n• Available to start next month"}
                  rows={6}
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senderName">Sender name (optional)</Label>
                <Input
                  id="senderName"
                  placeholder="e.g. Alex Morgan"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full text-primary-foreground"
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow: "var(--shadow-elegant)",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Crafting your email…
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate email
                  </>
                )}
              </Button>
            </form>
          </Card>

          <Card className="flex flex-col p-6 md:p-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Generated email</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyAll}
                disabled={!result}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>

            <div className="flex-1 rounded-lg border bg-muted/30 p-4">
              {result ? (
                <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground">
                  {result}
                </pre>
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center text-center text-sm text-muted-foreground">
                  {loading
                    ? "Writing your email…"
                    : "Fill out the form and your email will appear here."}
                </div>
              )}
            </div>
          </Card>
        </div>

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          Powered by Lovable AI · Outputs are AI-generated — review before sending.
        </footer>
      </div>
    </div>
  );
}
