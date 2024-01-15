import { Button, FlatList, ListRenderItem, StyleSheet, Text, TextInput, TouchableOpacity, Image, View } from 'react-native';
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Todo, createTodo, deleteTodo, getTodos, updateTodo, uploadImage } from '../../api/todos';
import { Entypo, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../provider/AuthProvider';

const Page = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const [todo, setTodo] = useState('');

  const query = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });

  const addMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setTodo('');
    },
  });

  const updateQueryClient = (updatedTodo: Todo) => {
    queryClient.setQueryData(['todos'], (data: any) => {
      return data.map((item: Todo) => (item._id === updatedTodo._id ? updatedTodo : item));
    });
  };

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: updateQueryClient,
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: updateQueryClient,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const addTodo = () => {
    addMutation.mutate(todo);
  };

  const renderTodo: ListRenderItem<Todo> = ({ item }) => {
    const deleteTodo = () => {
      deleteMutation.mutate(item._id);
    };

    const toggleDone = () => {
      const updatedTodo = { ...item, status: item.status === 1 ? 0 : 1 };
      updateMutation.mutate(updatedTodo);
    };

    const captureImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        uploadImageMutation.mutate({ id: item._id, uri, token: token! });
      }
    };

    return (
      <View style={{ marginBottom: 6 }}>
        {item.img && <Image source={{ uri: item.img, headers: { Authorization: `Bearer ${token}` } }} style={{ width: '100%', height: 200, opacity: item.status === 0 ? 1 : 0.4 }} />}
        <View style={styles.todoContainer}>
          <TouchableOpacity onPress={toggleDone} style={styles.todo}>
            {item.status === 1 && <Ionicons name="checkmark-circle-outline" size={24} color={'green'} />}
            {item.status === 0 && <Entypo name="circle" size={24} color={'black'} />}
            <Text style={styles.todoText}>{item.task}</Text>
          </TouchableOpacity>
          <Ionicons name="trash-bin-outline" size={24} color={'red'} onPress={deleteTodo} />
          <Ionicons name="camera-outline" size={24} color={'blue'} onPress={captureImage} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput placeholder="Add new todo" style={styles.input} value={todo} onChangeText={setTodo} />
        <Button title="Add" onPress={addTodo} disabled={todo === ''} />
      </View>
      <FlatList data={query.data} renderItem={renderTodo} keyExtractor={(todo) => todo._id} />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
  },
  form: {
    flexDirection: 'row',
    marginVertical: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ccc',
    padding: 10,
    backgroundColor: '#fff',
  },
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
    marginVertical: 4,
    backgroundColor: '#fff',
  },
  todo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  todoText: {
    flex: 1,
    paddingHorizontal: 10,
  },
});