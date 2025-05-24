import { createClient } from '@supabase/supabase-js'
import { env } from '../config/env'

// Validar variables de entorno
if (!env.validateEnv()) {
  throw new Error('Faltan variables de entorno requeridas para Supabase')
}

// Crear cliente de Supabase
export const supabase = createClient(
  env.supabaseUrl,
  env.supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)

if (supabase) {
  console.log('[supabaseClient] Cliente de Supabase inicializado correctamente desde .env.')
} else if (import.meta.env.PROD && (!env.supabaseUrl || !env.supabaseAnonKey)) {
  // En producción, es más crítico si no se cargan las variables
  console.error('[supabaseClient] ERROR CRÍTICO: No se pudo inicializar Supabase en producción debido a variables de entorno faltantes.')
} else if (!env.supabaseUrl || !env.supabaseAnonKey) {
  // En desarrollo, si no están, ya se mostró la alerta arriba.
  // No es necesario otro error aquí a menos que quieras ser más explícito.
} 