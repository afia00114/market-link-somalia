import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, Plus, MessageCircle, User } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";

type Tab = { to: string; key: string; icon: typeof Home; primary?: boolean };
const tabs: Tab[] = [
  { to: "/home", key: "nav.home", icon: Home },
  { to: "/explore", key: "nav.explore", icon: Compass },
  { to: "/post", key: "nav.post", icon: Plus, primary: true },
  { to: "/messages", key: "nav.messages", icon: MessageCircle },
  { to: "/profile", key: "nav.profile", icon: User },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const { t } = useI18n();
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur safe-bottom">
      <ul className="grid grid-cols-5 px-2 pt-2">
        {tabs.map(({ to, key, icon: Icon, primary }) => {
          const label = t(key);
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
