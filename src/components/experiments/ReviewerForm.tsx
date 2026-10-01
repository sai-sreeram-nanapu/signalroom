import { useState, type FormEvent } from 'react'
import { AuthOverlay, useAuth, useMutations, useQuery } from 'deepspace'
import { Button, Label, Textarea, useToast } from '../ui'
import { runAction } from '../../lib/actions'
import type { Experiment, Feedback } from '../../lib/signalroom'
export function ReviewerForm({ experiment, experimentId }: { experiment: Experiment; experimentId: string }) {
  const { isSignedIn, userId } = useAuth()
  const { ready } = useMutations('responses')
  const { records, status } = useQuery<Feedback>('responses', { where: { experimentId, reviewerUserId: userId || '__signed_out__' } })
  const [selected, setSelected] = useState('')
  const [clarity, setClarity] = useState(0)
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [failure, setFailure] = useState('')
  const [auth, setAuth] = useState(false)
  const toast = useToast()
  const complete = submitted || records.length > 0
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setFailure('')
    try { await runAction('submitResponse', { experimentId, variantId: selected, clarityScore: clarity, reason }); setSubmitted(true); toast.success('Feedback submitted', 'Your point of view is now part of the experiment.') }
    catch (err) { const message = err instanceof Error ? err.message : 'Could not submit'; if (/duplicate/i.test(message)) { setSubmitted(true); toast.info('You’ve already responded', 'Each reviewer contributes one response per experiment.') } else { setFailure(message); toast.error('Feedback not submitted') } }
    finally { setBusy(false) }
  }
  return <section className="panel"><p className="eyebrow">YOUR POINT OF VIEW</p><h2>{experiment.question}</h2><p className="caption" style={{marginTop:10}}>Think about the intended audience: {experiment.audience}.</p>
    <div className="variant-list">{experiment.variants.map(v => <button className={`variant-option ${selected === v.id ? 'selected' : ''}`} key={v.id} aria-pressed={selected === v.id} disabled={complete || experiment.status === 'closed'} onClick={() => setSelected(v.id)}><span className="eyebrow">{v.label}</span><span className="variant-copy">{v.copy}</span></button>)}</div>
    {complete ? <div className="success-message" role="status"><strong>Your feedback is in.</strong><p className="caption">Thank you for adding a point of view. Each reviewer gets one response.</p></div> : experiment.status === 'closed' ? <p className="notice">This experiment is closed. It is no longer accepting feedback.</p> : <form onSubmit={submit}><fieldset className="field"><legend style={{fontWeight:600,fontSize:12,marginBottom:10}}>How clear is your chosen message?</legend><div className="score-options">{[1,2,3,4,5].map(score => <button type="button" key={score} aria-pressed={clarity === score} aria-label={`Clarity ${score} of 5`} onClick={() => setClarity(score)}>{score}</button>)}</div><p className="caption">1 = confusing · 5 = immediately clear</p></fieldset><div className="field"><Label htmlFor="reason">Why did you choose it?</Label><Textarea id="reason" required minLength={3} maxLength={1000} rows={3} value={reason} onChange={e => setReason(e.target.value)} placeholder="What resonated, and what made you hesitate?" /></div>{failure && <p className="error-message" role="alert">{failure}</p>}{isSignedIn ? <Button type="submit" disabled={!ready || status !== 'ready' || !selected || !clarity || busy || reason.trim().length < 3} loading={busy}>Submit feedback</Button> : <><Button type="button" onClick={() => setAuth(true)}>Sign in to submit feedback</Button><p className="caption" style={{marginTop:10}}>Your choice and reason stay here while you sign in.</p></>}</form>}
    {auth && <AuthOverlay onClose={() => setAuth(false)} />}
  </section>
}
