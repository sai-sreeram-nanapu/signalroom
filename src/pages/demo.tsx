import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Radio, ArrowUpRight } from 'lucide-react'
import { Button } from '../components/ui'
import { demoExperiment, demoFeedback, demoSynthesis } from '../lib/demo'
import { ResultsPanel } from '../components/experiments/ResultsPanel'
import { SynthesisPanel } from '../components/experiments/SynthesisPanel'
export default function Demo() {
  const [selected, setSelected] = useState('')
  const [voted, setVoted] = useState(false)
  const [analysis, setAnalysis] = useState(false)
  const feedback = voted ? [...demoFeedback, { experimentId: 'sample', variantId: selected, reviewerUserId: 'you', clarityScore: 4, reason: 'Your illustrative vote' }] : demoFeedback
  return <><title>Example experiment · SignalRoom</title><header className="public-nav"><Link className="wordmark" to="/"><Radio size={23} />SignalRoom</Link><Link to="/experiments/new">Start a real experiment <ArrowUpRight size={16} /></Link></header><main className="workspace"><p className="notice">Interactive example · Invented feedback. Your choice stays in this page and is not saved.</p><div className="page-heading"><div><p className="eyebrow">EXPERIMENT / EXAMPLE</p><h1>{demoExperiment.title}</h1><p>{demoExperiment.audience}</p></div></div><div className="experiment-grid"><section className="panel"><p className="eyebrow">THE QUESTION</p><h2>{demoExperiment.question}</h2><div className="variant-list">{demoExperiment.variants.map(v => <button key={v.id} className={`variant-option ${selected === v.id ? 'selected' : ''}`} onClick={() => {setSelected(v.id); setVoted(false)}} aria-pressed={selected === v.id}><span className="eyebrow">{v.label}</span><span className="variant-copy">{v.copy}</span></button>)}</div><Button disabled={!selected || voted} onClick={() => setVoted(true)}>{voted ? 'Example vote counted' : 'Try an example vote'}</Button></section><ResultsPanel variants={demoExperiment.variants} feedback={feedback} /></div><section className="panel analysis"><div className="section-heading"><div><p className="eyebrow">MAKE SENSE OF THE SIGNAL</p><h2>Evidence, then a next step.</h2></div><Button variant="outline" onClick={() => setAnalysis(!analysis)}>{analysis ? 'Hide sample analysis' : 'View sample analysis'}</Button></div>{analysis && <SynthesisPanel synthesis={demoSynthesis} />}</section></main></>
}
