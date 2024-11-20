// authService.ts
import axios from 'axios'

// Nếu đang chạy trên máy ảo Android
const API_URL = 'http://localhost:3000'

export const signIn = async (credentials: {
  email: string
  password: string
}) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/login`,
      {
        ...credentials,
        json: true,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    return response.data
  } catch (error) {
    throw error
  }
}
