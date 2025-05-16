import { createClient } from '@supabase/supabase-js'

// Cargar credenciales desde variables de entorno Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Mensaje de log para desarrollo
if (supabaseUrl && supabaseAnonKey) {
  console.log('[supabaseClient] Usando URL desde .env:', supabaseUrl.substring(0,20) + "..."); // Muestra solo parte de la URL por seguridad en logs
} else {
  console.error('[supabaseClient] ALERTA: Credenciales de Supabase (VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY) no encontradas en variables de entorno (.env). La aplicación podría no funcionar correctamente.');
  // Considera mostrar un error más visible en la UI para el usuario en desarrollo si esto sucede.
}

// Verificar que la URL tenga el formato correcto
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ El formato de la URL de Supabase parece incorrecto. Debe ser similar a: https://proyecto.supabase.co');
}

// Solo crea el cliente si las variables de entorno están presentes
export const supabase = (supabaseUrl && supabaseAnonKey)
                        ? createClient(supabaseUrl, supabaseAnonKey)
                        : null;

if (supabase) {
  console.log('[supabaseClient] Cliente de Supabase inicializado correctamente desde .env.');
} else if (import.meta.env.PROD && (!supabaseUrl || !supabaseAnonKey)) {
  // En producción, es más crítico si no se cargan las variables
  console.error('[supabaseClient] ERROR CRÍTICO: No se pudo inicializar Supabase en producción debido a variables de entorno faltantes.');
} else if (!supabaseUrl || !supabaseAnonKey) {
  // En desarrollo, si no están, ya se mostró la alerta arriba.
  // No es necesario otro error aquí a menos que quieras ser más explícito.
} 