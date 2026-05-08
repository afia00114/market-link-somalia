import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, Plus, MessageCircle, User } from "lucide-react";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/post", label: "Post", icon: Plus, primary: true },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur safe-bottom">
      <ul className="grid grid-cols-5 px-2 pt-2">
        {tabs.map(({ to, label, icon: Icon, primary }) => {
          const active = pathname === to || (to === "/home" && pathname === "/");
          if (primary) {
            return (
              <li key={to} className="flex justify-center">
                <Link
                  to={to}
                  className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card transition-transform active:scale-95"
                  aria-label={label}
                >
                  <Icon className="h-6 w-6" />
                </Link>
              </li>
            );
          }
          return (
            <li key={to}>
              <Link
                to={to}
                className={`flex flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
