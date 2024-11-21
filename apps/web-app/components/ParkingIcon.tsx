import { View, Text, StyleSheet } from 'react-native'

export const ParkingIcon = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>P</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 24, // equivalent to w-6 (6 * 4px)
    height: 24, // equivalent to h-6
    backgroundColor: 'white',

    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // for Android shadow
  },
  text: {
    fontSize: 18, // equivalent to text-lg
    fontWeight: 'bold',
  },
})
