import { useParams, Link } from 'react-router-dom'
import { useAuth, useQuery } from 'deepspace'
import { ExperimentForm } from '../../../../../components/experiments/ExperimentForm'
import type { Experiment } from '../../../../../lib/signalroom'
export default function EditExperiment() {
  const { id } = useParams()
  const { userId } = useAuth()
  const { records, status, error } = useQuery<Experiment>('experiments', { where: { recordId: id || '' } })
  const record = records[0]
  if (status === 'loading') return <div className="workspace" aria-busy="true">Loading draft…</div>
  if (status === 'error') return <div className="route-state" role="alert">Could not load this draft: {String(error)}</div>
  if (!record || record.data.creatorId !== userId || record.data.status !== 'draft') return <div className="route-state"><h1>This draft is unavailable.</h1><p>You can edit your own drafts. Published messages stay fixed.</p><Link className="text-link" to="/home">Back to experiments</Link></div>
  return <main className="workspace"><div className="page-heading"><div><p className="eyebrow">EDIT DRAFT</p><h1>{record.data.title}</h1></div></div><ExperimentForm key={record.recordId} initial={record.data} experimentId={record.recordId} /></main>
}
