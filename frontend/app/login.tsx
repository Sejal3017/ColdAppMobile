import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Alert, Image, TouchableOpacity, KeyboardAvoidingView, Platform} from 'react-native';
import { useRouter } from 'expo-router'; // Use expo-router for navigation
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { ScrollView }  = require('react-native');
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();  // Use router instead of useNavigation for expo-router

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // If token exists, navigate to the dashboard directly
        router.replace('/dashboard');
      }
    };
    checkLoggedIn();
  }, []);
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }
  
    setLoading(true);
    const userData = {
      email: email,
      password,
    };
  
    try {

      const res = await axios.post(`${BASE_URL}/login-user`, userData);
  
      if (res.data.status === 'ok') {
        Alert.alert('Login Successful');
  
        // Store token and user session details in AsyncStorage
        await AsyncStorage.setItem('token', res.data.data); // Store JWT token
        await AsyncStorage.setItem('isLoggedIn', 'true');
  
        // Navigate after successful login
        setTimeout(() => {
          setLoading(false);
          router.replace('/dashboard'); // Navigate to dashboard after successful login
        }, 1000);
      } else {
        // Handle case where login fails
        setLoading(false);
        Alert.alert('Login Failed', res.data.message || 'Invalid credentials');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error during login:', error); // Log the actual error
      if (error.response) {
        // If the error is from the API response (non 2xx status)
        Alert.alert('Login Failed', error.response.data.message || 'Invalid credentials');
      } else {
        // For any other error (network issues, etc.)
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    }
  };
  

  return (
    <KeyboardAvoidingView 
    style={{ flex: 1 }} 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjusts behavior for iOS/Android
    keyboardVerticalOffset={40}> 
    <ScrollView className="flex-auto" contentContainerStyle = {{flexGrow:1}} keyboardShouldPersistTaps="handled">
    <View className = "w-full h-full top-32  pb-20">
      <View className="items-center">
      <Image
        source={require("./icons/login.png")}
        className = "w-40 h-40"
        resizeMode="contain" 
      /></View>
      <View className = "flex items-center">
        <Text className = "text-blue-950 font-bold tracking-wider text-4xl mb-10">LOG IN</Text>
      </View>

      <View className="flex items-center mx-4 space-y-4">
        <View className="bg-black/5 p-5 rounded-md w-full">
          <TextInput
          placeholder="Email"
          value={email} 
          onChangeText={setEmail}
          placeholderTextColor="#9CA3AF"/>
        </View>

        <View className="bg-black/5 p-5 rounded-md w-full mb-8">
          <TextInput 
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#9CA3AF"/>
        </View>

        <View className="w-full items-center">
          <TouchableOpacity
            className="w-40 bg-blue-950 p-3 rounded-md mb-5"
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-xl font-bold text-white text-center">
              {loading ? 'Logging in...' : 'LOGIN'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center">
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text className='text-bold text-blue-950'>Don't have an account? <Text className='underline'>SIGN UP</Text></Text>
          </TouchableOpacity> 
        </View>

      </View>

  </View></ScrollView></KeyboardAvoidingView>
    
  );
}
