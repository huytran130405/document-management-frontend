import { beforeAll, afterAll, afterEach, expect, it } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers, resetMock } from './handlers.js'
import { api, authHttp, session } from '../shared/api/http.js'
const server = setupServer(...handlers)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => {
  resetMock()
  session.clear()
  server.resetHandlers()
})
async function login(email) {
  const { data } = await authHttp.post('/auth/login', {
    email,
    password: 'Demo12345!',
  })
  session.set(data.accessToken)
  return data
}
it.each([
  ['admin@demo.test', 'ADMIN'],
  ['manager@demo.test', 'MANAGER'],
  ['employee@demo.test', 'EMPLOYEE'],
])('returns the correct role for %s', async (email, role) => {
  const result = await login(email)
  expect(result.user.roles).toEqual([role])
  expect(result.expiresIn).toBe(300)
  expect((await api.get('/auth/me')).data.id).toBe(result.user.id)
})
it('enforces document scope for employee and manager', async () => {
  for (const email of ['employee@demo.test', 'manager@demo.test']) {
    await login(email)
    expect((await api.get('/demo/documents/a')).status).toBe(200)
    await expect(api.get('/demo/documents/b')).rejects.toMatchObject({
      response: { status: 403 },
    })
  }
})
it('refreshes an expired access token and logs out for expired refresh', async () => {
  await login('employee@demo.test')
  await authHttp.post('/demo/session', { scenario: 'access-expired' })
  expect((await api.get('/demo/documents/a')).status).toBe(200)
  await authHttp.post('/demo/session', { scenario: 'refresh-expired' })
  await expect(api.get('/demo/documents/a')).rejects.toBeDefined()
  expect(session.token).toBeNull()
})
it('changes password, revokes session, rejects old password and accepts new password', async () => {
  await login('employee@demo.test')
  await expect(
    api.post('/auth/change-password', {
      currentPassword: 'wrong',
      newPassword: 'Next12345!',
    }),
  ).rejects.toMatchObject({ response: { status: 422 } })
  expect(
    (
      await api.post('/auth/change-password', {
        currentPassword: 'Demo12345!',
        newPassword: 'Next12345!',
      })
    ).status,
  ).toBe(204)
  await expect(login('employee@demo.test')).rejects.toMatchObject({
    response: { status: 401 },
  })
  expect(
    (
      await authHttp.post('/auth/login', {
        email: 'employee@demo.test',
        password: 'Next12345!',
      })
    ).status,
  ).toBe(200)
})
it('responds neutrally to known and unknown recovery emails', async () => {
  const known = await authHttp.post('/auth/forgot-password', {
    email: 'employee@demo.test',
  })
  const unknown = await authHttp.post('/auth/forgot-password', {
    email: 'nobody@example.com',
  })
  expect(known.status).toBe(202)
  expect(unknown.data).toEqual(known.data)
})
