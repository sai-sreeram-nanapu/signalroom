import { BarChart3, Info } from "lucide-react";
import { metrics, type Variant, type Feedback } from "../../lib/signalroom";
export function ResultsPanel({
  variants,
  feedback,
}: {
  variants: Variant[];
  feedback: Feedback[];
}) {
  const rows = metrics(variants, feedback);
  const average = feedback.length
    ? (
        feedback.reduce((sum, f) => sum + f.clarityScore, 0) / feedback.length
      ).toFixed(1)
    : "—";
  return (
    <section className="panel results" aria-label="Live results">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <BarChart3 size={14} aria-hidden /> LIVE RESULTS
          </p>
          <h2>What’s resonating</h2>
        </div>
        <span className="live-indicator">
          <span className="live-dot" /> Live
        </span>
      </div>
      <div className="result-stats">
        <div>
          <strong>{feedback.length}</strong>
          <span
            data-testid="response-count"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {feedback.length} responses
          </span>
        </div>
        <div>
          <strong>
            {average}
            <small> / 5</small>
          </strong>
          <span>Overall clarity</span>
        </div>
      </div>
      <p className="eyebrow results-label">MESSAGE PREFERENCE</p>
      {rows.map((v, i) => (
        <div className={`result-row variant-tone-${i}`} key={v.id}>
          <div className="result-label">
            <strong>
              <span className="variant-letter">
                {String.fromCharCode(65 + i)}
              </span>
              {v.label.replace(/^[A-D] · /, "")}
            </strong>
            <b>{v.share}%</b>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${v.share}%` }} />
          </div>
          <div className="result-meta">
            <span>
              {v.votes} {v.votes === 1 ? "vote" : "votes"}
            </span>
            <span>Clarity {v.votes ? `${v.clarity.toFixed(1)} / 5` : "—"}</span>
          </div>
        </div>
      ))}
      <p className="fine-print result-disclaimer">
        <Info size={15} aria-hidden />
        <span>
          Directional feedback, not statistical proof. The people you invite
          shape the signal.
        </span>
      </p>
    </section>
  );
}
