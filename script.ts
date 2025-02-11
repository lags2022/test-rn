import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uajzgniztfdeohnapyml.supabase.co'
const supabaseAnonKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhanpnbml6dGZkZW9obmFweW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzMTE4MjgsImV4cCI6MjA1NDg4NzgyOH0.YITR3zJsvZila031e4i-rYnMUDiNgM1SU4hNVeUcayA'

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error('No se encontraron las variables de entorno')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
	const { data, error } = await supabase.from('user_table').select('*')
	if (error) {
		console.error('❌ Error en conexión:', error)
	} else {
		console.log('✅ Datos obtenidos:', data)
	}
}

testConnection()
