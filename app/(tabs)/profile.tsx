import React, { useEffect, useState } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ActivityIndicator, Button, Dialog, PaperProvider, Portal, Text } from 'react-native-paper';
import API_URL from '@/config/config';

type UserProfile = {
    username: string;
    email: string;
};

const ProfileScreen = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get<{ data: UserProfile }>(`${API_URL}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(response.data.data);
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setDialogVisible(true);
    };

    const confirmLogout = async () => {
        await AsyncStorage.removeItem('token');
        router.replace('/auth/LoginScreen');
    };

    if (loading) {
        return (
            <PaperProvider>
                <ThemedView style={styles.container}>
                    <ActivityIndicator animating={true} />
                </ThemedView>
            </PaperProvider>
        );
    }

    return (
        <PaperProvider>
            <ImageBackground 
                source={{ uri: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGJhY2tncm91bmR8ZW58MHx8fHwxNjc4MjY0NzY0&ixlib=rb-4.0.3&q=80&w=1080' }} // Updated background image
                style={styles.background}
            >
                <ThemedView style={styles.container}>
                    {profile ? (
                        <ThemedView style={styles.profileContainer}>
                            <ThemedText style={styles.title}>Profile</ThemedText>
                            <ThemedText style={styles.label}>Username:</ThemedText>
                            <ThemedText style={styles.username}>{profile.username}</ThemedText>
                            <ThemedText style={styles.label}>Email:</ThemedText>
                            <ThemedText style={styles.email}>{profile.email}</ThemedText>
                            <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
                                Log Out
                            </Button>
                        </ThemedView>
                    ) : (
                        <ThemedText>No profile data available</ThemedText>
                    )}
                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                            <Dialog.Title>Logout</Dialog.Title>
                            <Dialog.Content>
                                <Text>Are you sure you want to logout?</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
                                <Button onPress={confirmLogout}>OK</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </ThemedView>
            </ImageBackground>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black for contrast
    },
    profileContainer: {
        alignItems: 'flex-start', // Align left for profile elements
        padding: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white for profile background
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#6200ee', // Primary color for title
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
        color: '#fff', // White color for labels
    },
    username: {
        fontSize: 16,
        color: '#000', // Black color for username
    },
    email: {
        fontSize: 16,
        color: '#6200ee', // Primary color for email
    },
    logoutButton: {
        marginTop: 16,
        backgroundColor: '#6200ee', // Primary color for logout button
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProfileScreen;
