import React, { useState, useEffect } from 'react'
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	TouchableOpacity,
	Modal,
	TextInput,
	Button,
	Alert,
} from 'react-native'

import { supabase } from '@/utils/supabase'

type Prueba1 = {
	id: number
	email: string
	name: string
}

export default function App() {
	const [prueba1, setPrueba1] = useState<Prueba1[]>([])
	const [modalVisible, setModalVisible] = useState(false)
	const [newTitle, setNewTitle] = useState('')
	const [newDescription, setNewDescription] = useState('')

	useEffect(() => {
		const getTodos = async () => {
			try {
				let { data, error } = await supabase.from('users_table').select('*')
				if (error) {
					console.error('Error fetching todos:', error.message)
					return
				}
				if (data && data.length > 0) {
					setPrueba1(data)
				}
			} catch (error: any) {
				console.error('Error fetching todos:', error.message)
			}
		}
		getTodos()
	}, [])

	const addNewItem = async () => {
		if (!newTitle || !newDescription) {
			Alert.alert('Error', 'Por favor, completa todos los campos.')
			return
		}

		try {
			const { data, error } = await supabase
				.from('prueba1')
				.insert([{ title: newTitle, description: newDescription }])
			if (error) {
				console.error('Error adding item:', error.message)
				Alert.alert('Error', 'No se pudo agregar el elemento.')
				return
			}
			setPrueba1([
				...prueba1,
				{ id: Date.now(), name: newTitle, email: newDescription },
			])
			setNewTitle('')
			setNewDescription('')
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
				data={prueba1}
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
							value={newTitle}
							onChangeText={setNewTitle}
							style={styles.input}
						/>
						<TextInput
							placeholder="Descripción"
							value={newDescription}
							onChangeText={setNewDescription}
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
