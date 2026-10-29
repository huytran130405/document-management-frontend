import { useAuth } from '../features/auth/useAuth.js'

export default function Workspace({ title }) {
  const { user } = useAuth()
  return (
    <section className="p-6 sm:p-10">
      <h1 className="mt-3 text-3xl">{title}</h1>
    </section>
  )
}
