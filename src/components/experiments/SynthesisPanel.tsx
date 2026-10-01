import type { Synthesis } from '../../lib/signalroom'
export function SynthesisPanel({ synthesis }: { synthesis: Synthesis }) {
  return <article className="analysis-content"><p className="eyebrow">INTERPRETATION · {synthesis.responseCount} RESPONSES</p><h3>{synthesis.strongestVariant}</h3><p>{synthesis.summary}</p>
    {(['evidence', 'confusions', 'contradictions'] as const).map(key => <div key={key}><h4>{ { evidence: 'Evidence', confusions: 'What’s unclear', contradictions: 'Where people disagree' }[key]}</h4>{synthesis[key].length ? <ul>{synthesis[key].map((item, i) => <li key={i}>{item}</li>)}</ul> : <p className="caption">No recurring signal reported.</p>}</div>)}
    <div className="next-test"><p className="eyebrow">TEST THIS NEXT</p><p>{synthesis.nextTest}</p></div><p className="fine-print">{synthesis.limitations}</p>
    {synthesis.generatedAt && <p className="caption">Saved {new Date(synthesis.generatedAt).toLocaleString()} · {synthesis.model}</p>}
  </article>
}
