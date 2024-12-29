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
                source={{ uri: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGJhY2tncm91bmR8ZW58MHx8fHwxNjc4MjY0NzY0&ixlib=rb-4.0.3&q=80&w=1080' }} // New background image
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
                                        <Text variant="titleMedium" style={styles.cardTitle}>{item.title}</Text>
                                        <Text variant="bodyMedium" style={styles.description}>{item.description}</Text>
                                    </Card.Content>
                                    <Card.Actions>
                                        <Button 
                                            onPress={() => handleDeleteTodo(item._id)} 
                                            labelStyle={styles.deleteButtonText}
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
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inputContainer}>
                            <TextInput 
                                label="Title" 
                                value={title} 
                                onChangeText={setTitle} 
                                style={styles.input}
                                mode="outlined" 
                                activeOutlineColor="#6200ee" // Primary color for active outline
                                outlineColor="#6200ee" // Primary color for default outline
                                labelStyle={styles.labelStyle} // Consistent label style
                            />
                            <TextInput 
                                label="Description" 
                                value={description} 
                                onChangeText={setDescription}
                                style={styles.input} 
                                mode="outlined" 
                                activeOutlineColor="#6200ee" // Primary color for active outline
                                outlineColor="#6200ee" // Primary color for default outline
                                labelStyle={styles.labelStyle} // Consistent label style
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
                            color="black" // Icon color
                            theme={{ colors: { surface: 'white' } }} // FAB background color
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black for contrast
        borderRadius: 16, // Rounded corners for the container
        margin: 16, // Margin around the container
    },
    title: {
        marginTop: 16,
        marginHorizontal: 16,
        color: '#fff', // White text for contrast
        fontSize: 28, // Increased font size for title
        fontWeight: 'bold', // Bold title
    },
    listContainer: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        borderRadius: 12, // Rounded corners for cards
        backgroundColor: '#fff', // White background for cards
    },
    cardTitle: {
        fontWeight: 'bold', // Bold title in card
        fontSize: 18, // Increased font size for card title
    },
    description: {
        marginTop: 8,
        color: 'gray',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: 'white', // White background for FAB
        elevation: 5, // Shadow effect for FAB
        borderRadius: 28, // Rounded FAB
    },
    inputContainer: {
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        elevation: 5,
        backgroundColor: 'white', // White background for input container
    },
    input: {
        marginBottom: 12,
        borderRadius: 8, // Rounded corners for input fields
    },
    addButton: {
        marginTop: 12,
        backgroundColor: '#6200ee', // Primary color for Add Todo button
    },
    addButtonText: {
        color: 'white', // White text for Add Todo button
    },
    cancelButton: {
        marginTop: 8,
    },
    cancelButtonText: {
        color: '#6200ee', // Primary color for Cancel button
    },
    deleteButtonText: {
        color: 'red', // Red text for Delete button
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelStyle: {
        color: '#6200ee', // Primary color for label
    },
});

export default TodosScreen;
