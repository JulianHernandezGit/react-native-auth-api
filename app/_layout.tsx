import { Slot, useRouter, useSegments } from "expo-router"
import { AuthProvider, useAuth } from "../provider/AuthProvider";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const InitialLayout = () => {
    const { token, initialized } = useAuth();
    const router = useRouter();
    const segments = useSegments();
    
    useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (token && !inAuthGroup) {
        router.replace("/(auth)/todos");
    } else if (!token && inAuthGroup) {
        router.replace("/(public)/login");
    }
    }, [token, initialized]);
    return <Slot />;
};

const RootLayout = () => {
    return (
    <AuthProvider>
        <QueryClientProvider client={queryClient}>
        <InitialLayout />
        </QueryClientProvider>
    </AuthProvider>
    )
};

export default RootLayout;