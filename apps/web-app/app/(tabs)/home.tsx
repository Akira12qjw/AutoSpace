import CarSceneNative from '@/components/CarSceneNative'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Link } from 'expo-router'
import { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function HomeScreen() {
 
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const authToken = await AsyncStorage.getItem('authToken')
        setIsLoggedIn(!!authToken)
      } catch (error) {
        console.error('Error checking login status:', error)
      }
    }
    checkLoginStatus()
  }, [])
  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <CarSceneNative />
        {/* Bạn có thể thêm các hình vẽ vector hoặc SVG ở đây */}
      </View>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text style={styles.logo}>Autospace</Text>
          {/* <Text style={styles.subText}>Trịnh Trường Giang</Text> */}
        </View>
        {!isLoggedIn ? (
          <View style={styles.rightSection}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => console.log('Register pressed')}
            >
              <Link href="/register" style={styles.registerText}>
                Đăng Ký
              </Link>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton}>
              <Link href="/login" style={styles.loginText}>
                Đăng Nhập
              </Link>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={async () => {
              try {
                await AsyncStorage.removeItem('authToken')
                setIsLoggedIn(false)
                console.log('Logged out successfully')
              } catch (error) {
                console.error('Error logging out:', error)
              }
            }}
          >
            <Text style={styles.loginText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
        )}
      </View>
      {/* Main Content */}
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <View style={styles.needContainer}>
            <Text style={styles.needText}>Cần tìm</Text>
          </View>
          <View style={styles.parkingContainer}>
            <Text style={styles.parkingText}>Bãi đậu xe?</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.searchButton}>
          <Link href="/search" asChild>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="search" size={24} color="black" />
              <Text style={styles.searchText}>Tìm kiếm</Text>
            </View>
          </Link>
        </TouchableOpacity>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 50,
    justifyContent: 'flex-start',
  },
  textContainer: {
    marginBottom: 25,
  },
  needContainer: {
    backgroundColor: '#FFD700',
    alignSelf: 'flex-start',
    padding: 10,
    marginBottom: 5,
  },
  parkingContainer: {
    backgroundColor: '#FFD700',
    alignSelf: 'flex-start',
    padding: 10,
  },
  needText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'black',
  },
  parkingText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'black',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  searchText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    textDecorationLine: 'underline',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    paddingTop: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    height: '15%',
  },
  leftSection: {
    flexDirection: 'column',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  subText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
  },
  registerText: {
    color: '#000',
  },
  loginButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  loginText: {
    color: '#000',
    fontWeight: '500',
  },
})
