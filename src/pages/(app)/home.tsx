/* home pattern: data-forward — the creator's experiment list and publication counts */
import { Link } from 'react-router-dom'
import { ArrowUpRight, Plus } from 'lucide-react'
import { useAuth, useQuery } from 'deepspace'
import { demoExperiment } from '../../lib/demo'
import type { Experiment } from '../../lib/signalroom'
export default function Home() {
  const { userId, isSignedIn } = useAuth()
  const { records, status, error } = useQuery<Experiment>('experiments', { where: { creatorId: userId || '__signed_out__' }, orderBy: 'createdAt', orderDir: 'desc' })
  return <div className="workspace"><div className="page-heading"><div><p className="eyebrow">YOUR RESEARCH WORKSPACE</p><h1>Find your next signal.</h1><p>Small experiments. Real reasons. A clearer next move.</p></div><Link className="button" to="/experiments/new"><Plus size={16} /> New experiment</Link></div>
    {!isSignedIn ? <><p className="notice">Explore an example below. Sign in to create experiments and collect real feedback.</p><div className="experiment-list"><Link to="/demo" className="experiment-item"><div><span className="status published">Illustrative example</span><h2>{demoExperiment.title}</h2><p>{demoExperiment.audience}</p></div><ArrowUpRight size={20} /></Link></div></> : <>
    <div className="summary-strip"><div><strong>{records.length}</strong><span>experiments</span></div><div><strong>{records.filter(r => r.data.status === 'published').length}</strong><span>accepting feedback</span></div><div><strong>{records.filter(r => r.data.status === 'draft').length}</strong><span>drafts</span></div></div>
    {status === 'loading' ? <div className="busy-panel" aria-busy="true">Connecting to your experiments…</div> : status === 'error' ? <div className="error-message" role="alert">{String(error || 'Could not connect to your experiments. Reload to retry.')}</div> : !records.length ? <div className="empty-state"><h2>Start with one good question.</h2><p>Choose the audience you want to learn from, add two messages, and invite reviewers to tell you which one resonates.</p><Link className="button" to="/experiments/new">Create your first experiment <ArrowUpRight size={16} /></Link></div> : <div className="experiment-list">{records.map(r => <Link className="experiment-item" to={`/experiments/${r.recordId}`} key={r.recordId}><div><span className={`status ${r.data.status}`}>{r.data.status}</span><h2>{r.data.title}</h2><p>{r.data.audience} · {r.data.variants.length} variants</p></div><ArrowUpRight size={21} /></Link>)}</div>}</>}
  </div>
}
