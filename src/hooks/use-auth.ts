import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  display_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        // defer to avoid deadlocks
        setTimeout(() => {
          supabase
            .from("profiles")
            .select("*")
            .eq("id", s.user.id)
            .maybeSingle()
            .then(({ data }) => setProfile((data as Profile) ?? null));
        }, 0);
      } else {
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
      if (s?.user) {
        supabase
          .from("profiles")
          .select("*")
          .eq("id", s.user.id)
          .maybeSingle()
          .then(({ data }) => setProfile((data as Profile) ?? null));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    session,
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    signOut: () => supabase.auth.signOut(),
  };
}
