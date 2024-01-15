import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const Page = () => {
  return (
  <Stack>
    <Stack.Screen name="login" options={{ headerTitle: 'Todo App' }} />
    <Stack.Screen name="register" options={{ headerTitle: 'Create Account' }} />
  </Stack>
  )
}

export default Page

const styles = StyleSheet.create({})