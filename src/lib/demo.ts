import { metrics, type Experiment, type Feedback, type Synthesis } from './signalroom'
export const demoExperiment: Experiment = {
  title: 'A sharper promise for an AI builder', audience: 'Developers shipping their first multiplayer app', question: 'Which promise would make you try this tool?', creatorId: 'sample', status: 'published', visibility: 'public', assetKey: '',
  variants: [{ id: 'variant-1', label: 'A · Ship the outcome', copy: 'Your first multiplayer app. Live by lunch.' }, { id: 'variant-2', label: 'B · Remove the friction', copy: 'Auth, live data, storage, and AI. One SDK. Less glue code.' }],
}
export const demoFeedback: Feedback[] = [
  { experimentId: 'sample', variantId: 'variant-1', reviewerUserId: 'sample-1', clarityScore: 5, reason: 'The deadline makes the outcome tangible. I can picture what I’ll have when I’m done.' },
  { experimentId: 'sample', variantId: 'variant-2', reviewerUserId: 'sample-2', clarityScore: 4, reason: 'I need to know what replaces my current stack before trying another tool.' },
  { experimentId: 'sample', variantId: 'variant-1', reviewerUserId: 'sample-3', clarityScore: 4, reason: 'The promise is memorable, but I’d want to see a working example.' },
]
/** Deterministic illustration: recompute from committed votes, never call paid AI. */
export function buildDemoSynthesis(feedback: Feedback[]): Synthesis {
  const rows = metrics(demoExperiment.variants, feedback);
  const top = Math.max(...rows.map(row => row.votes));
  const leaders = rows.filter(row => row.votes === top);
  const tied = leaders.length > 1;
  return {
    experimentId: 'sample', creatorId: 'sample', responseCount: feedback.length,
    generatedAt: '', model: 'Live illustrative interpretation',
    strongestVariant: tied ? 'No clear leader. The sample is split.' : `${leaders[0].label} leads this small sample`,
    summary: tied
      ? `Both messages received ${top} of ${feedback.length} example votes. This is a tie, so there is no preference winner in this sample.`
      : `${leaders[0].label} received ${top} of ${feedback.length} example votes. That is a directional preference, not proof that the message will win with your audience.`,
    evidence: rows.map(row => `${row.label}: ${row.votes} votes (${row.share}%), with average clarity ${row.clarity.toFixed(1)} / 5.`),
    confusions: ['An original example reviewer wanted a working demo to support the speed claim.'],
    contradictions: ['The original example feedback values both a tangible outcome and technical specificity.'],
    limitations: `These ${feedback.length} illustrative responses include three invented reviewer notes${feedback.length > 3 ? ' and your example vote' : ''}. This is a computed demo interpretation, not customer research or a real AI result.`,
    nextTest: tied
      ? 'Recruit new reviewers from your intended audience. Compare the same promises and ask what makes each one credible.'
      : 'Test the outcome-led headline with a supporting line that names the included primitives, using new reviewers.',
  };
}
