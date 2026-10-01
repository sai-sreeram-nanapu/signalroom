import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Plus,
  Search,
  FlaskConical,
  Radio,
  FileText,
  ArrowRight,
} from "lucide-react";
import { useAuth, useQuery } from "deepspace";
import { AnimatedNumber } from "../../components/AnimatedNumber";
import { demoExperiment } from "../../lib/demo";
import type { Experiment } from "../../lib/signalroom";
export default function Home() {
  const { userId, isSignedIn } = useAuth();
  const { records, status, error } = useQuery<Experiment>("experiments", {
    where: { creatorId: userId || "__signed_out__" },
    orderBy: "createdAt",
    orderDir: "desc",
  });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const visible = records.filter(
    (r) =>
      (filter === "all" || r.data.status === filter) &&
      `${r.data.title} ${r.data.audience}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <div className="workspace studio-workspace">
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h1>Message experiments</h1>
          <p>A home for your ideas, feedback, and next moves.</p>
        </div>
        <Link className="button" to="/experiments/new">
          <Plus size={18} aria-hidden /> New experiment
        </Link>
      </div>
      <div className="summary-strip">
        {[
          {
            label: "Total experiments",
            count: records.length,
            icon: FlaskConical,
          },
          {
            label: "Accepting feedback",
            count: records.filter((r) => r.data.status === "published").length,
            icon: Radio,
          },
          {
            label: "Private drafts",
            count: records.filter((r) => r.data.status === "draft").length,
            icon: FileText,
          },
        ].map((item) => (
          <div key={item.label}>
            <div className="stat-heading">
              <span>{item.label}</span>
              <item.icon size={18} aria-hidden />
            </div>
            <strong><AnimatedNumber value={item.count} /></strong>
            <p>
              {item.label === "Accepting feedback"
                ? "Published and open for responses"
                : item.label === "Private drafts"
                  ? "Ready when you are"
                  : "Every question starts here"}
            </p>
          </div>
        ))}
      </div>
      {!isSignedIn ? (
        <section className="welcome-card">
          <div className="feature-icon">
            <FlaskConical size={25} aria-hidden />
          </div>
          <div>
            <p className="eyebrow">A CLEARER NEXT MOVE STARTS HERE</p>
            <h2>Give your next idea a little signal.</h2>
            <p>
              Sign in to create experiments and collect real feedback. Or
              explore the example to see how it works.
            </p>
            <div className="cta-row">
              <Link className="button" to="/experiments/new">
                Create your first experiment{" "}
                <ArrowRight size={17} aria-hidden />
              </Link>
              <Link className="text-link" to="/demo">
                Explore the example <ArrowUpRight size={15} aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          <div className="list-toolbar">
            <div
              className="filter-tabs"
              role="group"
              aria-label="Filter experiments"
            >
              {[
                { id: "all", label: "All experiments" },
                { id: "published", label: "Published" },
                { id: "draft", label: "Drafts" },
                { id: "closed", label: "Closed" },
              ].map((item) => (
                <button
                  key={item.id}
                  aria-pressed={filter === item.id}
                  onClick={() => setFilter(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="search-field">
              <Search size={17} aria-hidden />
              <input
                aria-label="Search experiments"
                placeholder="Search experiments…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          {status === "loading" ? (
            <div className="busy-panel" aria-busy="true">
              Connecting to your experiments…
            </div>
          ) : status === "error" ? (
            <div className="error-message" role="alert">
              {String(
                error ||
                  "Could not connect to your experiments. Reload to retry.",
              )}
            </div>
          ) : !records.length ? (
            <div className="empty-state">
              <span className="feature-icon">
                <FlaskConical size={28} aria-hidden />
              </span>
              <h2>Start with one good question.</h2>
              <p>
                Choose an audience, add two messages, and invite people to tell
                you which one resonates.
              </p>
              <Link className="button" to="/experiments/new">
                Create your first experiment{" "}
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          ) : !visible.length ? (
            <div className="empty-state">
              <Search size={28} aria-hidden />
              <h2>No matching experiments.</h2>
              <p>Try another search or filter to find your experiment.</p>
              <button
                className="button button-secondary"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="experiment-list">
              {visible.map((r) => (
                <Link
                  className="experiment-item"
                  to={`/experiments/${r.recordId}`}
                  key={r.recordId}
                >
                  <span className="experiment-icon"><FlaskConical size={21} aria-hidden /></span>
                  <div className="experiment-record-copy">
                    <h2>{r.data.title}</h2>
                    <p>{r.data.audience}</p>
                  </div>
                  <div className="experiment-record-meta">
                    <span className={`status ${r.data.status}`}>{r.data.status}</span>
                    <span>{r.data.variants.length} message variants</span>
                  </div>
                  <ArrowUpRight className="experiment-record-arrow" size={20} aria-hidden />
                </Link>
              ))}
            </div>
          )}
        </>
      )}
      <section className="example-callout">
        <div>
          <span className="sample-tag">Illustrative example</span>
          <h2>{demoExperiment.title}</h2>
          <p>Try a sample comparison and explore the feedback.</p>
        </div>
        <Link className="button button-secondary" to="/demo">
          Explore example <ArrowUpRight size={16} aria-hidden />
        </Link>
      </section>
    </div>
  );
}
