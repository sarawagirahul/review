"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/Button";
import { Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
          scope: "profile email https://www.googleapis.com/auth/business.manage",
        },
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-6">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] h-[70%] w-[50%] rounded-full bg-signature-mustard/10 blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[10%] h-[70%] w-[50%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm">
              <Star className="h-5 w-5 fill-white text-white" />
            </div>
            <span className="font-display text-2xl font-semibold tracking-tight text-ink">
              Review<span className="text-primary/70">Boost</span>
            </span>
          </Link>
        </div>

        <div className="rounded-3xl bg-white/60 p-8 shadow-xl backdrop-blur-xl border border-white/40 morphism-panel">
          <div className="mb-8 text-center">
            <h1 className="mb-2 font-display text-2xl font-medium text-ink">Welcome back</h1>
            <p className="text-sm text-muted">Sign in to your business dashboard</p>
          </div>

          <Button
            size="lg"
            variant="secondary"
            className="w-full relative flex items-center justify-center gap-3 bg-white"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-hairline border-t-primary" />
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </Button>

          <p className="mt-6 text-center text-xs text-muted">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-ink">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-ink">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
