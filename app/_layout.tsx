import { Slot } from 'expo-router'
import '../global.css'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from 'react-native-safe-area-context'

export default function Layout() {
	const insets = useSafeAreaInsets()

	return (
		<SafeAreaProvider>
			<StatusBar style="dark" />
			<View
				className="flex-1"
				style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
			>
				<Slot />
			</View>
		</SafeAreaProvider>
	)
}
