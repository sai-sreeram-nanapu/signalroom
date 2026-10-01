import { getAuthToken } from 'deepspace'
export async function runAction(name: string, params: Record<string, unknown>) {
  const token = await getAuthToken()
  if (!token) throw new Error('Sign in to continue')
  const response = await fetch(`/api/actions/${name}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(params) })
  const result = await response.json() as { success?: boolean; error?: string; data?: { recordId: string } }
  if (!response.ok || !result.success) throw new Error(result.error || 'The request could not be completed')
  return result.data as { recordId: string }
}
