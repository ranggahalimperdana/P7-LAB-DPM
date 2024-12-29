import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { ThemedView } from "@/components/ThemedView";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";
import API_URL from "../../config/config";

export default function RegisterScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        try {
            await axios.post(`${API_URL}/api/auth/register`, { username, password, email });
            router.replace("/auth/LoginScreen");
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || "An error occurred";
            setDialogMessage(errorMessage);
            setDialogVisible(true);
        }
    };

    return (
        <PaperProvider>
            <ThemedView style={styles.container}>
                <Text style={styles.title}>Welcome to Our App!</Text>
                <Text style={styles.subtitle}>Join us and get started</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/auth/LoginScreen")}>
                    <Text style={styles.loginButtonText}>Already have an account? Login</Text>
                </TouchableOpacity>
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                        <Dialog.Title>Registration Failed</Dialog.Title>
                        <Dialog.Content>
                            <Text>{dialogMessage}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setDialogVisible(false)}>OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ThemedView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#f5f5f5", // Light background for better contrast
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#333", // Darker text for better readability
    },
    subtitle: {
        fontSize: 16,
        color: "#666", // Subtle color for the subtitle
        marginBottom: 32,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 16,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // For Android shadow
    },
    registerButton: {
        width: "100%",
        height: 50,
        backgroundColor: "#6200ee", // Primary color for the button
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    registerButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    loginButton: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#6200ee", // Match border color with button
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    loginButtonText: {
        color: "#6200ee", // Primary color for the text
        fontSize: 16,
        fontWeight: "600",
    },
});
