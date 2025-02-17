import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
	runOnJS,
} from 'react-native-reanimated'

import { UserProps } from '@/interfaces/user'

interface Props {
	user: UserProps
	onClose: () => void
}

export default function UserDetailsBottomSheet({ user, onClose }: Props) {
	const offset = useSharedValue(500) // Posición inicial fuera de la pantalla

	// Animación al abrir el Bottom Sheet
	useEffect(() => {
		offset.value = withTiming(0, { duration: 300 })
	}, [offset])

	// Función para cerrar con una sola pulsación
	const handleClose = () => {
		// Desplaza el bottom sheet hacia abajo
		offset.value = withTiming(500, { duration: 300 }, () => {
			// Cuando termina la animación, llama a onClose
			runOnJS(onClose)()
		})
	}

	// Estilo animado
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: offset.value }],
	}))

	return (
		<View className="absolute inset-0 justify-end">
			{/* Fondo semitransparente (si quieres un background al hacer click fuera se cierre, se puede añadir onPress) */}
			<TouchableOpacity
				activeOpacity={1}
				className="absolute inset-0 bg-black/50"
				onPress={handleClose}
			/>
			<Animated.View
				style={[animatedStyle, styles.sheet]}
				className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 shadow-xl"
			>
				{/* Encabezado */}
				<View className="flex-row justify-between items-center mb-4">
					<Text className="text-xl font-bold text-black dark:text-white">
						Detalles del Usuario
					</Text>
					<TouchableOpacity onPress={handleClose}>
						<Text className="text-red-500 font-semibold">Cerrar</Text>
					</TouchableOpacity>
				</View>

				{/* Información del usuario */}
				<View className="space-y-2">
					<Text className="text-lg font-semibold text-black dark:text-white">
						Nombre:
					</Text>
					<Text className="text-gray-700 dark:text-gray-300">{user.name}</Text>

					<Text className="text-lg font-semibold text-black dark:text-white mt-2">
						Correo:
					</Text>
					<Text className="text-gray-700 dark:text-gray-300">{user.email}</Text>
				</View>

				{/* Botón adicional (opcional) */}
				<TouchableOpacity
					className="mt-6 bg-blue-500 py-3 rounded-lg items-center"
					onPress={() => alert('Acción personalizada')}
				>
					<Text className="text-white font-bold">Realizar Acción</Text>
				</TouchableOpacity>
			</Animated.View>
		</View>
	)
}

const styles = StyleSheet.create({
	sheet: {
		elevation: 10,
	},
})
