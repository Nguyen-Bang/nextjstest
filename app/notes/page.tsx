import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'

async function NotesList() {
  const supabase = await createClient()
  const { data: notes, error } = await supabase.from('notes').select('id, title')

  if (error) {
    return <p className="text-red-500">Error loading notes: {error.message}</p>
  }

  if (!notes || notes.length === 0) {
    return <p className="text-muted-foreground">No notes found.</p>
  }

  return (
    <ul className="space-y-2">
      {notes.map((note) => (
        <li key={note.id} className="border rounded p-3">
          <span className="font-medium">{note.title}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Page() {
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Notes</h1>
      <Suspense fallback={<p>Loading notes...</p>}>
        <NotesList />
      </Suspense>
    </div>
  )
}