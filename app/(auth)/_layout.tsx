import { useAuth } from "../../provider/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";

const InsideLayout = () => {
    const { onLogout, token } = useAuth();

    return (
        <Stack>
            <Stack.Screen name="todos" options={{ headerTitle: 'Todo App', headerRight: () => (
                <TouchableOpacity onPress={onLogout}>
                    <Ionicons name="log-out-outline" size={24} color="black" />
                </TouchableOpacity>
            ), 
        }}
        redirect={!token}
        />
        </Stack>
    ) 
};

export default InsideLayout;