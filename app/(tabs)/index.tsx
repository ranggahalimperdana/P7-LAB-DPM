import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, ImageBackground } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Dialog,
    FAB,
    Portal,
    Provider as PaperProvider,
    Text,
    TextInput
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTodos } from '@/context/TodoContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from '@/config/config';
import Constants from "expo-constants/src/Constants";

const TodosScreen = () => {
    const { todos, fetchTodos } = useTodos();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const loadTodos = async () => {
            setLoading(true);
            await fetchTodos();
            setLoading(false);
        };
        loadTodos();
    }, []);

    const handleAddTodo = async () => {
        if (!title || !description) {
            setDialogMessage('Both title and description are required.');
            setDialogVisible(true);
            return;
        }
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.post(`${API_URL}/api/todos`, {
                title,
                description
            }, { headers: { Authorization: `Bearer ${token}` } });
            fetchTodos();
            setTitle('');
            setDescription('');
            setIsAdding(false);
        } catch (error) {
            setDialogMessage('Failed to add todo');
            setDialogVisible(true);
        }
    };

    const handleDeleteTodo = async (id: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${API_URL}/api/todos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchTodos();
        } catch (error) {
            setDialogMessage('Failed to delete todo');
            setDialogVisible(true);
        }
    };

    return (
        <PaperProvider>
            <ImageBackground 
                source={{ uri: 'https://i.pinimg.com/736x/cf/64/18/cf641839896b77687ff19e079eeb95e2.jpg' }} // Ganti dengan URL gambar latar belakang Anda
                style={styles.background}
            >
                <ThemedView style={styles.container}>
                    <ThemedText style={styles.title} type="title">MY DAY LIST</ThemedText>
                    {loading ? (
                        <ActivityIndicator style={styles.loading} animating={true} />
                    ) : (
                        <FlatList
                            data={todos}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <Card style={styles.card} elevation={3} onPress={() => router.push(`../todo/${item._id}`)}>
                                    <Card.Content>
                                        <Text variant="titleMedium">{item.title}</Text>
                                        <Text variant="bodyMedium" style={styles.description}>{item.description}</Text>
                                    </Card.Content>
                                    <Card.Actions>
                                        <Button 
                                            onPress={() => handleDeleteTodo(item._id)} 
                                            labelStyle={styles.deleteButtonText} // Ubah warna teks tombol Delete menjadi merah
                                        >
                                            Delete
                                        </Button>
                                    </Card.Actions>
                                </Card>
                            )}
                            contentContainerStyle={styles.listContainer}
                        />
                    )}
                    {isAdding && (
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                                              style={styles.inputContainer}>
                            <TextInput 
                                label="Title" 
                                value={title} 
                                onChangeText={setTitle} 
                                style={styles.input}
                                mode="outlined" 
                                activeOutlineColor="red" // Ubah warna garis luar saat aktif menjadi merah
                                outlineColor="red" // Ubah warna garis luar menjadi merah
                                labelStyle={{ color: 'red' }} // Ubah warna label menjadi merah
                            />
                            <TextInput 
                                label="Description" 
                                value={description} 
                                onChangeText={setDescription}
                                style={styles.input} 
                                mode="outlined" 
                                activeOutlineColor="red" // Ubah warna garis luar saat aktif menjadi merah
                                outlineColor="red" // Ubah warna garis luar menjadi merah
                                labelStyle={{ color: 'red' }} // Ubah warna label menjadi merah
                                multiline 
                            />
                            <Button mode="contained" onPress={handleAddTodo} style={styles.addButton} labelStyle={styles.addButtonText}>Add Todo</Button>
                            <Button onPress={() => setIsAdding(false)} style={styles.cancelButton} labelStyle={styles.cancelButtonText}>Cancel</Button>
                        </KeyboardAvoidingView>
                    )}
                    {!isAdding && (
                        <FAB
                            style={styles.fab}
                            icon="plus"
                            onPress={() => setIsAdding(true)}
                            label="Add Todo"
                            color="black" // Ubah warna ikon menjadi hitam
                            theme={{ colors: { surface: 'white' } }} // Ubah latar belakang FAB menjadi putih
                        />
                    )}
                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                            <Dialog.Title>Alert</Dialog.Title>
                            <Dialog.Content>
                                <Text>{dialogMessage}</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => setDialogVisible(false)}>OK</Button>
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
        paddingTop: Constants.statusBarHeight,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Ubah latar belakang menjadi transparan hitam untuk kontras
    },
    title: {
        marginTop: 16,
        marginHorizontal: 16,
        color: '#fff', // Ubah warna teks menjadi putih agar kontras
    },
    listContainer: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        borderRadius: 8,
    },
    description: {
        marginTop: 8,
        color: 'gray',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: 'white', // Ubah latar belakang FAB menjadi putih
        elevation: 5, // Tambahkan elevasi untuk memberikan efek bayangan
    },
    inputContainer: {
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        elevation: 5,
        backgroundColor: 'white', // Ubah latar belakang input menjadi putih
    },
    input: {
        marginBottom: 12,
    },
    addButton: {
        marginTop: 12,
        backgroundColor: 'black', // Ubah latar belakang tombol Add Todo menjadi hitam
    },
    addButtonText: {
        color: 'white', // Ubah warna teks tombol Add Todo menjadi putih agar kontras
    },
    cancelButton: {
        marginTop: 8,
    },
    cancelButtonText: {
        color: 'blue', // Ubah warna teks tombol Cancel menjadi biru
    },
    deleteButtonText: {
        color: 'red', // Ubah warna teks tombol Delete menjadi merah
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TodosScreen;
