export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">LAUF OS</h1>
          <p className="mt-2 text-text-secondary">
            Personal command center for building in public
          </p>
        </div>

        <div className="space-y-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 font-medium text-white transition-colors hover:bg-accent/80">
            Sign in with Email
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-text-tertiary">
                Or continue with
              </span>
            </div>
          </div>

          <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 font-medium transition-colors hover:bg-surface-elevated">
            Sign in with X
          </button>
        </div>

        <p className="text-center text-xs text-text-tertiary">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
