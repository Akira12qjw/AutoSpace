import { StyleSheet, Text, View } from 'react-native'

export default function booking() {
  return (
    <View>
      <Text style={styles.normalText}>Bookings</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  normalText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
})
