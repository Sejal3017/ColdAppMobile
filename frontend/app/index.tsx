import React, { useEffect, useRef } from 'react';
import { Text, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function HomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value is 0

  useEffect(() => {
    // Fade-in effect
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000, // 2 seconds for the fade-in
      useNativeDriver: true,
    }).start();

    // Check login status and navigate accordingly
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          // If token exists, navigate to dashboard
          router.replace('/dashboard');
        } else {
          // If no token, navigate to login
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to check login status', error);
        router.push('/login'); // Fallback to login in case of an error
      }
    };

    // Set a timer to check login status after 3 seconds (fade-in)
    const timer = setTimeout(() => {
      checkLoginStatus();
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer when component unmounts
  }, [fadeAnim, router]);

  return (
    <Animated.View className="flex-1 justify-center items-center bg-black" style={{ opacity: fadeAnim }}>
      <Image
        source={require("./icons/cold.png")}
        className = "w-20 h-20"
        resizeMode="contain" 
      />
      <Text className="text-4xl text-white font-bold font-serif mt-5 ">Welcome!</Text>
    </Animated.View>
  );
}
