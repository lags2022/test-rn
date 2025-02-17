import { useState, useEffect } from 'react'
import {
	View,
	Text,
	Alert,
	TouchableOpacity,
	FlatList,
	Modal,
	TextInput,
	Button,
	StyleSheet,
} from 'react-native'

import { supabase } from '@/utils/supabase'

type User = {
	id: number
	email: string
	name: string
}

export const Home = () => {
	const [user, setUser] = useState<User[]>([])
	const [modalVisible, setModalVisible] = useState(false)
	const [newName, setNewName] = useState('')
	const [newEmail, setNewEmail] = useState('')

	useEffect(() => {
		const getTodos = async () => {
			try {
				let { data, error } = await supabase.from('users_table').select('*')
				if (error) {
					console.error('Error fetching todos:', error.message)
					return
				}
				if (data && data.length > 0) {
					setUser(data)
				}
			} catch (error: any) {
				console.error('Error fetching todos:', error.message)
			}
		}
		getTodos()
	}, [])

	const addNewItem = async () => {
		if (!newName || !newEmail) {
			Alert.alert('Error', 'Por favor, completa todos los campos.')
			return
		}

		try {
			const { data, error } = await supabase
				.from('users_table')
				.insert([{ name: newName, email: newEmail }])
			if (error) {
				console.error('Error adding item:', error.message)
				Alert.alert('Error', 'No se pudo agregar el elemento.')
				return
			}
			const newUser = {
				id: new Date().getTime(),
				name: newName,
				email: newEmail,
			} satisfies User

			setUser([...user, newUser])

			setNewName('')
			setNewEmail('')
			setModalVisible(false)
		} catch (error: any) {
			console.error('Error adding item:', error.message)
		}
	}

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.title}>Lista de Tareas</Text>
				<TouchableOpacity
					style={styles.addButton}
					onPress={() => setModalVisible(true)}
				>
					<Text style={styles.addButtonText}>+</Text>
				</TouchableOpacity>
			</View>

			{/* Lista de elementos */}
			<FlatList
				data={user}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<View style={styles.itemContainer}>
						<Text style={styles.itemTitle}>{item.name}</Text>
						<Text style={styles.itemDescription}>{item.email}</Text>
					</View>
				)}
				contentContainerStyle={styles.listContent}
			/>

			{/* Modal para agregar nuevos elementos */}
			<Modal visible={modalVisible} animationType="slide" transparent>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Agregar Nuevo Elemento</Text>
						<TextInput
							placeholder="Título"
							value={newName}
							onChangeText={setNewName}
							style={styles.input}
						/>
						<TextInput
							placeholder="Descripción"
							value={newEmail}
							onChangeText={setNewEmail}
							style={styles.input}
						/>
						<View style={styles.modalButtons}>
							<Button
								title="Cancelar"
								onPress={() => setModalVisible(false)}
								color="#FF4500"
							/>
							<Button title="Guardar" onPress={addNewItem} color="#32CD32" />
						</View>
					</View>
				</View>
			</Modal>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		paddingTop: 40,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
	},
	addButton: {
		backgroundColor: '#32CD32',
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
	},
	addButtonText: {
		fontSize: 30,
		color: '#fff',
	},
	listContent: {
		paddingHorizontal: 20,
	},
	itemContainer: {
		backgroundColor: '#fff',
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 2,
	},
	itemTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#333',
	},
	itemDescription: {
		fontSize: 14,
		color: '#666',
		marginTop: 5,
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		backgroundColor: '#fff',
		padding: 20,
		borderRadius: 10,
		width: '80%',
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 20,
		color: '#333',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 5,
		padding: 10,
		marginBottom: 15,
		fontSize: 16,
	},
	modalButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
})
