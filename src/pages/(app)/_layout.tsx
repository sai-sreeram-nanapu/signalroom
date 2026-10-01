/**
 * Dynamic app boundary — the auth + realtime data layer.
 *
 * `(app)` is a Generouted route group: the parentheses mean it does NOT appear
 * in the URL, so (app)/home.tsx is served at /home. Every page under this
 * folder is wrapped in the DeepSpace providers below, so it may call `useAuth`,
 * `useQuery`, `useMutations`, presence/Yjs hooks, etc.
 *
 * Pages OUTSIDE this folder (top level of src/pages/) get none of this — they
 * render as static pages with no auth fetch and no records WebSocket. Move a
 * page in or out of (app)/ to flip it between dynamic and static. Require
 * sign-in on top of the data layer by nesting under (app)/(protected)/.
 *
 * This is where the app chrome (Navigation) lives, so static pages can present
 * their own layout without inheriting it.
 */

import { Suspense, type ReactNode } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { DeepSpaceAuthProvider, useAuthStatus } from "deepspace";
import { RecordProvider, RecordScope } from "deepspace";
import { FlaskConical, Plus, ArrowUpRight, Radio } from "lucide-react";
import Navigation from "../../components/Navigation";
import { useToast } from "@/components/ui";
import { APP_NAME, SCOPE_ID } from "../../constants";
import { schemas } from "../../schemas";

export default function AppLayout() {
  return (
    <DeepSpaceAuthProvider>
      {/* The prerendered landing owns the document <title> and React drops it
          when <Seo> unmounts, so every route without <Seo> sets its own. */}
      <title>{APP_NAME}</title>
      <AuthBoot>
        <div className="flex h-dvh flex-col bg-background overflow-hidden">
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <Navigation />
          <div className="app-frame">
            <WorkspaceSidebar />
            <main id="main-content" className="app-scroll">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Loading...
                  </div>
                }
              >
                <Outlet />
              </Suspense>
            </main>
          </div>
        </div>
      </AuthBoot>
    </DeepSpaceAuthProvider>
  );
}

/**
 * Waits for auth to resolve, then mounts the data layer. Distinct from the SDK's `AuthGate`.
 *
 * While the initial session check is in flight, renders a fixed full-viewport
 * panel in the theme background — visually identical to the pre-JS page
 * (index.html primes <html> with the same color), so a cold load shows a
 * steady theme-colored screen until the shell appears. A lightweight connection state explains the wait during a cold session check.
 */
function AuthBoot({ children }: { children: ReactNode }) {
  const { isLoaded } = useAuthStatus();
  // Record writes (`create`/`put`/`remove`) are fire-and-forget — they resolve
  // before the server answers, so a denied or invalid write only surfaces
  // through onWriteError. Route rejections to toasts so they're never a
  // silent no-op. Keep this wiring when customizing the layout.
  const { error, warning } = useToast();

  if (!isLoaded) {
    return (
      <div aria-busy="true" className="auth-connecting">
        <span className="brand-icon">
          <Radio size={24} aria-hidden />
        </span>
        <strong>SignalRoom</strong>
        <p role="status">Connecting to your workspace…</p>
        <span className="connection-line" />
      </div>
    );
  }

  return (
    <RecordProvider
      allowAnonymous
      onWriteError={(e) =>
        e.kind === "permission"
          ? warning(e.title, e.detail)
          : error(e.title, e.detail)
      }
    >
      <RecordScope roomId={SCOPE_ID} schemas={schemas}>
        {children}
      </RecordScope>
    </RecordProvider>
  );
}

function WorkspaceSidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="app-sidebar">
      <p className="eyebrow">RESEARCH WORKSPACE</p>
      <nav aria-label="Workspace navigation">
        <Link
          className={`sidebar-link ${pathname === "/home" || (pathname.includes("/experiments/") && !pathname.endsWith("/new")) ? "active" : ""}`}
          to="/home"
        >
          <FlaskConical size={18} aria-hidden /> Experiments
        </Link>
        <Link
          className={`sidebar-link ${pathname.endsWith("/new") ? "active" : ""}`}
          to="/experiments/new"
        >
          <Plus size={18} aria-hidden /> New experiment
        </Link>
        <Link className="sidebar-link" to="/demo">
          <ArrowUpRight size={18} aria-hidden /> Product example
        </Link>
      </nav>
      <div className="sidebar-footer">
        <Radio size={22} aria-hidden />
        <p>
          Small experiments.
          <br />
          Clearer decisions.
        </p>
        <p>Powered by DeepSpace</p>
      </div>
    </aside>
  );
}
