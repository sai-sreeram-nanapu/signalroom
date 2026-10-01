import type { CollectionSchema, PermissionLevel } from 'deepspace/schema'
const readOnly = (read: PermissionLevel) => ({ read, create: false, update: false, delete: false })
const text = (name: string) => ({ name, storage: 'text' as const, interpretation: 'plain', required: true })
export const experimentSchema: CollectionSchema = {
  name: 'experiments', ownerField: 'creatorId', visibilityField: { field: 'visibility', value: 'public' },
  columns: [text('title'), text('audience'), text('question'), { ...text('creatorId'), userBound: true, immutable: true },
    { name: 'variants', storage: 'text', interpretation: { kind: 'json' }, required: true },
    { name: 'status', storage: 'text', interpretation: { kind: 'select', options: ['draft', 'published', 'closed'] }, required: true },
    { name: 'visibility', storage: 'text', interpretation: { kind: 'select', options: ['private', 'public'] }, required: true },
    { name: 'assetKey', storage: 'text', interpretation: 'plain' }],
  permissions: { '*': readOnly('published'), viewer: readOnly('published'), member: readOnly('published'), admin: readOnly('published') },
}
export const responseSchema: CollectionSchema = {
  name: 'responses', ownerField: 'reviewerUserId', uniqueOn: ['experimentId', 'reviewerUserId'],
  columns: [{ ...text('experimentId'), immutable: true }, { ...text('reviewerUserId'), userBound: true, immutable: true }, text('variantId'),
    { name: 'clarityScore', storage: 'number', interpretation: 'plain', required: true }, text('reason')],
  permissions: { '*': readOnly(false), viewer: readOnly(false), member: readOnly(true), admin: readOnly(true) },
}
export const synthesisSchema: CollectionSchema = {
  name: 'syntheses', ownerField: 'creatorId',
  columns: [text('experimentId'), { ...text('creatorId'), userBound: true, immutable: true }, text('summary'), text('strongestVariant'), text('limitations'), text('nextTest'), text('generatedAt'), text('model'),
    ...['evidence', 'confusions', 'contradictions'].map(name => ({ name, storage: 'text' as const, interpretation: { kind: 'json' as const }, required: true })),
    { name: 'responseCount', storage: 'number', interpretation: 'plain', required: true }],
  permissions: { '*': readOnly(false), viewer: readOnly(false), member: readOnly('own'), admin: readOnly('own') },
}
