const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

// Obtener la configuración predeterminada de Expo
const config = getDefaultConfig(__dirname)

// Aplicar NativeWind con el archivo global.css
module.exports = withNativeWind(config, { input: './global.css' })
