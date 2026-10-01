import { describe, it, expect } from 'vitest'
import { metrics, evidencePrompt, experimentInput, responseInput, normalizeAssetKey } from './signalroom'
import { demoExperiment, demoFeedback } from './demo'
describe('evidence and validation', () => {
  it('accepts real app-prefixed R2 keys but rejects cross-app and traversal keys', () => {
    const key = 'creatives/cdfd5a6c-60b3-40ad-81c8-a1cc871e30f0.png'
    expect(normalizeAssetKey(key, 'app_current')).toBe(`apps/app_current/${key}`)
    expect(normalizeAssetKey(`apps/app_current/${key}`, 'app_current')).toBe(`apps/app_current/${key}`)
    expect(normalizeAssetKey(`apps/app_other/${key}`, 'app_current')).toBeNull()
    expect(normalizeAssetKey('creatives/../private.png', 'app_current')).toBeNull()
    expect(normalizeAssetKey('', 'app_current')).toBe('')
  })
  it('computes actual vote shares and selected-message clarity', () => {
    const result = metrics(demoExperiment.variants, demoFeedback)
    expect(result.map(r => r.votes)).toEqual([2,1])
    expect(result.map(r => r.share)).toEqual([67,33])
    expect(result[0].clarity).toBe(4.5)
    expect(metrics(demoExperiment.variants,[])[0]).toMatchObject({votes:0,share:0,clarity:0})
  })
  it('omits identity from the model evidence and preserves reviewer reasons', () => {
    const prompt = evidencePrompt(demoExperiment,demoFeedback)
    expect(prompt).not.toContain('reviewerUserId')
    expect(prompt).not.toContain('sample-1')
    expect(JSON.parse(prompt).responseCount).toBe(3)
    expect(JSON.parse(prompt).feedback[0].reason).toBe(demoFeedback[0].reason)
  })
  it('rejects under-specified tests and out-of-range feedback', () => {
    expect(experimentInput.safeParse({...demoExperiment,variants:[demoExperiment.variants[0]]}).success).toBe(false)
    expect(responseInput.safeParse({...demoFeedback[0],clarityScore:6}).success).toBe(false)
    expect(responseInput.safeParse({...demoFeedback[0],reason:'  '}).success).toBe(false)
  })
})
