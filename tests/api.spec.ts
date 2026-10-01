import { test, expect, loadAllTestAccounts } from 'deepspace/testing'
import { action, sampleInput } from './helpers/actions'

test('server actions require authentication', async ({ request }) => {
  for (const name of ['saveExperiment', 'setExperimentStatus', 'submitResponse', 'synthesizeExperiment']) {
    const response = await request.post(`/api/actions/${name}`, { data: {} })
    expect(response.status()).toBe(401)
  }
})
test('auth proxy is healthy', async ({ request }) => {
  expect((await request.get('/api/auth/ok')).ok()).toBeTruthy()
})
test.describe('authenticated validation and authorization', () => {
  test.skip(loadAllTestAccounts().length < 2, 'Requires two locally usable test accounts')
  test('owner boundaries, input validation and closed feedback', async ({ users }) => {
    const [a,b] = await users(2)
    const input = sampleInput()
    const created = await action(a.context, 'saveExperiment', input)
    expect(created.success).toBe(true)
    const id = created.data.recordId
    try {
      expect((await action(b.context, 'saveExperiment', {...input, experimentId:id})).success).toBe(false)
      expect((await action(b.context, 'setExperimentStatus', {experimentId:id,status:'published'})).success).toBe(false)
      expect((await action(b.context, 'synthesizeExperiment', {experimentId:id})).success).toBe(false)
      expect((await action(b.context, 'submitResponse', {experimentId:id,variantId:'variant-1',clarityScore:5,reason:'Clear and concrete'})).success).toBe(false)
      expect((await action(a.context, 'saveExperiment', {...input, variants:[input.variants[0]]})).success).toBe(false)
      expect((await action(a.context, 'setExperimentStatus', {experimentId:id,status:'published'})).success).toBe(true)
      expect((await action(a.context, 'saveExperiment', {...input, experimentId:id})).success).toBe(false)
      expect((await action(a.context, 'synthesizeExperiment', {experimentId:id})).success).toBe(false)
      for (const invalid of [{variantId:'other-variant',clarityScore:5}, {variantId:'variant-1',clarityScore:7}, {variantId:'variant-1',clarityScore:2.5}]) {
        expect((await action(b.context,'submitResponse',{experimentId:id,reason:'Clear and concrete',...invalid})).success).toBe(false)
      }
      const response = {experimentId:id,variantId:'variant-1',clarityScore:5,reason:'The outcome feels concrete.'}
      expect((await action(b.context,'submitResponse',response)).success).toBe(true)
      const duplicate = await action(b.context,'submitResponse',response)
      expect(duplicate.success).toBe(false)
      expect(duplicate.error).toMatch(/duplicate/i)
      expect((await action(a.context,'setExperimentStatus',{experimentId:id,status:'closed'})).success).toBe(true)
      expect((await action(a.context,'submitResponse',response)).success).toBe(false)
    } finally { expect((await action(a.context, 'cleanupTestExperiment', {experimentId:id})).success).toBe(true) }
  })
})
