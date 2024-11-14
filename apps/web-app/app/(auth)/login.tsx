import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
interface FormData {
  email: string
  password: string
}

const FormInput = ({
  control,
  name,
  title,
  error,
  secureTextEntry = false,
  placeholder,
}: {
  control: any
  name: keyof FormData
  title: string
  error?: string
  secureTextEntry?: boolean
  placeholder?: string
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{title}</Text>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <TextInput
          style={styles.input}
          onChangeText={onChange}
          value={value}
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          placeholderTextColor="#666"
        />
      )}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
)

export default function Login() {
  const [loading, setLoading] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const loginWithCredentials = async (variables: {
    email: string
    password: string
  }) => {
    return await fetch('http://192.168.1.188:3000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(variables),
    }).then(async (res) => {
      const { token, user, error } = await res.json()

      if (error) {
        console.log('Error', error)
        throw new Error(error)
      }
      return { token, user }
    })
  }

  const onSubmit = async (formData: FormData) => {
    try {
      setLoading(true)
      const { token, user } = await loginWithCredentials({
        email: formData.email,
        password: formData.password,
      })

      if (token && user) {
        await AsyncStorage.setItem('authToken', token)
        await AsyncStorage.setItem('user', JSON.stringify(user))
        Alert.alert('Success', `login success. 🎉`, [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/home')
            },
          },
        ])
      }
    } catch (error) {
      Alert.alert('Error')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
      <FormInput
        control={control}
        name="email"
        title="Email"
        error={errors.email?.message}
        placeholder="Enter the email."
      />

      <FormInput
        control={control}
        name="password"
        title="Password"
        error={errors.password?.message}
        secureTextEntry
        placeholder="······"
      />

      {Object.keys(errors).length > 0 && (
        <Text style={styles.errorSummary}>
          Please fix the above {Object.keys(errors).length} errors
        </Text>
      )}

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Đang đăng nhập...' : 'Đăng Nhập '}
        </Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Chưa có tài khoản?</Text>
        <Pressable onPress={() => router.navigate('/register')}>
          <Text style={styles.link}>Đăng Ký</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  errorSummary: {
    color: '#666',
    fontSize: 12,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 17,
    color: '#666',
  },
  link: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
})
