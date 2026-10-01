import { expect, type BrowserContext } from '@playwright/test'
export async function action(context: BrowserContext, name: string, data: Record<string, unknown>) {
  const tokenResult = await context.request.post('/api/auth/token')
  const { token } = await tokenResult.json()
  expect(typeof token).toBe('string')
  const response = await context.request.post(`/api/actions/${name}`, { headers: { Authorization: `Bearer ${token}` }, data })
  expect(response.status()).toBe(200)
  return response.json()
}
export const sampleInput = () => ({ title: `__test-${Date.now()}__ Messaging experiment`, audience: 'Developers building multiplayer apps', question: 'Which message would make you try it?', variants: [{label:'A', copy:'Your multiplayer app, live by lunch.'},{label:'B', copy:'Less glue code. More time to build.'}] })
