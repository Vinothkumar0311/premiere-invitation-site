import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ornament from "@/assets/ornament.png";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin — Sign in" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        if (data.user) {
          // Try claim admin if no admin exists yet (first user). Will silently fail otherwise.
          await supabase.rpc("claim_admin").catch(() => {});
          toast.success("Account created. Signing in...");
          navigate({ to: "/admin" });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/admin" });
      }
    } catch (e: any) {
      toast.error(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md glass rounded-3xl p-8 shadow-luxury">
        <div className="text-center">
          <img src={ornament} alt="" className="mx-auto h-12 w-12 opacity-70" />
          <h1 className="mt-3 font-display text-3xl text-gradient-gold">Admin Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">{mode === "signin" ? "Sign in to manage your invitation" : "Create the first admin account"}</p>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
          </div>
          <Button type="submit" disabled={loading} className="w-full text-primary-foreground" style={{ background: "var(--gradient-gold)" }}>
            {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
          </Button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground">
          {mode === "signin" ? "First time? Create the admin account" : "Already have an account? Sign in"}
        </button>
        <Link to="/" className="mt-6 block text-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
          ← Back to invitation
        </Link>
      </div>
    </div>
  );
}
