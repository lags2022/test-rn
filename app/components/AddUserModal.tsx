import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
	runOnJS,
	Easing,
} from 'react-native-reanimated'

import { UserProps } from '@/interfaces/user'
import { supabase } from '@/utils/supabase'

interface Props {
	onClose: () => void
	onUserCreated: (user: UserProps) => void
}

export default function AddUserModal({ onClose, onUserCreated }: Props) {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')

	// Valor compartido para la animación (aparece desde 0 a 1)
	const scale = useSharedValue(0)

	useEffect(() => {
		// Al montar el componente, animamos la entrada
		scale.value = withTiming(1, {
			duration: 500,
			easing: Easing.out(Easing.exp),
		})
	}, [scale])

	const closeAnimated = () => {
		// Animamos la salida
		scale.value = withTiming(0, { duration: 300 }, () => {
			runOnJS(onClose)()
		})
	}

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
			opacity: scale.value,
		}
	})

	// Ejemplo simple para crear usuario
	const handleCreateUser = async () => {
		try {
			if (!name.trim() || !email.trim()) {
				alert('Completa todos los campos')
				return
			}

			// IMPORTANTE: Usar .select() tras insert para obtener el usuario creado
			const { data, error } = await supabase
				.from('users_table')
				.insert([{ name, email }])
				.select()

			if (error) {
				throw error
			}

			if (data && data.length > 0) {
				const newUser: UserProps = data[0]

				// Avisamos a Home que se ha creado un usuario
				onUserCreated(newUser)
			}

			alert('Usuario creado con éxito')
			closeAnimated()
		} catch (err: any) {
			alert('Error al crear usuario: ' + err.message)
		}
	}

	return (
		// Contenedor principal para superponer el fondo y el contenido
		<View className="flex-1 justify-center items-center">
			{/*
        Fondo semitransparente.
        Al hacer press aquí (fuera del modal), cierra el modal.
      */}
			<TouchableOpacity
				className="absolute inset-0 bg-black/50"
				activeOpacity={1}
				onPress={closeAnimated}
			/>

			{/* Contenedor del modal animado */}
			<Animated.View
				style={[animatedStyle]}
				className="w-11/12 bg-white dark:bg-gray-800 rounded-2xl p-6 z-10"
			>
				<Text className="text-lg font-bold text-black dark:text-white mb-4">
					Crear nuevo usuario
				</Text>

				{/* Inputs */}
				<TextInput
					className="w-full border border-gray-300 dark:border-gray-700 rounded mb-4 px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700"
					placeholder="Nombre"
					placeholderTextColor="#999999"
					value={name}
					onChangeText={setName}
				/>

				<TextInput
					className="w-full border border-gray-300 dark:border-gray-700 rounded mb-4 px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700"
					placeholder="Correo"
					placeholderTextColor="#999999"
					value={email}
					onChangeText={setEmail}
				/>

				{/* Botones */}
				<View className="flex-row justify-center gap-4">
					<TouchableOpacity
						onPress={closeAnimated}
						className="px-4 py-2 bg-red-600 dark:bg-red-700 rounded"
					>
						<Text className="text-white font-semibold">Cancelar</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handleCreateUser}
						className="px-4 py-2 bg-blue-600 dark:bg-blue-700 rounded"
					>
						<Text className="text-white font-semibold">Crear</Text>
					</TouchableOpacity>
				</View>
			</Animated.View>
		</View>
	)
}
