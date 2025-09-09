import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'X-Client-Info': 'maintenance-pwa@1.0.0',
    },
  },
})

// Utility functions for common operations
export const getCurrentUser = () => supabase.auth.getUser()

export const signInWithEmail = (email: string, password: string) => 
  supabase.auth.signInWithPassword({ email, password })

export const signUpWithEmail = (email: string, password: string, userData?: any) => 
  supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: userData
    }
  })

export const signOut = () => supabase.auth.signOut()

// Real-time subscriptions
export const subscribeToVehicleChanges = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('vehicle_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'Veicoli',
        filter: `utente_id=eq.${userId}`
      },
      callback
    )
    .subscribe()
}

export const subscribeToMaintenanceChanges = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('maintenance_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'Interventi',
        filter: `utente_id=eq.${userId}`
      },
      callback
    )
    .subscribe()
    }
