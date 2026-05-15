import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/post")({
  head: () => ({
    meta: [
      { title: "Post a Listing — MaalsoorHub" },
      { name: "description", content: "Verified agents, agencies, developers, and businesses can post listings on MaalsoorHub. Apply for verification to get started." },
      { property: "og:title", content: "Post a Listing — MaalsoorHub" },
      { property: "og:description", content: "Apply for verification and post your listings on MaalsoorHub." },
    ],
  }),
  component: PostPage,
});

function PostPage() {
  return (
    <AppShell>
      <header className="border-b border-border bg-card px-4 py-4">
        <h1 className="text-lg font-bold">Post a Listing</h1>
      </header>
      <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
        <div className="grad-hero mb-5 flex h-20 w-20 items-center justify-center rounded-3xl text-white shadow-card">
          <ShieldCheck className="h-10 w-10" />
        </div>
        <h2 className="text-lg font-bold">Verification required</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Only verified agents, agencies, developers, and businesses can post listings on MaalsoorHub.
        </p>
        <Link to="/profile" className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft">
          Apply for Verification
        </Link>
      </div>
    </AppShell>
  );
}
