import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { MessageCircle } from "lucide-react";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — MaalsoorHub" },
      { name: "description", content: "MaalsoorHub doesn't store chats. Tap WhatsApp on any listing to message providers directly." },
      { property: "og:title", content: "Messages — MaalsoorHub" },
      { property: "og:description", content: "Chat with verified providers directly on WhatsApp." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Messages,
});

function Messages() {
  return (
    <AppShell>
      <header className="border-b border-border bg-card px-4 py-4">
        <h1 className="text-lg font-bold">Messages</h1>
      </header>
      <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
        <div className="bg-whatsapp mb-5 flex h-20 w-20 items-center justify-center rounded-3xl text-whatsapp-foreground shadow-card">
          <MessageCircle className="h-10 w-10" />
        </div>
        <h2 className="text-lg font-bold">Chat happens on WhatsApp</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          MaalsoorHub doesn't store messages. Tap "Chat on WhatsApp" on any listing to start a conversation directly.
        </p>
      </div>
    </AppShell>
  );
}
