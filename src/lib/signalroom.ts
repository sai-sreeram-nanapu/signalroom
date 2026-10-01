import { z } from 'zod'

export const variantInput = z.object({ label: z.string().trim().min(1).max(40), copy: z.string().trim().min(3).max(800) })
export const experimentInput = z.object({
  title: z.string().trim().min(3).max(120), audience: z.string().trim().min(3).max(300),
  question: z.string().trim().min(3).max(300), variants: z.array(variantInput).min(2).max(4),
  assetKey: z.string().max(500).optional().default(''),
})
export const responseInput = z.object({ experimentId: z.string().min(1).max(200), variantId: z.string().min(1).max(100), clarityScore: z.number().int().min(1).max(5), reason: z.string().trim().min(3).max(1000) })
export type Variant = z.infer<typeof variantInput> & { id: string }
export type Experiment = { title: string; audience: string; question: string; variants: Variant[]; assetKey: string; creatorId: string; status: 'draft' | 'published' | 'closed'; visibility: 'private' | 'public' }
export type Feedback = z.infer<typeof responseInput> & { reviewerUserId: string }
export const synthesisOutput = z.object({ summary: z.string().min(1).max(1600), strongestVariant: z.string().max(300), evidence: z.array(z.string().max(800)).max(6), confusions: z.array(z.string().max(800)).max(6), contradictions: z.array(z.string().max(800)).max(6), limitations: z.string().max(1400), nextTest: z.string().max(1000) })
export type Synthesis = z.infer<typeof synthesisOutput> & { experimentId: string; creatorId: string; responseCount: number; generatedAt: string; model: string }
export function metrics(variants: Variant[], responses: Feedback[]) {
  return variants.map(v => {
    const votes = responses.filter(r => r.variantId === v.id)
    return { ...v, votes: votes.length, share: responses.length ? Math.round(votes.length / responses.length * 100) : 0, clarity: votes.length ? votes.reduce((s, r) => s + r.clarityScore, 0) / votes.length : 0 }
  })
}
export function evidencePrompt(experiment: Experiment, responses: Feedback[]) {
  return JSON.stringify({ audience: experiment.audience, question: experiment.question, title: experiment.title, responseCount: responses.length, variants: metrics(experiment.variants, responses), feedback: responses.map(({variantId, clarityScore, reason}) => ({variantId, clarityScore, reason})) })
}
