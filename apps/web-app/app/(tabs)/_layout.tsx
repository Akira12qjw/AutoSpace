import { Tabs } from 'expo-router'
import React, { useEffect, useState } from 'react'

import { TabBarIcon } from '@/components/navigation/TabBarIcon'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Text, TouchableOpacity, View } from 'react-native'

export default function TabLayout() {
  const colorScheme = useColorScheme()
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
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'blue',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Tìm kiếm',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'search-circle-sharp' : 'search-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Đặt chỗ',
          tabBarIcon: ({ color, focused }) => (
            <TouchableOpacity
              onPress={() => {
                if (!isLoggedIn) {
                  alert('Vui lòng đăng nhập để sử dụng tính năng này')
                } else {
                  // Logic điều hướng đến màn hình Đặt chỗ của bạn, ví dụ:
                  // navigation.navigate("BookingsScreen")
                }
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TabBarIcon
                  name={focused ? 'ticket' : 'ticket-outline'}
                  color={color}
                />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  )
}
