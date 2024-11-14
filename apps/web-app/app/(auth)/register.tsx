import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { router } from "expo-router";

interface FormData {
  email: string;
  password: string;
  name: string;
}

const REGISTER_MUTATION = `
  mutation RegisterWithCredentials($registerWithCredentialsInput: RegisterWithCredentialsInput!) {
    registerWithCredentials(registerWithCredentialsInput: $registerWithCredentialsInput) {
      uid
    }
  }
`;

const FormInput = ({
  control,
  name,
  title,
  error,
  secureTextEntry = false,
  placeholder,
}: {
  control: any;
  name: keyof FormData;
  title: string;
  error?: string;
  secureTextEntry?: boolean;
  placeholder?: string;
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
);

export default function Register() {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const registerWithCredentials = async (variables: {
    registerWithCredentialsInput: FormData;
  }) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: REGISTER_MUTATION,
        variables: variables,
      }),
    }).then(async (res) => {
      const { data, errors } = await res.json();
      if (errors) {
        console.log("Error", JSON.stringify(errors));
        throw new Error(errors[0].message);
      }
      return { data };
    });
  };

  const onSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      const { data } = await registerWithCredentials({
        registerWithCredentialsInput: formData,
      });

      if (data) {
        Alert.alert(
          "Success",
          `User ${data.registerWithCredentials.uid} created. 🎉`,
          [
            {
              text: "OK",
              onPress: () => {
                router.replace("/search");
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Ký</Text>
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

      <FormInput
        control={control}
        name="name"
        title="Display Name"
        error={errors.name?.message}
        placeholder="Nhập tên tài khoản"
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
          {loading ? "Đang đăng ký..." : "Đăng Ký "}
        </Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Đã có tài khoản?</Text>
        <Pressable onPress={() => router.navigate("/login")}>
          <Text style={styles.link}>Đăng Nhập</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  errorSummary: {
    color: "#666",
    fontSize: 12,
    marginBottom: 16,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  footer: {
    marginTop: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 17,
    color: "#666",
  },
  link: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    textDecorationLine: "underline",
    marginTop: 4,
  },
});
