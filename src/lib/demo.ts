import type { Experiment, Feedback, Synthesis } from './signalroom'
export const demoExperiment: Experiment = {
  title: 'A sharper promise for an AI builder', audience: 'Developers shipping their first multiplayer app', question: 'Which promise would make you try this tool?', creatorId: 'sample', status: 'published', visibility: 'public', assetKey: '',
  variants: [{ id: 'variant-1', label: 'A · Ship the outcome', copy: 'Your first multiplayer app. Live by lunch.' }, { id: 'variant-2', label: 'B · Remove the friction', copy: 'Auth, live data, storage, and AI. One SDK. Less glue code.' }],
}
export const demoFeedback: Feedback[] = [
  { experimentId: 'sample', variantId: 'variant-1', reviewerUserId: 'sample-1', clarityScore: 5, reason: 'The deadline makes the outcome tangible. I can picture what I’ll have when I’m done.' },
  { experimentId: 'sample', variantId: 'variant-2', reviewerUserId: 'sample-2', clarityScore: 4, reason: 'I need to know what replaces my current stack before trying another tool.' },
  { experimentId: 'sample', variantId: 'variant-1', reviewerUserId: 'sample-3', clarityScore: 4, reason: 'The promise is memorable, but I’d want to see a working example.' },
]
export const demoSynthesis: Synthesis = { experimentId: 'sample', creatorId: 'sample', responseCount: 3, generatedAt: '', model: 'Illustrative sample', summary: 'The outcome-led promise attracted two of three sample reviewers. The stack-led message gave the other reviewer a clearer reason to switch.', strongestVariant: 'A · Ship the outcome leads this small sample', evidence: ['Two reviewers chose A; their reasons emphasize a concrete outcome and memorable promise.'], confusions: ['The speed claim needs a working example to support it.'], contradictions: ['One reviewer prioritized technical specificity over a time promise.'], limitations: 'These three invented responses illustrate the product. They are not customer research or a real AI result.', nextTest: 'Test the outcome-led headline with a supporting line that names the included primitives, using new reviewers.' }
