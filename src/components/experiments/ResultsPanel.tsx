import { metrics, type Variant, type Feedback } from '../../lib/signalroom'
export function ResultsPanel({ variants, feedback }: { variants: Variant[]; feedback: Feedback[] }) {
  const rows = metrics(variants, feedback)
  return <section className="panel results" aria-label="Live results">
    <div className="section-heading"><div><p className="eyebrow">THE SIGNAL</p><h2>What’s resonating</h2></div><span className="mono" data-testid="response-count">{feedback.length} responses</span></div>
    {rows.map(v => <div className="result-row" key={v.id}><div className="result-label"><strong>{v.label}</strong><span>{v.votes} votes <b>{v.share}%</b></span></div><div className="bar-track"><div className="bar-fill" style={{ width: `${v.share}%` }} /></div><p className="caption">Clarity {v.votes ? `${v.clarity.toFixed(1)} / 5` : '—'} <span>among reviewers who chose this message</span></p></div>)}
    <p className="fine-print">Directional feedback, not statistical proof. The people you invite shape the signal.</p>
  </section>
}
