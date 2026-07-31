import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ShieldCheck, Loader2, LayoutDashboard, Clock, LogIn } from "lucide-react";
import { useVendor } from "@/hooks/use-vendor";

export const Route = createFileRoute("/post")({
  head: () => {
    const url = "https://market-link-somalia.lovable.app/post";
    return {
      meta: [
        { title: "Post a Listing — MaalsoorHub" },
        { name: "description", content: "Verified agents, agencies, developers, and businesses can post listings on MaalsoorHub. Apply for verification to get started." },
        { property: "og:title", content: "Post a Listing — MaalsoorHub" },
        { property: "og:description", content: "Apply for verification and post your listings on MaalsoorHub." },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: PostPage,
});

function PostPage() {
  const { user, isVendor, application, loading } = useVendor();

  let icon = <ShieldCheck className="h-10 w-10" />;
  let title = "Verification required";
  let text = "Only verified agents, agencies, developers, and businesses can post listings on MaalsoorHub.";
  let cta = <Link to="/vendor/apply" className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft">Apply for Verification</Link>;

  if (!user) {
    icon = <LogIn className="h-10 w-10" />;
    title = "Sign in to post";
    text = "Create a free account or sign in, then apply to become a verified vendor.";
    cta = <Link to="/auth" search={{ next: "/post" }} className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft">Sign in</Link>;
  } else if (isVendor) {
    icon = <LayoutDashboard className="h-10 w-10" />;
    title = "You're verified";
    text = "Create and manage your listings from your vendor dashboard.";
    cta = <Link to="/vendor/dashboard" className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft">Go to dashboard</Link>;
  } else if (application && application.status === "pending") {
    icon = <Clock className="h-10 w-10" />;
    title = "Application under review";
    text = `We're reviewing ${application.business_name}. You'll be able to post as soon as it's approved.`;
    cta = <Link to="/vendor/apply" className="mt-6 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold shadow-soft">View status</Link>;
  }

  return (
    <AppShell>
      <header className="border-b border-border bg-card px-4 py-4">
        <h1 className="text-lg font-bold">Post a Listing</h1>
      </header>
      <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
        {loading ? (
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        ) : (
          <>
            <div className="grad-hero mb-5 flex h-20 w-20 items-center justify-center rounded-3xl text-white shadow-card">
              {icon}
            </div>
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            {cta}
          </>
        )}
      </div>
    </AppShell>
  );
}

