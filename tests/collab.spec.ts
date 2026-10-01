import { test, expect, loadAllTestAccounts } from 'deepspace/testing'
import { action, sampleInput } from './helpers/actions'

test.skip(loadAllTestAccounts().length < 2, 'Requires two locally usable test accounts')
test('create, edit, publish, review and live results across independent users', async ({ users, page }) => {
  const [a,b] = await users(2)
  const input = sampleInput()
  let id = ''
  try {
    await a.page.goto('/experiments/new')
    await a.page.getByLabel('Experiment title', {exact:true}).fill(input.title)
    await a.page.getByLabel('Who is this message for?').fill(input.audience)
    await a.page.getByLabel('Your question for reviewers').fill(input.question)
    for (let i=0;i<2;i++) await a.page.getByLabel(`Variant ${i+1} message`, {exact:true}).fill(input.variants[i].copy)
    await a.page.getByRole('button',{name:'Save draft',exact:true}).click()
    await expect(a.page).toHaveURL(/\/experiments\/(?!new$)[^/]+$/)
    id = new URL(a.page.url()).pathname.split('/').pop()!
    await expect(a.page.getByRole('heading',{name:input.title,exact:true})).toBeVisible()
    await b.page.goto(`/experiments/${id}`)
    await expect(b.page.getByRole('heading',{name:'This experiment isn’t available.'})).toBeVisible()
    await page.goto(`/experiments/${id}`)
    await expect(page.getByRole('heading',{name:'This experiment isn’t available.'})).toBeVisible()
    await a.page.getByRole('link',{name:'Edit draft'}).click()
    await expect(a.page.getByLabel('Experiment title')).toHaveValue(input.title)
    await a.page.getByLabel('Your question for reviewers').fill('Which message feels most useful?')
    await a.page.getByRole('button',{name:'Save draft',exact:true}).click()
    await a.page.getByRole('button',{name:'Publish experiment',exact:true}).click()
    await expect(a.page.getByRole('button',{name:'Copy share link'})).toBeVisible()
    await page.reload()
    await expect(page.getByRole('heading',{name:'Which message feels most useful?'})).toBeVisible()
    await expect(page.getByRole('button',{name:'Sign in to submit feedback'})).toBeVisible()
    await b.page.reload()
    await b.page.getByRole('button',{name:/A Your multiplayer app/}).click()
    await b.page.getByRole('button',{name:'Clarity 5 of 5'}).click()
    await b.page.getByLabel('Why did you choose it?').fill('The deadline makes the benefit tangible.')
    await b.page.getByRole('button',{name:'Submit feedback',exact:true}).click()
    await expect(b.page.getByText('Your feedback is in.',{exact:true})).toBeVisible()
    // Creator page has stayed open: no reload between publish and this assertion.
    await expect(a.page.getByTestId('response-count')).toHaveText('1 responses')
    await expect(a.page.getByText('The deadline makes the benefit tangible.',{exact:true})).toBeVisible()
    await b.page.reload()
    await expect(b.page.getByText('Your feedback is in.',{exact:true})).toBeVisible()
    await a.page.reload()
    await expect(a.page.getByTestId('response-count')).toHaveText('1 responses')
    await a.page.getByRole('button',{name:'Close experiment',exact:true}).click()
    await expect(b.page.getByText('This experiment is closed.',{exact:false})).toHaveCount(0) // already responded: thanks remains
  } finally { if(id) await action(a.context,'cleanupTestExperiment',{experimentId:id}) }
})
