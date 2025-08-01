import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export function useUserSession() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function getUser() {
      const { data, error } = await supabase.auth.getUser()
      if (mounted) setUser(data?.user || null)
      setLoading(false)
    }
    getUser()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => {
      mounted = false
      listener?.subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}
