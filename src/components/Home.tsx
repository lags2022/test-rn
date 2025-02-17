import React, { useEffect, useState } from 'react'
import {
	View,
	FlatList,
	TouchableOpacity,
	Text,
	ActivityIndicator,
	Modal,
} from 'react-native'
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated'

import AddUserModal from '@/components/AddUserModal'
import UserDetailsBottomSheet from '@/components/UserDetailsBottomSheet'
import { UserProps } from '@/interfaces/user'
import { supabase } from '@/utils/supabase'

export default function Home() {
	const [users, setUsers] = useState<UserProps[]>([])
	const [selectedUser, setSelectedUser] = useState<UserProps | null>(null)
	const [showAddUserModal, setShowAddUserModal] = useState(false)

	// Al montar, obtenemos la lista de usuarios
	useEffect(() => {
		fetchUsers()
	}, [])

	const fetchUsers = async () => {
		try {
			const { data, error } = await supabase.from('users_table').select('*')
			if (error) throw new Error(error.message)
			setUsers(data || [])
		} catch (error: any) {
			console.error('Error fetching users:', error.message)
		}
	}

	// Se llama cuando se ha creado un nuevo usuario
	const handleUserCreated = (newUser: UserProps) => {
		// Opción A: Actualizar la lista localmente
		setUsers((prev) => [newUser, ...prev])

		// Opción B: Volver a consultar toda la lista de Supabase
		// fetchUsers()
	}

	const handleUserPress = (user: UserProps) => {
		setSelectedUser(user)
	}

	const handleCloseUserDetails = () => {
		setSelectedUser(null)
	}

	const handleOpenAddUserModal = () => {
		setShowAddUserModal(true)
	}

	const handleCloseAddUserModal = () => {
		setShowAddUserModal(false)
	}

	return (
		<View className="flex-1 bg-white dark:bg-black">
			{/* Header */}
			<View className="p-4 flex-row items-center justify-center bg-white dark:bg-black shadow-md">
				<Text className="flex-1 text-xl font-bold text-center text-black dark:text-white">
					Lista de Usuarios
				</Text>

				{/* Botón + para abrir modal */}
				<TouchableOpacity
					onPress={handleOpenAddUserModal}
					className="bg-blue-600 dark:bg-blue-700 px-3 py-1 rounded-full"
				>
					<Text className="text-white font-bold text-lg">+</Text>
				</TouchableOpacity>
			</View>

			{/* Lista de usuarios */}
			{users.length === 0 ? (
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color="#8888ff" />
					<Text className="text-black dark:text-white mt-4">Cargando...</Text>
				</View>
			) : (
				<FlatList
					data={users}
					keyExtractor={(item) => item.id.toString()}
					contentContainerStyle={{ padding: 16 }}
					renderItem={({ item }) => (
						<Animated.View
							entering={FadeInRight.delay(100)}
							exiting={FadeOutRight}
							style={{ marginBottom: 8 }}
						>
							<TouchableOpacity
								onPress={() => handleUserPress(item)}
								className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
							>
								<Text className="text-lg font-semibold text-black dark:text-white">
									{item.name}
								</Text>
								<Text className="text-gray-700 dark:text-gray-300">
									{item.email}
								</Text>
							</TouchableOpacity>
						</Animated.View>
					)}
				/>
			)}

			{/* Bottom Sheet de detalles de usuario */}
			{selectedUser && (
				<UserDetailsBottomSheet
					user={selectedUser}
					onClose={handleCloseUserDetails}
				/>
			)}

			{/* Modal para crear usuario */}
			<Modal
				animationType="slide"
				transparent
				visible={showAddUserModal}
				onRequestClose={handleCloseAddUserModal}
			>
				<AddUserModal
					onClose={handleCloseAddUserModal}
					onUserCreated={handleUserCreated} // Pasamos el callback
				/>
			</Modal>
		</View>
	)
}
