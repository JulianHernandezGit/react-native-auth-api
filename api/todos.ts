import axios from "axios";
import * as FileSystem from 'expo-file-system';


const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface Todo {
    _id: string;
    task: string;
    status: number;
    img?: string;
}

export const getTodos = async (): Promise<Todo[]> => {
    const result = await axios.get(`${API_URL}/todos/me`);
    console.log('getTodos', result);
    
    return result.data;
}

export const createTodo = async (task: string): Promise<Todo> => {
    const todo = {
        task,
        status: 0,
        desc: "",
        private: true
    };
    const result = await axios.post(`${API_URL}/todos`, todo);
    return result.data;
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
    const result = await axios.put(`${API_URL}/todos/${todo._id}`, todo);
    return result.data;
};

export const deleteTodo = async (id: string): Promise<Todo> => {
    const result = await axios.delete(`${API_URL}/todos/${id}`);
    return result.data;
}

export const uploadImage = async ({ id, uri, token }: { id: string, uri: string, token: string}) => {
    return FileSystem.uploadAsync(`${API_URL}/todos/${id}/img`, uri, {
            httpMethod: 'POST',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: 'file',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => JSON.parse(res.body));
}