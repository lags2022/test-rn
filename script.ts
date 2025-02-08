import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error('No se encontraron las variables de entorno')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
	const { data, error } = await supabase.from('prueba1').select('*')
	if (error) {
		console.error('❌ Error en conexión:', error)
	} else {
		console.log('✅ Datos obtenidos:', data)
	}
}

testConnection()
