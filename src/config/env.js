// Configuración de variables de entorno
const config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

// Validación de variables de entorno
const validateEnv = () => {
  const requiredVars = ['supabaseUrl', 'supabaseAnonKey'];
  const missingVars = requiredVars.filter(varName => !config[varName]);

  if (missingVars.length > 0) {
    console.error('Faltan variables de entorno requeridas:', missingVars);
    return false;
  }

  return true;
};

// Verificar si estamos en producción
const isProduction = import.meta.env.PROD;

// Exportar configuración
export const env = {
  ...config,
  isProduction,
  validateEnv,
}; 